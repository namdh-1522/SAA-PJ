'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface UseKudosFiltersResult {
  hashtag: string | null
  dept: string | null
  setHashtag: (tag: string | null) => void
  setDept: (dept: string | null) => void
  clearAll: () => void
}

/** URL-synced filter state for hashtag + department.
 *
 *  Routing: uses `router.replace()` (soft Next.js navigation, NO full reload).
 *  Cache:   data invalidation happens automatically because the filter values
 *           are part of every relevant `useQuery` queryKey
 *           (`['kudos-feed', { hashtag, dept }]`,
 *            `['kudos-highlights', { hashtag, dept }]`). When the URL changes,
 *           every consumer reads the new values via `useSearchParams`, the
 *           queryKeys change, and TanStack Query fetches fresh data while
 *           keeping previously-cached filter combinations available — so
 *           toggling between filters reuses cached results instead of
 *           re-fetching from scratch every time. */
export function useKudosFilters(): UseKudosFiltersResult {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const hashtag = searchParams.get('hashtag')
  const dept = searchParams.get('dept')

  const navigate = useCallback(
    (nextHashtag: string | null, nextDept: string | null) => {
      const params = new URLSearchParams()
      if (nextHashtag) params.set('hashtag', nextHashtag)
      if (nextDept) params.set('dept', nextDept)
      const qs = params.toString()
      // `router.replace` keeps scroll position and triggers no page reload —
      // it just updates the URL + rerenders client components reading the
      // search params.
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname]
  )

  const setHashtag = useCallback(
    (tag: string | null) => navigate(tag, dept),
    [navigate, dept]
  )

  const setDept = useCallback(
    (d: string | null) => navigate(hashtag, d),
    [navigate, hashtag]
  )

  const clearAll = useCallback(
    () => navigate(null, null),
    [navigate]
  )

  return { hashtag, dept, setHashtag, setDept, clearAll }
}
