import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/middleware', () => ({
  createMiddlewareClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
  })),
}))

function makeRequest(pathname: string) {
  return new NextRequest(`http://localhost:3000${pathname}`)
}

describe('prelaunch gate — integration', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
    vi.stubEnv('NEXT_PUBLIC_PRELAUNCH_END', '2026-06-07T18:30:00+07:00')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  describe('when prelaunch is ACTIVE (now < cutoff)', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-06-01T00:00:00+07:00'))
    })

    it('rewrites "/" to "/prelaunch"', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/'))
      expect(res.headers.get('x-middleware-rewrite')).toContain('/prelaunch')
    })

    it('rewrites "/about-saa-2025" to "/prelaunch"', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/about-saa-2025'))
      expect(res.headers.get('x-middleware-rewrite')).toContain('/prelaunch')
    })

    it('passes through "/prelaunch" (allowlist — no rewrite header)', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/prelaunch'))
      expect(res.headers.get('x-middleware-rewrite')).toBeNull()
    })

    it('passes through "/auth/callback" (allowlist — no rewrite header)', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/auth/callback'))
      expect(res.headers.get('x-middleware-rewrite')).toBeNull()
    })
  })

  describe('when prelaunch is INACTIVE (now >= cutoff)', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-06-10T00:00:00+07:00'))
    })

    it('passes through "/" to auth logic (no rewrite)', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/'))
      expect(res.headers.get('x-middleware-rewrite')).toBeNull()
    })

    it('redirects "/prelaunch" to "/"', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/prelaunch'))
      expect(res.status).toBeGreaterThanOrEqual(300)
      expect(res.status).toBeLessThan(400)
      expect(res.headers.get('location')).toMatch(/localhost:3000\/$/)
    })
  })

  describe('when env var is missing', () => {
    beforeEach(() => {
      vi.stubEnv('NEXT_PUBLIC_PRELAUNCH_END', '')
      vi.setSystemTime(new Date('2026-06-01T00:00:00+07:00'))
    })

    it('gate is inactive — "/" is not rewritten to /prelaunch', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/'))
      expect(res.headers.get('x-middleware-rewrite')).toBeNull()
    })

    it('"/prelaunch" still redirects to "/" (cleanup, no active gate)', async () => {
      const { proxy } = await import('@/proxy')
      const res = await proxy(makeRequest('/prelaunch'))
      expect(res.headers.get('x-middleware-rewrite')).toBeNull()
      // Should redirect to prevent direct /prelaunch access even without env var
      expect(res.status).toBeGreaterThanOrEqual(300)
      expect(res.status).toBeLessThan(400)
    })
  })
})
