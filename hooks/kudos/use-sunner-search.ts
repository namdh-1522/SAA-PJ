'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DEBOUNCE_MS, SUNNER_SEARCH_MAX_LENGTH } from '@/lib/kudos/constants'
import type { KudosUser } from '@/types/kudos'

type SearchResult = Pick<KudosUser, 'id' | 'name' | 'avatarUrl' | 'department'>

async function searchSunners(q: string): Promise<SearchResult[]> {
  const res = await fetch(`/api/sunners?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Sunner search failed')
  return res.json()
}

interface UseKudosSunnerSearchResult {
  results: SearchResult[]
  isLoading: boolean
  error: Error | null
}

export function useKudosSunnerSearch(query: string): UseKudosSunnerSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    // Enforce max length before debouncing — do not call API for overlong queries
    if (query.length > SUNNER_SEARCH_MAX_LENGTH) return

    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  const isEnabled = debouncedQuery.length > 0 && debouncedQuery.length <= SUNNER_SEARCH_MAX_LENGTH

  const { data: results = [], isLoading, error } = useQuery<SearchResult[]>({
    queryKey: ['kudos-sunner-search', debouncedQuery],
    queryFn: () => searchSunners(debouncedQuery),
    enabled: isEnabled,
    staleTime: 30_000,
  })

  return { results: isEnabled ? results : [], isLoading: isEnabled && isLoading, error: error as Error | null }
}
