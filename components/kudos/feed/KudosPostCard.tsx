import KudosPostHeader from '@/components/kudos/feed/KudosPostHeader'
import KudosPostContent from '@/components/kudos/feed/KudosPostContent'
import KudosPostActions from '@/components/kudos/feed/KudosPostActions'
import type { Kudos } from '@/types/kudos'

interface KudosPostCardProps {
  kudo: Kudos
  currentUserId: string
  onHashtagClick?: (tag: string) => void
  isNew?: boolean
}

/**
 * C.3 KUDO Post — Figma node `3127:21871`.
 *
 * Layout (top → bottom, all separated by gold 1 px dividers per Figma):
 *   1. User row (sender column → arrow → receiver column)
 *   2. Gold divider (Rectangle 14)
 *   3. Content frame: timestamp + content body in yellow box + images + hashtags
 *   4. Gold divider (Rectangle 15)
 *   5. Action row (hearts LEFT, copy link RIGHT — `space-between`)
 *
 * Card surface: cream `#FFF8E1`, padding `40 40 16 40`, radius 24.
 */
export default function KudosPostCard({
  kudo,
  currentUserId,
  onHashtagClick,
  isNew = false,
}: KudosPostCardProps) {
  return (
    <article
      className={`flex w-full max-w-[680px] flex-col gap-[var(--spacing-kudos-card-gap)] rounded-[var(--radius-kudos-card)] ${isNew ? 'animate-[fadeInUp_0.3s_ease-out]' : ''}`}
      style={{
        background: 'var(--color-kudos-cream)',
        padding: 'var(--spacing-kudos-card-pad) var(--spacing-kudos-card-pad) var(--spacing-kudos-card-pad-b)',
      }}
    >
      <KudosPostHeader
        sender={kudo.sender}
        receiver={kudo.receiver}
      />

      {/* Gold divider — Figma Rectangle 14 (between user row and content). */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ background: 'var(--color-cta-bg)' }}
      />

      <KudosPostContent
        kudosId={kudo.id}
        title={kudo.title}
        content={kudo.content}
        imageUrls={kudo.imageUrls}
        hashtags={kudo.hashtags}
        timestamp={kudo.createdAt}
        onHashtagClick={onHashtagClick}
      />

      {/* Gold divider — Figma Rectangle 15 (between content and actions). */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ background: 'var(--color-cta-bg)' }}
      />

      <KudosPostActions
        kudosId={kudo.id}
        senderId={kudo.senderId}
        currentUserId={currentUserId}
        heartCount={kudo.heartCount}
        hasHearted={kudo.hasHearted}
        realtimeCount={kudo.heartCount}
        realtimeHearted={kudo.hasHearted}
      />
    </article>
  )
}
