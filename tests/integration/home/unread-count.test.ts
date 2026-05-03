/**
 * Integration test for GET /api/notifications/unread-count.
 *
 * The route uses `cookies()` from next/headers, which throws outside a request
 * scope. We mock it to return an empty store so the route runs as if anonymous
 * (no session) — and the route's anonymous branch returns `{ count: 0 }`.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: () => ({ getAll: () => [], set: () => {} }),
}))

describe('GET /api/notifications/unread-count', () => {
  it('returns { count: 0 } with JSON content-type for unauthenticated user', async () => {
    const { GET } = await import('@/app/api/notifications/unread-count/route')
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    const data = (await response.json()) as { count: number }
    expect(data).toEqual({ count: 0 })
  })
})
