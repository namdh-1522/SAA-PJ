import HeartButton from '@/components/kudos/feed/HeartButton'
import CopyLinkButton from '@/components/kudos/feed/CopyLinkButton'

interface KudosPostActionsProps {
  kudosId: string
  senderId: string
  currentUserId: string
  heartCount: number
  hasHearted: boolean
  realtimeCount?: number
  realtimeHearted?: boolean
}

/**
 * C.4 Action row — Figma node `I3127:21871;256:5194`.
 * Layout: flex-row, justify-between, items-center, height 56.
 *   - Hearts (count + icon) on the LEFT.
 *   - Copy Link button on the RIGHT.
 * The gold divider above this row is rendered by the parent card.
 */
export default function KudosPostActions({
  kudosId,
  senderId,
  currentUserId,
  heartCount,
  hasHearted,
  realtimeCount,
  realtimeHearted,
}: KudosPostActionsProps) {
  return (
    <div className="flex h-[56px] items-center justify-between gap-6">
      <HeartButton
        kudosId={kudosId}
        senderId={senderId}
        currentUserId={currentUserId}
        initialCount={heartCount}
        initialHearted={hasHearted}
        realtimeCount={realtimeCount}
        realtimeHearted={realtimeHearted}
        surface="cream"
      />
      <CopyLinkButton kudosId={kudosId} surface="cream" />
    </div>
  )
}
