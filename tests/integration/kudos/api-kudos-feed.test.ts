/**
 * Integration tests for GET /api/kudos
 *
 * Constitution §III: runs against a real local Supabase instance.
 * Prerequisites: `supabase start` (or remote test DB pointed at by .env.test).
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import {
  adminClient,
  ensureUser,
  ensureDepartment,
  insertKudos,
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

beforeAll(async () => {
  await ensureDepartment('CECV2', 'CEVC2')
  alice = await ensureUser({
    email: 'alice.feed@test.local',
    fullName: 'Alice Feed',
    departmentCode: 'CECV2',
  })
  bob = await ensureUser({
    email: 'bob.feed@test.local',
    fullName: 'Bob Feed',
    departmentCode: 'CECV2',
  })
})

beforeEach(async () => {
  await resetKudosTables()
})

describe('GET /api/kudos', () => {
  it('returns 401 when not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    // No sign-in → getUser returns null
    const anon = adminClient()
    await anon.auth.signOut().catch(() => {})
    vi.mocked(createClient).mockResolvedValue(anon)

    const { GET } = await import('@/app/api/kudos/route')
    // Force getUser to return null by not signing in — service-role client returns no user
    // We instead mock the auth path by using a fresh anon client with no session
    const { createClient: createSb } = await import('@supabase/supabase-js')
    const anonNoSession = createSb(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    vi.mocked(createClient).mockResolvedValue(anonNoSession)

    const req = new NextRequest('http://localhost:3000/api/kudos')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns transformed kudos with camelCase + nested sender/receiver', async () => {
    await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'Great work on the project!',
      hashtags: ['teamwork'],
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { GET } = await import('@/app/api/kudos/route')
    const res = await GET(new NextRequest('http://localhost:3000/api/kudos'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThanOrEqual(1)
    expect(body).toHaveProperty('total')
    expect(body).toHaveProperty('nextPage')

    const kudo = body.data[0]
    // Schema-mapping invariants: camelCase + nested objects (queries.ts transformer)
    expect(kudo).toMatchObject({
      content: 'Great work on the project!',
      senderId: bob.id,
      receiverId: alice.id,
      sender: expect.objectContaining({ id: bob.id, name: 'Bob Feed' }),
      receiver: expect.objectContaining({ id: alice.id, name: 'Alice Feed' }),
      hasHearted: false,
      heartCount: 0,
    })
    expect(Array.isArray(kudo.imageUrls)).toBe(true)
    expect(Array.isArray(kudo.hashtags)).toBe(true)
    expect(kudo.hashtags.map((h: { name: string }) => h.name)).toContain('teamwork')
  })

  it('reports hasHearted=true when current user has hearted the kudos', async () => {
    const kudosId = await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'Hearted by Alice',
    })
    // Alice hearts Bob's kudos via admin (skipping the API), then queries feed
    const admin = adminClient()
    await admin.from('hearts').insert({
      kudos_id: kudosId,
      user_id: alice.id,
      weight: 1,
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { GET } = await import('@/app/api/kudos/route')
    const res = await GET(new NextRequest('http://localhost:3000/api/kudos'))
    const body = await res.json()
    expect(body.data[0].hasHearted).toBe(true)
    expect(body.data[0].heartCount).toBe(1)
  })

  it('paginates correctly when feed exceeds PAGE_SIZE', async () => {
    // Insert 6 kudos (PAGE_SIZE = 5 → page 2 has 1 item, nextPage = null)
    for (let i = 0; i < 6; i++) {
      await insertKudos({
        senderId: bob.id,
        receiverId: alice.id,
        content: `Kudos #${i}`,
      })
    }

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { GET } = await import('@/app/api/kudos/route')

    const page1 = await (
      await GET(new NextRequest('http://localhost:3000/api/kudos?page=1'))
    ).json()
    expect(page1.data).toHaveLength(5)
    expect(page1.nextPage).toBe(2)
    expect(page1.total).toBe(6)

    const page2 = await (
      await GET(new NextRequest('http://localhost:3000/api/kudos?page=2'))
    ).json()
    expect(page2.data).toHaveLength(1)
    expect(page2.nextPage).toBeNull()
  })

  it('filters by hashtag', async () => {
    await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'with teamwork',
      hashtags: ['teamwork'],
    })
    await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'without tag',
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { GET } = await import('@/app/api/kudos/route')
    const res = await GET(
      new NextRequest('http://localhost:3000/api/kudos?hashtag=teamwork')
    )
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].content).toBe('with teamwork')
  })
})
