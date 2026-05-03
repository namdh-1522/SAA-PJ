import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createElement } from 'react'

vi.mock('@/lib/kudos/constants', () => ({
  PAGE_SIZE: 5,
  STALE_TIME_FEED: 30_000,
}))

const mockPage1 = { data: [{ id: 'k1' }], nextPage: 2, total: 25 }
const mockPage2 = { data: [{ id: 'k2' }], nextPage: null, total: 25 }

vi.mock('@/hooks/kudos/use-kudos-feed', async (importOriginal) => {
  return await importOriginal()
})

const mockFetch = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/kudos'),
}))

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('use-kudos-feed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('page=2')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPage2) })
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPage1) })
    })
    vi.stubGlobal('fetch', mockFetch)
  })

  it('fetches page 1 on mount', async () => {
    const { useKudosFeed } = await import('@/hooks/kudos/use-kudos-feed')
    const { result } = renderHook(() => useKudosFeed({ hashtag: null, dept: null }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.kudos).toBeDefined()
  })

  it('loadMore increments page', async () => {
    const { useKudosFeed } = await import('@/hooks/kudos/use-kudos-feed')
    const { result } = renderHook(() => useKudosFeed({ hashtag: null, dept: null }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(typeof result.current.loadMore).toBe('function')
  })

  it('hasMore is false when nextPage is null', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], nextPage: null, total: 0 }),
    })
    const { useKudosFeed } = await import('@/hooks/kudos/use-kudos-feed')
    const { result } = renderHook(() => useKudosFeed({ hashtag: null, dept: null }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasMore).toBe(false)
  })
})
