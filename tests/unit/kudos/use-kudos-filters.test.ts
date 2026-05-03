/**
 * Unit tests for use-kudos-filters hook.
 * Tests URL-synced filter state management via next/navigation mocks.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock next/navigation
const mockReplace = vi.fn()
const mockSearchParamsGet = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({ get: mockSearchParamsGet }),
  usePathname: () => '/kudos',
}))

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function TestQueryWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

async function setupHook(params: { hashtag?: string; dept?: string } = {}) {
  mockSearchParamsGet.mockImplementation((key: string) => {
    if (key === 'hashtag') return params.hashtag ?? null
    if (key === 'dept') return params.dept ?? null
    return null
  })

  const { useKudosFilters } = await import('@/hooks/kudos/use-kudos-filters')
  return renderHook(() => useKudosFilters(), { wrapper: makeWrapper() })
}

describe('use-kudos-filters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('initializes state from URL params', async () => {
    const { result } = await setupHook({ hashtag: 'teamwork', dept: 'CECV2' })
    expect(result.current.hashtag).toBe('teamwork')
    expect(result.current.dept).toBe('CECV2')
  })

  it('initializes to null when no URL params', async () => {
    const { result } = await setupHook()
    expect(result.current.hashtag).toBeNull()
    expect(result.current.dept).toBeNull()
  })

  it('setHashtag updates URL and exposes new value', async () => {
    const { result } = await setupHook()

    act(() => { result.current.setHashtag('teamwork') })

    expect(mockReplace).toHaveBeenCalledOnce()
    const calledUrl = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).toContain('hashtag=teamwork')
  })

  it('setDept updates URL and exposes new value', async () => {
    const { result } = await setupHook()

    act(() => { result.current.setDept('CECV2') })

    expect(mockReplace).toHaveBeenCalledOnce()
    const calledUrl = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).toContain('dept=CECV2')
  })

  it('clearAll removes both hashtag and dept from URL', async () => {
    const { result } = await setupHook({ hashtag: 'teamwork', dept: 'CECV2' })

    act(() => { result.current.clearAll() })

    expect(mockReplace).toHaveBeenCalledOnce()
    const calledUrl = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('hashtag')
    expect(calledUrl).not.toContain('dept')
  })

  it('setHashtag preserves existing dept param in URL', async () => {
    const { result } = await setupHook({ dept: 'CECV2' })

    act(() => { result.current.setHashtag('teamwork') })

    const calledUrl = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).toContain('hashtag=teamwork')
    expect(calledUrl).toContain('dept=CECV2')
  })
})
