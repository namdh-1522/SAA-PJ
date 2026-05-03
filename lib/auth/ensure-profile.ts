import type { SupabaseClient, User } from '@supabase/supabase-js'
import { DEFAULT_DEPARTMENT_CODE } from '@/lib/kudos/constants'

/** Read the Google OAuth-style metadata that Supabase stores on `auth.users`.
 *  Google emits `full_name` + `name` and `avatar_url` + `picture`; we accept
 *  either pair so the helper survives a future OAuth provider change. */
function readNameFromMetadata(meta: User['user_metadata']): string {
  const m = meta as Record<string, unknown> | null
  if (!m) return ''
  const candidates = [m.full_name, m.name, m.user_name, m.preferred_username]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c.trim()
  }
  return ''
}

function readAvatarFromMetadata(meta: User['user_metadata']): string | null {
  const m = meta as Record<string, unknown> | null
  if (!m) return null
  const candidates = [m.avatar_url, m.picture]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c.trim()
  }
  return null
}

/** Idempotently sync the `profiles` row with the latest Google OAuth metadata.
 *
 *  Behaviour:
 *  - Newly-provisioned profile (no existing row): inserts `full_name` +
 *    `avatar_url` from `user.user_metadata` and assigns `department_code =
 *    DEFAULT_DEPARTMENT_CODE` ('CEV1'). The seed migration
 *    `20260503000001_seed_default_department.sql` guarantees that row exists.
 *  - Existing profile: refreshes `full_name` + `avatar_url` from metadata so
 *    name/photo updates from Google flow into the Kudos board, but PRESERVES
 *    any admin-assigned `department_code` (we only set the default for the
 *    first-ever insert).
 *
 *  Called from:
 *  - `app/auth/callback/route.ts` — once per OAuth login (the canonical entry).
 *  - `app/kudos/page.tsx` — defence-in-depth back-fill for users that signed
 *    in before this helper shipped, or whose profile was wiped by an admin.
 *
 *  Returns silently on error; failures must not break the auth flow. The
 *  Kudos page falls back to email/empty avatar in the rare case the upsert
 *  hasn't run yet. */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: Pick<User, 'id' | 'email' | 'user_metadata'>
): Promise<void> {
  if (!user.id) return

  const fullName = readNameFromMetadata(user.user_metadata) || (user.email ?? '')
  const avatarUrl = readAvatarFromMetadata(user.user_metadata)

  // Look up the existing profile so we know whether to set the default
  // department. Single-row read is cheap and lets us avoid clobbering an
  // admin-assigned department on every login.
  const { data: existing, error: selectErr } = await supabase
    .from('profiles')
    .select('department_code')
    .eq('id', user.id)
    .maybeSingle()
  if (selectErr) {
    // Table not migrated yet (test envs / dev) — surface nothing, just bail.
    return
  }

  const payload: {
    id: string
    full_name: string | null
    avatar_url: string | null
    department_code?: string
  } = {
    id: user.id,
    full_name: fullName || null,
    avatar_url: avatarUrl,
  }
  if (!existing) {
    // First-time provision: lock in the default department.
    payload.department_code = DEFAULT_DEPARTMENT_CODE
  }

  const { error: upsertErr } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
  if (upsertErr) {
    // Don't break the auth redirect — but log so RLS misconfig or FK
    // violations are visible in server logs instead of silently leaving
    // new users without a profile row (which is exactly what the missing
    // INSERT policy used to cause).
    console.error('[ensureProfile] upsert failed', {
      userId: user.id,
      isNewProfile: !existing,
      error: upsertErr,
    })
  }
}
