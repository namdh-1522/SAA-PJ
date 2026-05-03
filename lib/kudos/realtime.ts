import { type RealtimeChannel, type SupabaseClient, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'
import { REALTIME_CHANNEL } from '@/lib/kudos/constants'

export type KudosRealtimeEventType = 'kudos.new' | 'kudos.liked' | 'secretBox.opened'

export interface KudosRealtimePayload {
  readonly type: KudosRealtimeEventType
  readonly ts: string
  readonly payload: {
    readonly kudosId: string
    readonly senderName?: string
    readonly receiverName?: string
    readonly content?: string
    readonly heartCount?: number
  }
}

export type KudosRealtimeHandler = (event: KudosRealtimePayload) => void
export type KudosRealtimeStatusHandler = (status: REALTIME_SUBSCRIBE_STATES) => void
export { REALTIME_SUBSCRIBE_STATES }

export function createKudosChannel(supabase: SupabaseClient): RealtimeChannel {
  return supabase.channel(REALTIME_CHANNEL)
}

export function subscribeKudosChannel(
  channel: RealtimeChannel,
  onEvent: KudosRealtimeHandler,
  onStatus?: KudosRealtimeStatusHandler
): RealtimeChannel {
  return channel
    .on('broadcast', { event: 'kudos.new' }, ({ payload }) =>
      onEvent({ type: 'kudos.new', ts: payload.ts ?? new Date().toISOString(), payload })
    )
    .on('broadcast', { event: 'kudos.liked' }, ({ payload }) =>
      onEvent({ type: 'kudos.liked', ts: payload.ts ?? new Date().toISOString(), payload })
    )
    .on('broadcast', { event: 'secretBox.opened' }, ({ payload }) =>
      onEvent({ type: 'secretBox.opened', ts: payload.ts ?? new Date().toISOString(), payload })
    )
    .subscribe(onStatus)
}

export function unsubscribeKudosChannel(
  supabase: SupabaseClient,
  channel: RealtimeChannel
): void {
  supabase.removeChannel(channel)
}
