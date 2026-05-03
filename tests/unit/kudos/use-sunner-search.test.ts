/**
 * Unit tests for use-sunner-search hook.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function TestQueryWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockSunners = [{ id: 'u1', name: 'Alice', avatarUrl: null, department: 'CECV2' }]

describe('use-sunner-search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.clearAllTimers()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSunners),
    }) as unknown as typeof fetch
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetModules()
  })

  it('returns empty results initially', async () => {
    const { useKudosSunnerSearch } = await import('@/hooks/kudos/use-sunner-search')
    const { result } = renderHook(() => useKudosSunnerSearch(''), { wrapper: makeWrapper() })
    expect(result.current.results).toEqual([])
  })

  it('debounces query — fires after 300ms', async () => {
    const { useKudosSunnerSearch } = await import('@/hooks/kudos/use-sunner-search')
    const { rerender } = renderHook(
      ({ q }: { q: string }) => useKudosSunnerSearch(q),
      { wrapper: makeWrapper(), initialProps: { q: '' } }
    )

    rerender({ q: 'ali' })

    // Timer not fired yet
    expect(global.fetch).not.toHaveBeenCalled()

    // Advance past debounce window + flush microtasks
    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(global.fetch).toHaveBeenCalledOnce()
  })

  it('enforces 100 char max before calling API', async () => {
    const { useKudosSunnerSearch } = await import('@/hooks/kudos/use-sunner-search')
    const longQuery = 'a'.repeat(101)
    renderHook(() => useKudosSunnerSearch(longQuery), { wrapper: makeWrapper() })

    await act(async () => {
      vi.advanceTimersByTime(300)
      await Promise.resolve()
    })

    expect(global.fetch).not.toHaveBeenCalled()
  })
})
