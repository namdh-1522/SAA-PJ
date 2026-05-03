'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  createKudosChannel,
  subscribeKudosChannel,
  unsubscribeKudosChannel,
  REALTIME_SUBSCRIBE_STATES,
} from '@/lib/kudos/realtime'
import { REALTIME_DEDUP_WINDOW_MS } from '@/lib/kudos/constants'
import type { KudosRealtimeHandler, KudosRealtimePayload } from '@/lib/kudos/realtime'

interface UseRealtimeKudosResult {
  isConnected: boolean
}

export function useRealtimeKudos(onEvent: KudosRealtimeHandler): UseRealtimeKudosResult {
  const [isConnected, setIsConnected] = useState(false)
  const lastEventTsRef = useRef<Record<string, number>>({})
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  const dedupedHandler = useCallback((event: KudosRealtimePayload) => {
    const key = `${event.type}:${event.payload.kudosId}`
    const now = Date.now()
    const last = lastEventTsRef.current[key] ?? 0
    if (now - last < REALTIME_DEDUP_WINDOW_MS) return
    lastEventTsRef.current[key] = now
    onEventRef.current(event)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = createKudosChannel(supabase)

    subscribeKudosChannel(channel, dedupedHandler, (status) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) setIsConnected(true)
      if (
        status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR ||
        status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT ||
        status === REALTIME_SUBSCRIBE_STATES.CLOSED
      ) {
        setIsConnected(false)
      }
    })

    return () => {
      setIsConnected(false)
      unsubscribeKudosChannel(supabase, channel)
    }
  }, [dedupedHandler])

  return { isConnected }
}
