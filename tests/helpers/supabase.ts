/**
 * Real-DB integration test helpers (Constitution §III).
 *
 * Provides:
 *   - `adminClient()`     — service-role client that bypasses RLS, used for fixtures
 *   - `userClient(email)` — anon client signed in as a test user (RLS applies)
 *   - `ensureUser()`      — idempotently provision a test user + profile
 *   - `resetKudosTables()`— truncate transactional tables between tests
 *
 * All helpers connect to the Supabase URL configured in `.env.test`, which
 * defaults to the local stack from `supabase start`. Integration tests will
 * fail fast (with a helpful message) if the URL is unreachable.
 */
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function requireEnv() {
  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    throw new Error(
      'Integration tests require NEXT_PUBLIC_SUPABASE_URL, ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY ' +
      'to be set (typically via .env.test). Did you run `supabase start`?'
    )
  }
}

/** Service-role client. Bypasses RLS — use ONLY for fixture setup, never in product code. */
export function adminClient(): SupabaseClient {
  requireEnv()
  return createSupabaseClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** Anon client signed in as a known test user. RLS policies apply. */
export async function userClient(email: string, password = 'test-password-123'): Promise<SupabaseClient> {
  requireEnv()
  const c = createSupabaseClient(SUPABASE_URL!, ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { error } = await c.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`signIn failed for ${email}: ${error.message}`)
  return c
}

export interface TestUser {
  id: string
  email: string
  password: string
}

/**
 * Idempotently create a test user + corresponding profiles row.
 * Re-running the same email returns the existing user instead of erroring.
 */
export async function ensureUser(opts: {
  email: string
  fullName?: string
  departmentCode?: string | null
  password?: string
}): Promise<TestUser> {
  const password = opts.password ?? 'test-password-123'
  const admin = adminClient()

  let userId: string
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: opts.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: opts.fullName },
  })

  if (createErr) {
    // Already exists — look up via paginated list.
    if (createErr.message.includes('already') || createErr.status === 422) {
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
      const existing = list?.users.find((u) => u.email === opts.email)
      if (!existing) throw createErr
      userId = existing.id
    } else {
      throw createErr
    }
  } else {
    userId = created.user!.id
  }

  // Profile must exist before kudos can reference the user (FK on profiles in views).
  const { error: upsertErr } = await admin.from('profiles').upsert({
    id: userId,
    full_name: opts.fullName ?? null,
    department_code: opts.departmentCode ?? null,
  })
  if (upsertErr) throw upsertErr

  return { id: userId, email: opts.email, password }
}

/**
 * Truncate all Kudos transactional tables. Reference data (departments,
 * hashtags, special_days) is NOT touched — seed those once per file via
 * `beforeAll` so they're shared across tests.
 *
 * Order matters: child tables before parents to satisfy FK constraints.
 */
export async function resetKudosTables(): Promise<void> {
  const admin = adminClient()
  const ZERO_UUID = '00000000-0000-0000-0000-000000000000'
  // .neq() with a sentinel UUID is the supported way to mass-delete in supabase-js.
  await admin.from('hearts').delete().neq('id', ZERO_UUID)
  await admin.from('kudos_hashtags').delete().neq('kudos_id', ZERO_UUID)
  await admin.from('kudos_highlight_flags').delete().neq('kudos_id', ZERO_UUID)
  await admin.from('kudos').delete().neq('id', ZERO_UUID)
  await admin.from('secret_boxes').delete().neq('id', ZERO_UUID)
}

/** Insert a department + return its row. Idempotent on `code`. */
export async function ensureDepartment(code: string, name = code): Promise<void> {
  const admin = adminClient()
  const { error } = await admin.from('departments').upsert(
    { code, name, active: true },
    { onConflict: 'code' }
  )
  if (error) throw error
}

/** Insert a hashtag + return id. Idempotent on `name`. */
export async function ensureHashtag(name: string): Promise<string> {
  const admin = adminClient()
  const { data, error } = await admin
    .from('hashtags')
    .upsert({ name }, { onConflict: 'name' })
    .select('id')
    .single()
  if (error) throw error
  return (data as { id: string }).id
}

/** Insert a kudos row. Returns the kudos id. */
export async function insertKudos(opts: {
  senderId: string
  receiverId: string
  content: string
  /** Optional title. Defaults to a non-empty string so the NOT NULL +
   *  CHECK (char_length > 0) constraint added by 20260429000002_kudos_compose.sql passes. */
  title?: string
  hashtags?: string[]
  featured?: boolean
}): Promise<string> {
  const admin = adminClient()
  const { data: kudo, error } = await admin
    .from('kudos')
    .insert({
      sender_id: opts.senderId,
      receiver_id: opts.receiverId,
      content: opts.content,
      title: opts.title ?? 'Test kudos title',
    })
    .select('id')
    .single()
  if (error) throw error
  const kudosId = (kudo as { id: string }).id

  if (opts.hashtags?.length) {
    for (const tag of opts.hashtags) {
      const tagId = await ensureHashtag(tag)
      await admin.from('kudos_hashtags').insert({ kudos_id: kudosId, hashtag_id: tagId })
    }
  }

  if (opts.featured) {
    await admin
      .from('kudos_highlight_flags')
      .upsert({ kudos_id: kudosId, featured: true }, { onConflict: 'kudos_id' })
  }

  return kudosId
}

/**
 * Mock `next/headers` cookie store + `@/lib/supabase/server` so that route
 * handlers see a Supabase client we control (signed in as the requested user).
 *
 * Usage at the TOP of an integration test file:
 *
 *     vi.mock('next/headers', () => ({ cookies: () => ({ getAll: () => [], set: () => {} }) }))
 *     vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
 *
 * Then in each test:
 *
 *     const sb = await userClient('a@test.com')
 *     vi.mocked(createServerClient).mockResolvedValue(sb)
 */
export function unauthenticatedClient(): SupabaseClient {
  requireEnv()
  return createSupabaseClient(SUPABASE_URL!, ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
