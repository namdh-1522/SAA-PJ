/**
 * Unit tests for use-kudos-stats hook.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockStats = {
  kudosReceived: 25,
  kudosSent: 25,
  hearts: 1000,
  secretBoxOpened: 25,
  secretBoxClosed: 25,
}

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 }, mutations: { retry: false } },
  })
  return function TestQueryWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('use-kudos-stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStats),
    }) as unknown as typeof fetch
  })

  it('fetches stats from /api/users/me/stats', async () => {
    const { useKudosStats } = await import('@/hooks/kudos/use-kudos-stats')
    const { result } = renderHook(() => useKudosStats('user-a'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.stats).toBeDefined())
    expect(result.current.stats?.kudosReceived).toBe(25)
    expect(result.current.stats?.kudosSent).toBe(25)
    expect(result.current.stats?.hearts).toBe(1000)
  })

  it('exposes isLoading = true initially', async () => {
    const { useKudosStats } = await import('@/hooks/kudos/use-kudos-stats')
    const { result } = renderHook(() => useKudosStats('user-a'), { wrapper: makeWrapper() })
    // Synchronous first render — not yet resolved
    expect(result.current.isLoading).toBe(true)
  })

  it('exposes invalidate function', async () => {
    const { useKudosStats } = await import('@/hooks/kudos/use-kudos-stats')
    const { result } = renderHook(() => useKudosStats('user-a'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.stats).toBeDefined())
    expect(typeof result.current.invalidate).toBe('function')
  })
})
