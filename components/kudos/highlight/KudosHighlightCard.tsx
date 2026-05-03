'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import ArrowSentIcon from '@/components/icons/arrow-sent-icon'
import CopyLinkButton from '@/components/kudos/feed/CopyLinkButton'
import HeartButton from '@/components/kudos/feed/HeartButton'
import UserInfoBlock from '@/components/kudos/shared/UserInfoBlock'
import AvatarHoverPreview from '@/components/kudos/shared/AvatarHoverPreview'
import { formatKudosTimestamp } from '@/lib/kudos/format-timestamp'
import { sanitizeKudosContent } from '@/lib/kudos/sanitize-content'
import { HIGHLIGHT_CONTENT_MAX_LINES, MAX_HASHTAGS_DISPLAY } from '@/lib/kudos/constants'
import type { KudosHighlight } from '@/types/kudos'

interface KudosHighlightCardProps {
  highlight: KudosHighlight
  currentUserId: string
}

/** B.3 — Figma 2940:13465: cream, 4px gold, pad 24/24/16/24, avatars 64, meta + actions row. */
export default function KudosHighlightCard({ highlight, currentUserId }: KudosHighlightCardProps) {
  const t = useTranslations('kudos.highlight')
  const allHashtags = highlight.hashtags as readonly import('@/types/kudos').Hashtag[]
  const visibleHashtags = allHashtags.slice(0, MAX_HASHTAGS_DISPLAY)
  const hasMoreHashtags = allHashtags.length > MAX_HASHTAGS_DISPLAY

  const sentIcon = 32

  return (
    <article
      className="flex h-full flex-col gap-4 rounded-[var(--radius-kudos-highlight)] px-6 pb-4 pt-6"
      style={{
        border: 'var(--border-kudos-highlight)',
        background: 'var(--color-kudos-cream)',
      }}
    >
      <div className="flex w-full items-start justify-between gap-6">
        <div className="flex min-w-0 flex-1 justify-center">
          <AvatarHoverPreview user={highlight.sender}>
            <UserInfoBlock user={highlight.sender} size="lg" layout="column" />
          </AvatarHoverPreview>
        </div>
        <div className="flex h-[123px] flex-shrink-0 items-center">
          <ArrowSentIcon width={sentIcon} height={sentIcon} className="text-[var(--color-cta-bg)]" />
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <AvatarHoverPreview user={highlight.receiver}>
            <UserInfoBlock user={highlight.receiver} size="lg" layout="column" />
          </AvatarHoverPreview>
        </div>
      </div>

      {/* Gold divider — Figma Rectangle 14 (between user row and content). */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ background: 'var(--color-cta-bg)' }}
      />

      <span
        className="text-[16px] font-bold leading-[24px] tracking-[0.5px]"
        style={{ color: 'var(--color-kudos-text-timestamp)' }}
      >
        {formatKudosTimestamp(highlight.createdAt)}
      </span>

      {/* B.3 Danh hiệu (title) — Figma 16/24 700, letter-spacing 0.5px, centred,
          dark-on-cream. Sits between the timestamp and the content body. */}
      {highlight.title && (
        <p
          className="text-center text-[16px] font-bold uppercase leading-[24px] tracking-[0.5px]"
          style={{ color: 'var(--color-kudos-text-on-cream)' }}
        >
          {highlight.title}
        </p>
      )}

      <div
        className="kudos-rich-content text-[20px] font-bold leading-[32px]"
        style={{
          color: 'var(--color-kudos-text-on-cream)',
          display: '-webkit-box',
          WebkitLineClamp: HIGHLIGHT_CONTENT_MAX_LINES,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        // Content is HTML produced by RichTextEditor (inline + lists +
        // blockquote + safe <a>). Already sanitised on insert; sanitise again
        // here as defence-in-depth. Using <div> so nested block elements
        // (<ol>, <blockquote>) are valid HTML.
        dangerouslySetInnerHTML={{ __html: sanitizeKudosContent(highlight.content) }}
      />

      {visibleHashtags.length > 0 && (
        <div className="flex max-w-full flex-wrap gap-x-7 gap-y-2">
          {visibleHashtags.map((tag) => (
            <span
              key={tag.id}
              className="text-[16px] font-bold leading-[24px] tracking-[0.5px]"
              style={{ color: 'var(--color-accent-red)' }}
            >
              #{tag.name}
            </span>
          ))}
          {hasMoreHashtags && (
            <span className="text-[14px] font-bold" style={{ color: 'var(--color-text-muted)' }}>
              +{allHashtags.length - MAX_HASHTAGS_DISPLAY}
            </span>
          )}
        </div>
      )}

      {/* Gold divider — Figma Rectangle 15 (between content and actions). */}
      <div
        aria-hidden="true"
        className="mt-auto h-px w-full"
        style={{ background: 'var(--color-cta-bg)' }}
      />

      <div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-3"
      >
        <HeartButton
          kudosId={highlight.id}
          senderId={highlight.senderId}
          currentUserId={currentUserId}
          initialCount={highlight.heartCount}
          initialHearted={highlight.hasHearted}
          // Push the latest authoritative count + hearted flag from the
          // highlights query into the locally-stateful useHeart so
          // cross-section toggles + Realtime patches reach the carousel
          // (without this, the filled-red heart drifts: feed shows ❤ but the
          // carousel keeps the empty outline).
          realtimeCount={highlight.heartCount}
          realtimeHearted={highlight.hasHearted}
          surface="cream"
        />
        <div className="flex items-center gap-6">
          <CopyLinkButton kudosId={highlight.id} surface="cream" />
          <Link
            href={`/kudos/${highlight.id}`}
            className="text-[14px] font-bold leading-[20px] tracking-[0.10px] underline-offset-4 hover:text-[var(--color-text-primary)] hover:underline"
            style={{ color: 'var(--color-cta-bg)' }}
          >
            {t('view_detail')}
          </Link>
        </div>
      </div>
    </article>
  )
}
