import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserRole } from '@/lib/auth/get-user-role'

const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
  })),
}))

describe('getUserRole', () => {
  beforeEach(() => {
    mockGetUser.mockReset()
  })

  it('returns "admin" when app_metadata.role is "admin"', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { app_metadata: { role: 'admin' } } },
      error: null,
    })
    expect(await getUserRole()).toBe('admin')
  })

  it('returns "admin" when app_metadata.role is missing but user_metadata.role is "admin"', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { app_metadata: {}, user_metadata: { role: 'admin' } } },
      error: null,
    })
    expect(await getUserRole()).toBe('admin')
  })

  it('returns "user" when neither app_metadata.role nor user_metadata.role is admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { app_metadata: {}, user_metadata: {} } },
      error: null,
    })
    expect(await getUserRole()).toBe('user')
  })

  it('returns "user" when app_metadata.role is an unknown string', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { app_metadata: { role: 'superuser' } } },
      error: null,
    })
    expect(await getUserRole()).toBe('user')
  })

  it('returns "user" when session is null', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    expect(await getUserRole()).toBe('user')
  })

  it('returns "user" when getUser throws (defensive fallback)', async () => {
    mockGetUser.mockRejectedValue(new Error('supabase unavailable'))
    expect(await getUserRole()).toBe('user')
  })
})
