import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockExchangeCodeForSession = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}))

describe('callback route — integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    process.env.NEXT_PUBLIC_POST_AUTH_URL = '/dashboard'
  })

  it('GET ?code=valid → 302 to post-auth URL', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null })
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback?code=valid')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch(/\/dashboard/)
  })

  it('GET ?error=access_denied → 302 to / (silent, no auth_error param)', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback?error=access_denied')
    const res = await GET(req)
    expect(res.status).toBe(307)
    const location = res.headers.get('location') ?? ''
    expect(location).toMatch(/\/$|\/\?[^?]*$/)
    expect(location).not.toContain('auth_error')
  })

  it('GET ?error=server_error → 302 to /?auth_error=true', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback?error=server_error')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('auth_error=true')
  })

  it('GET (no params) → 302 to /?auth_error=true', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const req = new NextRequest('http://localhost:3000/auth/callback')
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('auth_error=true')
  })
})
