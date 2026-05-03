import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createElement } from 'react'

const mockFetch = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/kudos'),
}))

function makeWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: qc }, children)
  }
}

describe('use-heart', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    vi.stubGlobal('fetch', mockFetch)
  })

  it('toggles hearted state optimistically', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ weight: 1, totalHearts: 6, hasHearted: true }),
    })

    const { useHeart } = await import('@/hooks/kudos/use-heart')
    const { result } = renderHook(
      () => useHeart({ kudosId: 'k1', currentUserId: 'user-a', senderId: 'user-b', initialCount: 5, initialHearted: false }),
      { wrapper: makeWrapper(queryClient) }
    )

    expect(result.current.hasHearted).toBe(false)
    expect(result.current.heartCount).toBe(5)
    expect(result.current.isDisabled).toBe(false)
  })

  it('disables heart when sender === currentUser', async () => {
    const { useHeart } = await import('@/hooks/kudos/use-heart')
    const { result } = renderHook(
      () => useHeart({ kudosId: 'k1', currentUserId: 'user-a', senderId: 'user-a', initialCount: 5, initialHearted: false }),
      { wrapper: makeWrapper(queryClient) }
    )
    expect(result.current.isDisabled).toBe(true)
  })

  it('calls POST /api/kudos/:id/likes on toggle', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ weight: 1, totalHearts: 6, hasHearted: true }),
    })

    const { useHeart } = await import('@/hooks/kudos/use-heart')
    const { result } = renderHook(
      () => useHeart({ kudosId: 'k1', currentUserId: 'user-a', senderId: 'user-b', initialCount: 5, initialHearted: false }),
      { wrapper: makeWrapper(queryClient) }
    )

    await act(() => result.current.toggle())
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/kudos/k1/likes')
    expect(options.method).toBe('POST')
  })

  it('calls DELETE when un-hearting', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ weight: 1, totalHearts: 4, hasHearted: false }),
    })

    const { useHeart } = await import('@/hooks/kudos/use-heart')
    const { result } = renderHook(
      () => useHeart({ kudosId: 'k1', currentUserId: 'user-a', senderId: 'user-b', initialCount: 5, initialHearted: true }),
      { wrapper: makeWrapper(queryClient) }
    )

    await act(() => result.current.toggle())
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(options.method).toBe('DELETE')
  })

  it('rolls back optimistic state on error', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({ error: 'Server error' }) })

    const { useHeart } = await import('@/hooks/kudos/use-heart')
    const { result } = renderHook(
      () => useHeart({ kudosId: 'k1', currentUserId: 'user-a', senderId: 'user-b', initialCount: 5, initialHearted: false }),
      { wrapper: makeWrapper(queryClient) }
    )

    await act(() => result.current.toggle())
    await waitFor(() => !result.current.isPending, { timeout: 3000 })

    // Count should be rolled back to initial
    expect(result.current.heartCount).toBe(5)
  })

  it('syncs hasHearted from realtimeHearted prop when no mutation is pending', async () => {
    const { useHeart } = await import('@/hooks/kudos/use-heart')
    const { result, rerender } = renderHook(
      ({ realtimeHearted }: { realtimeHearted?: boolean }) =>
        useHeart({
          kudosId: 'k1',
          currentUserId: 'user-a',
          senderId: 'user-b',
          initialCount: 1,
          initialHearted: false,
          realtimeHearted,
        }),
      { wrapper: makeWrapper(queryClient), initialProps: { realtimeHearted: false } }
    )

    expect(result.current.hasHearted).toBe(false)
    // Cache patch from a sibling card flips the prop — useHeart must adopt it
    // (this is what was missing for the carousel filled-red state).
    rerender({ realtimeHearted: true })
    await waitFor(() => expect(result.current.hasHearted).toBe(true))
  })

  it('patches both feed and highlights caches with the new count on success', async () => {
    // Pre-seed both caches with the toggled kudo so we can verify the patch
    // hits both surfaces — this is the cross-cache drift the bug report
    // describes (feed shows +1, Highlight carousel shows 0).
    queryClient.setQueryData(['kudos-feed', { hashtag: null, dept: null }], {
      data: [{ id: 'k1', heartCount: 5, hasHearted: false }],
      nextPage: null,
      total: 1,
    })
    queryClient.setQueryData(['kudos-highlights', { hashtag: null, dept: null }], [
      { id: 'k1', heartCount: 5, hasHearted: false, featured: false },
    ])

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ weight: 1, totalHearts: 6, hasHearted: true }),
    })

    const { useHeart } = await import('@/hooks/kudos/use-heart')
    const { result } = renderHook(
      () => useHeart({ kudosId: 'k1', currentUserId: 'user-a', senderId: 'user-b', initialCount: 5, initialHearted: false }),
      { wrapper: makeWrapper(queryClient) }
    )

    await act(() => result.current.toggle())
    await waitFor(() => !result.current.isPending, { timeout: 3000 })

    const feed = queryClient.getQueryData<{ data: { id: string; heartCount: number; hasHearted: boolean }[] }>([
      'kudos-feed',
      { hashtag: null, dept: null },
    ])
    expect(feed?.data[0].heartCount).toBe(6)
    expect(feed?.data[0].hasHearted).toBe(true)

    const highlights = queryClient.getQueryData<{ id: string; heartCount: number; hasHearted: boolean }[]>([
      'kudos-highlights',
      { hashtag: null, dept: null },
    ])
    expect(highlights?.[0].heartCount).toBe(6)
    expect(highlights?.[0].hasHearted).toBe(true)
  })
})
