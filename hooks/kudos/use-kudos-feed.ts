'use client'

import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { STALE_TIME_FEED } from '@/lib/kudos/constants'
import type { Kudos, KudosFeedPage, KudosFilters } from '@/types/kudos'

interface UseKudosFeedResult {
  kudos: Kudos[]
  total: number
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: Error | null
  loadMore: () => void
  prependKudo: (kudo: Kudos) => void
  patchKudosHeart: (kudosId: string, heartCount: number) => void
}

async function fetchFeedPage(
  page: number,
  filters: KudosFilters
): Promise<KudosFeedPage> {
  const params = new URLSearchParams({ page: String(page) })
  if (filters.hashtag) params.set('hashtag', filters.hashtag)
  if (filters.dept) params.set('dept', filters.dept)

  const res = await fetch(`/api/kudos?${params}`)
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`)
  return res.json() as Promise<KudosFeedPage>
}

/** Locally-merged feed pages. The page-1 result is the source of truth from
 *  TanStack Query (so filter changes reset to page 1 automatically via
 *  queryKey invalidation), and additional pages from `loadMore` plus
 *  optimistic mutations (`prependKudo`, `patchKudosHeart`) live in a separate
 *  slice that is keyed against the active filter so a stale loadMore from a
 *  previous filter cannot pollute the current view. */
interface ExtraSlice {
  /** Filter signature this slice was produced for. */
  readonly key: string
  readonly extraPages: readonly Kudos[]
  readonly nextPage: number | null
  readonly totalDelta: number
  /** Per-kudos heart-count overrides applied on top of fetched data. */
  readonly heartOverrides: ReadonlyMap<string, number>
  /** Locally-prepended kudos (created by the current user, not yet in the
   *  server query — flushed on next refetch). */
  readonly prepended: readonly Kudos[]
}

function emptySlice(key: string): ExtraSlice {
  return {
    key,
    extraPages: [],
    nextPage: null,
    totalDelta: 0,
    heartOverrides: new Map(),
    prepended: [],
  }
}

function filterKey(filters: KudosFilters): string {
  return `${filters.hashtag ?? ''}|${filters.dept ?? ''}`
}

export function useKudosFeed(filters: KudosFilters): UseKudosFeedResult {
  const queryClient = useQueryClient()
  const fk = filterKey(filters)
  const [extra, setExtra] = useState<ExtraSlice>(() => emptySlice(fk))
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Reset the extra slice whenever the filter changes — guarantees that
  // `loadMore` results from a previous filter are discarded.
  if (extra.key !== fk) {
    setExtra(emptySlice(fk))
  }

  const queryKey = useMemo(
    () => ['kudos-feed', { hashtag: filters.hashtag, dept: filters.dept }] as const,
    [filters.hashtag, filters.dept]
  )

  const { data: pageOne, isLoading, error } = useQuery<KudosFeedPage>({
    queryKey,
    queryFn: () => fetchFeedPage(1, filters),
    staleTime: STALE_TIME_FEED,
  })

  const kudos = useMemo<Kudos[]>(() => {
    const base = pageOne ? [...extra.prepended, ...(pageOne.data as Kudos[]), ...extra.extraPages] : []
    if (extra.heartOverrides.size === 0) return base
    return base.map((k) =>
      extra.heartOverrides.has(k.id)
        ? { ...k, heartCount: extra.heartOverrides.get(k.id)! }
        : k
    )
  }, [pageOne, extra])

  const total = (pageOne?.total ?? 0) + extra.totalDelta
  // hasMore: prefer extra.nextPage (set after a loadMore) — falls back to the
  // base page-1 nextPage on initial render.
  const baseNext = pageOne?.nextPage ?? null
  const effectiveNext = extra.extraPages.length > 0 ? extra.nextPage : baseNext

  const loadMore = useCallback(async () => {
    if (!effectiveNext || isLoadingMore) return
    const requestedKey = fk
    setIsLoadingMore(true)
    try {
      const result = await fetchFeedPage(effectiveNext, filters)
      // If the filter changed mid-flight, throw the result away — the slice
      // would be appended to a different filter's data.
      if (requestedKey !== filterKey(filters)) return
      setExtra((prev) => {
        if (prev.key !== requestedKey) return prev
        return {
          ...prev,
          extraPages: [...prev.extraPages, ...(result.data as Kudos[])],
          nextPage: result.nextPage,
        }
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [effectiveNext, isLoadingMore, filters, fk])

  const prependKudo = useCallback(
    (kudo: Kudos) => {
      setExtra((prev) => ({
        ...prev,
        prepended: [kudo, ...prev.prepended],
        totalDelta: prev.totalDelta + 1,
      }))
      queryClient.invalidateQueries({ queryKey: ['kudos-total'] })
    },
    [queryClient]
  )

  const patchKudosHeart = useCallback((kudosId: string, heartCount: number) => {
    setExtra((prev) => {
      const next = new Map(prev.heartOverrides)
      next.set(kudosId, heartCount)
      return { ...prev, heartOverrides: next }
    })
  }, [])

  return {
    kudos,
    total,
    isLoading,
    isLoadingMore,
    hasMore: effectiveNext !== null,
    error: error as Error | null,
    loadMore,
    prependKudo,
    patchKudosHeart,
  }
}
