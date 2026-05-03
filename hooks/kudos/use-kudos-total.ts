'use client'

import { useQuery } from '@tanstack/react-query'

async function fetchTotal(): Promise<number> {
  const res = await fetch('/api/kudos/stats/total')
  if (!res.ok) throw new Error('Failed to fetch total')
  const body = await res.json() as { total: number }
  return body.total
}

interface UseKudosTotalResult {
  total: number
  isLoading: boolean
}

export function useKudosTotal(): UseKudosTotalResult {
  const { data: total = 0, isLoading } = useQuery<number>({
    queryKey: ['kudos-total'],
    queryFn: fetchTotal,
    staleTime: 60_000,
  })

  return { total, isLoading }
}
