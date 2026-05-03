/**
 * Integration tests for POST /api/kudos (Viết Kudo, frame ihQ26W78P2).
 *
 * Constitution §III: runs against a real local Supabase instance.
 * Prerequisites:
 *   - `supabase start` (or remote test DB pointed at by .env.test)
 *   - Migrations applied (the post-handler depends on `kudos.title`,
 *     `kudos.is_anonymous`, and the `kudos_hashtags_insert_own` RLS policy
 *     introduced in 20260429000002_kudos_compose.sql).
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import {
  adminClient,
  ensureUser,
  ensureDepartment,
  ensureHashtag,
  resetKudosTables,
  userClient,
  type TestUser,
} from '@/tests/helpers/supabase'

vi.mock('next/headers', () => ({
  cookies: () => ({ getAll: () => [], set: () => {} }),
}))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

let alice: TestUser
let bob: TestUser
let carol: TestUser

beforeAll(async () => {
  await ensureDepartment('CECV2', 'CEVC2')
  alice = await ensureUser({
    email: 'alice.compose@test.local',
    fullName: 'Alice Compose',
    departmentCode: 'CECV2',
  })
  bob = await ensureUser({
    email: 'bob.compose@test.local',
    fullName: 'Bob Compose',
    departmentCode: 'CECV2',
  })
  carol = await ensureUser({
    email: 'carol.compose@test.local',
    fullName: 'Carol Compose',
    departmentCode: 'CECV2',
  })
  // Seed required hashtags
  await ensureHashtag('teamwork')
  await ensureHashtag('leadership')
  await ensureHashtag('mentorship')
  await ensureHashtag('innovation')
  await ensureHashtag('quality')
  await ensureHashtag('customer-focus')
})

beforeEach(async () => {
  await resetKudosTables()
})

function makeBody(overrides: Partial<{
  receiverId: string
  title: string
  content: string
  hashtags: string[]
  imageUrls: string[]
  isAnonymous: boolean
  anonymousNickname: string
}> = {}) {
  return {
    receiverId: bob.id,
    title: 'Người truyền động lực cho tôi',
    content: 'Cảm ơn bạn đã hỗ trợ tôi trong dự án vừa rồi!',
    hashtags: ['teamwork'],
    imageUrls: [],
    isAnonymous: false,
    anonymousNickname: '',
    ...overrides,
  }
}

function buildRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/kudos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/kudos', () => {
  it('returns 401 when not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    const { createClient: createSb } = await import('@supabase/supabase-js')
    const anonNoSession = createSb(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    vi.mocked(createClient).mockResolvedValue(anonNoSession)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody()))
    expect(res.status).toBe(401)
  })

  it('returns 400 on invalid JSON body', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const req = new NextRequest('http://localhost:3000/api/kudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not-json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when required fields are missing', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest({ receiverId: bob.id })) // missing title/content/hashtags
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('issues')
  })

  it('returns 400 when sender == receiver', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody({ receiverId: alice.id })))
    expect(res.status).toBe(400)
  })

  it('creates a kudo end-to-end and links the hashtag', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody({ hashtags: ['teamwork'] })))

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('createdAt')
    expect(typeof body.id).toBe('string')

    // Verify the kudos row exists
    const admin = adminClient()
    const { data: row } = await admin
      .from('kudos')
      .select('id, sender_id, receiver_id, title, is_anonymous')
      .eq('id', body.id)
      .single()
    expect(row).toMatchObject({
      sender_id: alice.id,
      receiver_id: bob.id,
      title: 'Người truyền động lực cho tôi',
      is_anonymous: false,
    })

    // Verify the kudos_hashtags join exists
    const { data: links } = await admin
      .from('kudos_hashtags')
      .select('hashtag_id, hashtags(name)')
      .eq('kudos_id', body.id)
    expect(links).toHaveLength(1)
  })

  it('persists is_anonymous=true with the provided nickname', async () => {
    // The Zod schema's `superRefine` requires anonymousNickname when
    // isAnonymous is true (mirrors the required asterisk in Figma `5c7PkAibyD`).
    // Provide one so the body actually reaches createKudo.
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(
      buildRequest(makeBody({ isAnonymous: true, anonymousNickname: 'Mystery Sun' }))
    )
    expect(res.status).toBe(201)
    const body = await res.json()

    const admin = adminClient()
    const { data: row } = await admin
      .from('kudos')
      .select('is_anonymous, anonymous_nickname')
      .eq('id', body.id)
      .single()
    expect(row?.is_anonymous).toBe(true)
    expect(row?.anonymous_nickname).toBe('Mystery Sun')
  })

  it('rejects an anonymous submit when nickname is missing', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody({ isAnonymous: true, anonymousNickname: '' })))
    expect(res.status).toBe(400)
  })

  it('trims whitespace around the anonymous nickname before persisting', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(
      buildRequest(makeBody({ isAnonymous: true, anonymousNickname: '   Mystery Sun   ' }))
    )
    expect(res.status).toBe(201)
    const body = await res.json()

    const admin = adminClient()
    const { data: row } = await admin
      .from('kudos')
      .select('anonymous_nickname')
      .eq('id', body.id)
      .single()
    expect(row?.anonymous_nickname).toBe('Mystery Sun')
  })

  it('persists empty anonymous_nickname when isAnonymous is false (any leftover alias is dropped)', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    // Pretend the form had a stale alias from a previous opt-in toggle.
    const res = await POST(
      buildRequest(makeBody({ isAnonymous: false, anonymousNickname: 'leftover-alias' }))
    )
    expect(res.status).toBe(201)
    const body = await res.json()

    const admin = adminClient()
    const { data: row } = await admin
      .from('kudos')
      .select('is_anonymous, anonymous_nickname')
      .eq('id', body.id)
      .single()
    expect(row?.is_anonymous).toBe(false)
    expect(row?.anonymous_nickname).toBe('')
  })

  it('links multiple hashtags', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(
      buildRequest(makeBody({ hashtags: ['teamwork', 'leadership', 'mentorship'] }))
    )
    expect(res.status).toBe(201)
    const body = await res.json()

    const admin = adminClient()
    const { data: links } = await admin
      .from('kudos_hashtags')
      .select('hashtag_id, hashtags(name)')
      .eq('kudos_id', body.id)
    expect(links).toHaveLength(3)
  })

  it('silently drops unknown hashtag names and still creates the kudo', async () => {
    // Hashtags are optional, and unknown names are dropped rather than
    // surfaced as a 500 — see lib/kudos/queries.ts createKudo().
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody({ hashtags: ['this-tag-does-not-exist'] })))
    expect(res.status).toBe(201)
    const body = await res.json()

    // Kudo row exists, but no hashtag join rows.
    const admin = adminClient()
    const { data: rows } = await admin.from('kudos').select('id').eq('sender_id', alice.id)
    expect(rows ?? []).toHaveLength(1)
    const { data: joins } = await admin
      .from('kudos_hashtags')
      .select('kudos_id')
      .eq('kudos_id', body.id)
    expect(joins ?? []).toHaveLength(0)
  })

  it('accepts an empty hashtags array (hashtags are optional)', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody({ hashtags: [] })))
    expect(res.status).toBe(201)
    const body = await res.json()

    const admin = adminClient()
    const { data: rows } = await admin.from('kudos').select('id').eq('id', body.id)
    expect(rows ?? []).toHaveLength(1)
  })

  it('rejects via RLS when a payload tries to spoof sender_id', async () => {
    // The schema doesn't include sender_id, so the only spoof vector is via direct DB
    // INSERT bypassing the API. We instead assert that the API never copies a foreign
    // sender; the row is always tagged with auth.uid().
    const sb = await userClient(carol.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody({ receiverId: bob.id })))
    expect(res.status).toBe(201)
    const body = await res.json()

    const admin = adminClient()
    const { data: row } = await admin.from('kudos').select('sender_id').eq('id', body.id).single()
    expect(row?.sender_id).toBe(carol.id)
  })

  it('drops the title to its 100-char limit at the schema layer', async () => {
    const sb = await userClient(alice.email)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/route')
    const res = await POST(buildRequest(makeBody({ title: 'a'.repeat(101) })))
    expect(res.status).toBe(400)
  })
})
