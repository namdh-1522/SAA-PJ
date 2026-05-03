'use client'

import { useQuery } from '@tanstack/react-query'
import { useKudosFilters } from '@/hooks/kudos/use-kudos-filters'
import { STALE_TIME_HIGHLIGHTS } from '@/lib/kudos/constants'
import type { KudosHighlight } from '@/types/kudos'

async function fetchHighlights(hashtag: string | null, dept: string | null): Promise<KudosHighlight[]> {
  const params = new URLSearchParams()
  if (hashtag) params.set('hashtag', hashtag)
  if (dept) params.set('dept', dept)
  const qs = params.toString()
  const res = await fetch(`/api/kudos/highlights${qs ? `?${qs}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch highlights')
  return res.json()
}

interface UseKudosHighlightsResult {
  highlights: KudosHighlight[]
  isLoading: boolean
  error: Error | null
}

export function useKudosHighlights(): UseKudosHighlightsResult {
  const { hashtag, dept } = useKudosFilters()

  const { data: highlights = [], isLoading, error } = useQuery<KudosHighlight[]>({
    queryKey: ['kudos-highlights', { hashtag, dept }],
    queryFn: () => fetchHighlights(hashtag, dept),
    staleTime: STALE_TIME_HIGHLIGHTS,
  })

  return { highlights, isLoading, error: error as Error | null }
}
