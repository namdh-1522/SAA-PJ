'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  HeartToggleResult,
  Kudos,
  KudosFeedPage,
  KudosHighlight,
} from '@/types/kudos'

interface UseHeartOptions {
  kudosId: string
  currentUserId: string
  senderId: string
  initialCount: number
  initialHearted: boolean
  realtimeCount?: number
  realtimeHearted?: boolean
}

interface UseHeartResult {
  heartCount: number
  hasHearted: boolean
  isPending: boolean
  isDisabled: boolean
  toggle: () => void
}

async function callToggle(kudosId: string, hasHearted: boolean): Promise<HeartToggleResult> {
  const method = hasHearted ? 'DELETE' : 'POST'
  const res = await fetch(`/api/kudos/${kudosId}/likes`, { method })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw Object.assign(new Error((body as { error?: string }).error ?? 'Heart failed'), { status: res.status })
  }
  return res.json() as Promise<HeartToggleResult>
}

export function useHeart({
  kudosId,
  currentUserId,
  senderId,
  initialCount,
  initialHearted,
  realtimeCount,
  realtimeHearted,
}: UseHeartOptions): UseHeartResult {
  const queryClient = useQueryClient()
  const [heartCount, setHeartCount] = useState(initialCount)
  const [hasHearted, setHasHearted] = useState(initialHearted)

  // Tracks whether a mutation is in-flight to prevent Realtime from overwriting optimistic state
  const isMutatingRef = useRef(false)

  const isDisabled = currentUserId === senderId

  // Sync authoritative count from Realtime patch when no mutation is pending
  useEffect(() => {
    if (realtimeCount !== undefined && !isMutatingRef.current) {
      setHeartCount(realtimeCount)
    }
  }, [realtimeCount])

  // Same trick for hasHearted — needed so the carousel's filled-red state
  // matches the feed when the cache is patched after a toggle in the OTHER
  // section (without this, useState only reads `initialHearted` once).
  useEffect(() => {
    if (realtimeHearted !== undefined && !isMutatingRef.current) {
      setHasHearted(realtimeHearted)
    }
  }, [realtimeHearted])

  const mutation = useMutation({
    // Pass the current hasHearted snapshot as a variable to avoid stale closure in mutationFn
    mutationFn: (currentHasHearted: boolean) => callToggle(kudosId, currentHasHearted),
    onMutate: async (currentHasHearted: boolean) => {
      isMutatingRef.current = true
      const prevCount = heartCount
      const prevHearted = currentHasHearted
      setHasHearted(!currentHasHearted)
      setHeartCount((c) => (currentHasHearted ? c - 1 : c + 1))
      return { prevCount, prevHearted }
    },
    onSuccess: (data) => {
      isMutatingRef.current = false
      setHeartCount(data.totalHearts)
      setHasHearted(data.hasHearted)
      // Patch every cached feed page and highlights list directly so OTHER
      // instances of this same kudo (e.g. the Highlight carousel showing the
      // row you just hearted on the feed, or vice-versa) flip immediately —
      // without waiting for the refetch round-trip. Then invalidate both keys
      // so any drift converges on the next fetch.
      queryClient.setQueriesData<KudosFeedPage>(
        { queryKey: ['kudos-feed'] },
        (prev) =>
          prev
            ? {
                ...prev,
                data: prev.data.map((k) =>
                  k.id === kudosId
                    ? { ...k, heartCount: data.totalHearts, hasHearted: data.hasHearted }
                    : k
                ) as readonly Kudos[],
              }
            : prev
      )
      queryClient.setQueriesData<readonly KudosHighlight[]>(
        { queryKey: ['kudos-highlights'] },
        (prev) =>
          prev
            ? prev.map((h) =>
                h.id === kudosId
                  ? { ...h, heartCount: data.totalHearts, hasHearted: data.hasHearted }
                  : h
              )
            : prev
      )
      queryClient.invalidateQueries({ queryKey: ['kudos-feed'] })
      queryClient.invalidateQueries({ queryKey: ['kudos-highlights'] })
    },
    onError: (_err, _vars, context) => {
      isMutatingRef.current = false
      if (context) {
        setHeartCount(context.prevCount)
        setHasHearted(context.prevHearted)
      }
    },
  })

  const toggle = useCallback(() => {
    if (isDisabled || mutation.isPending) return
    mutation.mutate(hasHearted)
  }, [isDisabled, mutation, hasHearted])

  return {
    heartCount,
    hasHearted,
    isPending: mutation.isPending,
    isDisabled,
    toggle,
  }
}
