/**
 * Integration tests for GET /api/kudos/highlights
 *
 * Constitution §III: real DB integration.
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
import { HIGHLIGHT_LIMIT } from '@/lib/kudos/constants'

vi.mock('next/headers', () => ({
  cookies: () => ({ getAll: () => [], set: () => {} }),
}))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

let alice: TestUser
let bob: TestUser
/** Pool of hearter users used to seed `heart_count`. Each user contributes
 *  one `hearts` row with weight=1 (the schema's CHECK constraint allows only
 *  1 or 2, so we can't simulate `heart_count=10` with a single weighted row;
 *  see migration 20260427000002_create_hearts.sql). */
const HEARTERS_POOL_SIZE = 10
let hearters: TestUser[] = []

beforeAll(async () => {
  await ensureDepartment('CECV2')
  alice = await ensureUser({
    email: 'alice.highlights@test.local',
    fullName: 'Alice HL',
    departmentCode: 'CECV2',
  })
  bob = await ensureUser({
    email: 'bob.highlights@test.local',
    fullName: 'Bob HL',
    departmentCode: 'CECV2',
  })
  hearters = []
  for (let i = 0; i < HEARTERS_POOL_SIZE; i++) {
    hearters.push(
      await ensureUser({
        email: `heart${i}.hl@test.local`,
        fullName: `Heart ${i}`,
        departmentCode: 'CECV2',
      })
    )
  }
})

beforeEach(async () => {
  await resetKudosTables()
})

async function addHearts(kudosId: string, count: number): Promise<void> {
  if (count <= 0) return
  if (count > hearters.length) {
    throw new Error(`addHearts: need ${count} hearters but pool has only ${hearters.length}`)
  }
  const admin = adminClient()
  for (let i = 0; i < count; i++) {
    const { error } = await admin
      .from('hearts')
      .insert({ kudos_id: kudosId, user_id: hearters[i].id, weight: 1 })
    if (error) throw error
  }
}

describe('GET /api/kudos/highlights', () => {
  it(`returns the top ${HIGHLIGHT_LIMIT} kudos ranked by heart count`, async () => {
    // Six kudos with varying heart counts — only the top 5 should be returned,
    // ordered by heart_count DESC (with created_at as the tiebreaker).
    const ids: string[] = []
    for (let i = 0; i < 6; i++) {
      ids.push(
        await insertKudos({
          senderId: bob.id,
          receiverId: alice.id,
          content: `Kudo #${i}`,
        })
      )
    }
    // Heart counts: id[5]=10, id[4]=8, id[3]=6, id[2]=4, id[1]=2, id[0]=0
    await addHearts(ids[5], 10)
    await addHearts(ids[4], 8)
    await addHearts(ids[3], 6)
    await addHearts(ids[2], 4)
    await addHearts(ids[1], 2)

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { GET } = await import('@/app/api/kudos/highlights/route')
    const res = await GET(new NextRequest('http://localhost:3000/api/kudos/highlights'))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(HIGHLIGHT_LIMIT)
    expect(body.map((k: { id: string }) => k.id)).toEqual([ids[5], ids[4], ids[3], ids[2], ids[1]])
    expect(body[0].heartCount).toBe(10)
    // Transformer applied (camelCase + nested)
    expect(body[0].sender.id).toBe(bob.id)
    expect(body[0].receiver.id).toBe(alice.id)
  })

  it('filters highlights by hashtag', async () => {
    await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'Team kudos',
      hashtags: ['teamwork'],
    })
    await insertKudos({
      senderId: bob.id,
      receiverId: alice.id,
      content: 'Solo win',
      hashtags: ['solo'],
    })

    const sb = await userClient(alice.email, alice.password)
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(sb)

    const { GET } = await import('@/app/api/kudos/highlights/route')
    const res = await GET(
      new NextRequest('http://localhost:3000/api/kudos/highlights?hashtag=teamwork')
    )
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].content).toBe('Team kudos')
  })

  it('returns 401 when unauthenticated', async () => {
    const { createClient: createSb } = await import('@supabase/supabase-js')
    const anon = createSb(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(anon)

    const { GET } = await import('@/app/api/kudos/highlights/route')
    const res = await GET(new NextRequest('http://localhost:3000/api/kudos/highlights'))
    expect(res.status).toBe(401)
  })
})
