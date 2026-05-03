'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DEBOUNCE_MS, SUNNER_SEARCH_MAX_LENGTH } from '@/lib/kudos/constants'
import { useKudosFilters } from '@/hooks/kudos/use-kudos-filters'
import type { KudosUser } from '@/types/kudos'

type SunnerChip = Pick<KudosUser, 'id' | 'name' | 'avatarUrl' | 'department'> & {
  /** Kudos received within the spotlight window. Default-mode entries carry
   *  the real count; raw sunner-search results don't (`/api/sunners` returns
   *  profile rows only) so we fall back to 0 there. */
  kudosReceived: number
}

async function searchSunners(q: string): Promise<SunnerChip[]> {
  const res = await fetch(`/api/sunners?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Sunner search failed')
  const rows = (await res.json()) as Array<Omit<SunnerChip, 'kudosReceived'>>
  return rows.map((r) => ({ ...r, kudosReceived: 0 }))
}

async function fetchDefaultSpotlightSunners(
  hashtag: string | null,
  dept: string | null
): Promise<SunnerChip[]> {
  const params = new URLSearchParams()
  if (hashtag) params.set('hashtag', hashtag)
  if (dept) params.set('dept', dept)
  const qs = params.toString()
  const res = await fetch(`/api/kudos/spotlight-sunners${qs ? `?${qs}` : ''}`)
  if (!res.ok) throw new Error('Spotlight sunners failed')
  return res.json()
}

export function useKudosSpotlightBoard(query: string): {
  sunners: SunnerChip[]
  isLoading: boolean
  error: Error | null
  isSearchMode: boolean
} {
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { hashtag, dept } = useKudosFilters()

  useEffect(() => {
    if (query.length > SUNNER_SEARCH_MAX_LENGTH) return
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  const trimmed = debouncedQuery.trim()
  const isSearchMode = trimmed.length > 0

  const defaultQ = useQuery({
    // Filters are part of the queryKey so toggling hashtag/dept refetches and
    // each filter combination's result is cached independently.
    queryKey: ['kudos-spotlight-default-sunners', { hashtag, dept }],
    queryFn: () => fetchDefaultSpotlightSunners(hashtag, dept),
    enabled: !isSearchMode,
    staleTime: 30_000,
  })

  const searchQ = useQuery({
    queryKey: ['kudos-sunner-search', trimmed],
    queryFn: () => searchSunners(trimmed),
    enabled: isSearchMode,
    staleTime: 30_000,
  })

  if (isSearchMode) {
    return {
      sunners: searchQ.data ?? [],
      isLoading: searchQ.isLoading,
      error: searchQ.error as Error | null,
      isSearchMode: true,
    }
  }

  return {
    sunners: defaultQ.data ?? [],
    isLoading: defaultQ.isLoading,
    error: defaultQ.error as Error | null,
    isSearchMode: false,
  }
}
