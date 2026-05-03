/**
 * Integration tests for POST/DELETE /api/kudos/:id/likes
 *
 * Constitution §III: real DB, no mocking of Supabase queries.
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
  await ensureDepartment('CECV2')
  alice = await ensureUser({
    email: 'alice.likes@test.local',
    fullName: 'Alice Likes',
    departmentCode: 'CECV2',
  })
  bob = await ensureUser({
    email: 'bob.likes@test.local',
    fullName: 'Bob Likes',
    departmentCode: 'CECV2',
  })
})

beforeEach(async () => {
  await resetKudosTables()
})

describe('POST /api/kudos/:id/likes', () => {
  it('returns 201 when heart is created by a different user', async () => {
    const kudosId = await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'You did great!',
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/[id]/likes/route')
    const res = await POST(
      new NextRequest(`http://localhost:3000/api/kudos/${kudosId}/likes`, { method: 'POST' }),
      { params: Promise.resolve({ id: kudosId }) }
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toMatchObject({ hasHearted: true, totalHearts: 1 })

    // Verify heart was actually persisted (Constitution: real-DB assertion)
    const admin = adminClient()
    const { count } = await admin
      .from('hearts')
      .select('*', { count: 'exact', head: true })
      .eq('kudos_id', kudosId)
      .eq('user_id', alice.id)
    expect(count).toBe(1)
  })

  it('returns 403 when user tries to heart their own kudos', async () => {
    const kudosId = await insertKudos({
      senderId: alice.id,
      receiverId: bob.id,
      content: 'Self-praise',
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/[id]/likes/route')
    const res = await POST(
      new NextRequest(`http://localhost:3000/api/kudos/${kudosId}/likes`, { method: 'POST' }),
      { params: Promise.resolve({ id: kudosId }) }
    )
    expect(res.status).toBe(403)
  })

  it('returns 409 when user tries to heart twice', async () => {
    const kudosId = await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'Once is enough',
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/[id]/likes/route')
    const first = await POST(
      new NextRequest(`http://localhost:3000/api/kudos/${kudosId}/likes`, { method: 'POST' }),
      { params: Promise.resolve({ id: kudosId }) }
    )
    expect(first.status).toBe(201)

    const second = await POST(
      new NextRequest(`http://localhost:3000/api/kudos/${kudosId}/likes`, { method: 'POST' }),
      { params: Promise.resolve({ id: kudosId }) }
    )
    expect(second.status).toBe(409)
  })

  it('returns 404 when kudos does not exist', async () => {
    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { POST } = await import('@/app/api/kudos/[id]/likes/route')
    const fakeId = '00000000-0000-0000-0000-000000000001'
    const res = await POST(
      new NextRequest(`http://localhost:3000/api/kudos/${fakeId}/likes`, { method: 'POST' }),
      { params: Promise.resolve({ id: fakeId }) }
    )
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/kudos/:id/likes', () => {
  it('removes the heart and returns 200 with updated count', async () => {
    const kudosId = await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'Take it back',
    })
    // Pre-seed Alice's heart
    await adminClient().from('hearts').insert({
      kudos_id: kudosId,
      user_id: alice.id,
      weight: 1,
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { DELETE } = await import('@/app/api/kudos/[id]/likes/route')
    const res = await DELETE(
      new NextRequest(`http://localhost:3000/api/kudos/${kudosId}/likes`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: kudosId }) }
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ hasHearted: false, totalHearts: 0 })

    // Verify deletion in DB
    const { count } = await adminClient()
      .from('hearts')
      .select('*', { count: 'exact', head: true })
      .eq('kudos_id', kudosId)
      .eq('user_id', alice.id)
    expect(count).toBe(0)
  })
})
