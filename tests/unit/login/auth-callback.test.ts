import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockExchangeCodeForSession = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
      getUser: mockGetUser,
    },
  })),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('auth callback route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_POST_AUTH_URL = '/dashboard'
  })

  it('redirects silently to / when error=access_denied', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback?error=access_denied')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/')
  })

  it('redirects to /?auth_error=true when error is not access_denied', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback?error=server_error')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('auth_error=true')
  })

  it('calls exchangeCodeForSession and redirects to post-auth URL on success', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null })
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback?code=valid-code')
    const res = await GET(req)
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-code')
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/dashboard')
  })

  it('redirects to /?auth_error=true when exchangeCodeForSession fails', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: new Error('fail') })
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback?code=bad-code')
    const res = await GET(req)
    expect(res.headers.get('location')).toContain('auth_error=true')
  })

  it('redirects to /?auth_error=true when no code or error params', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback')
    const res = await GET(req)
    expect(res.headers.get('location')).toContain('auth_error=true')
  })
})
