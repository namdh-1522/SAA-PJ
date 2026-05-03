'use client'

import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { STALE_TIME_STATS } from '@/lib/kudos/constants'
import type { KudosStats } from '@/types/kudos'

interface UseKudosStatsResult {
  stats: KudosStats | undefined
  isLoading: boolean
  error: Error | null
  invalidate: () => void
}

async function fetchStats(): Promise<KudosStats> {
  const res = await fetch('/api/users/me/stats')
  if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`)
  return res.json() as Promise<KudosStats>
}

export function useKudosStats(userId: string): UseKudosStatsResult {
  const queryClient = useQueryClient()

  const { data: stats, isLoading, error } = useQuery<KudosStats>({
    queryKey: ['kudos-stats', userId],
    queryFn: fetchStats,
    staleTime: STALE_TIME_STATS,
    enabled: !!userId,
  })

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['kudos-stats', userId] })
  }, [queryClient, userId])

  return { stats, isLoading, error: error as Error | null, invalidate }
}
