'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import KudosPostCard from '@/components/kudos/feed/KudosPostCard'
import LoadMoreButton from '@/components/kudos/feed/LoadMoreButton'
import ReconnectBanner from '@/components/kudos/feed/ReconnectBanner'
import KudosSectionHeading from '@/components/kudos/shared/KudosSectionHeading'
import { KudosFeedCardSkeleton } from '@/components/kudos/shared/KudosSkeleton'
import { useKudosFeed } from '@/hooks/kudos/use-kudos-feed'
import { useKudosFilters } from '@/hooks/kudos/use-kudos-filters'
import { useRealtimeKudos } from '@/hooks/kudos/use-realtime-kudos'
import type { TickerEvent, Kudos, KudosHighlight } from '@/types/kudos'

interface KudosAllFeedProps {
  currentUserId: string
}

export default function KudosAllFeed({ currentUserId }: KudosAllFeedProps) {
  const t = useTranslations('kudos.feed')
  const tPage = useTranslations('kudos.page')
  const queryClient = useQueryClient()
  const { hashtag, dept, setHashtag } = useKudosFilters()
  const { kudos, isLoading, isLoadingMore, hasMore, error, loadMore, patchKudosHeart } =
    useKudosFeed({ hashtag, dept })

  const handleRealtime = useCallback(
    (event: TickerEvent) => {
      if (event.type === 'kudos.new' && event.payload) {
        loadMore()
      }
      if (event.type === 'kudos.liked' && event.payload.kudosId && event.payload.heartCount !== undefined) {
        const { kudosId, heartCount } = event.payload
        patchKudosHeart(kudosId, heartCount)
        // Mirror the feed patch into every cached highlights list so the
        // carousel doesn't drift from the feed when another user hearts a
        // kudo (this section owns the only Realtime subscription on the page).
        queryClient.setQueriesData<readonly KudosHighlight[]>(
          { queryKey: ['kudos-highlights'] },
          (prev) =>
            prev
              ? prev.map((h) => (h.id === kudosId ? { ...h, heartCount } : h))
              : prev
        )
      }
    },
    [loadMore, patchKudosHeart, queryClient]
  )

  const { isConnected } = useRealtimeKudos(handleRealtime)

  // Auto-load next page when the sentinel scrolls into view. Uses a 200px
  // rootMargin so the next page starts fetching before the user actually
  // hits the bottom of the list.
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore || isLoadingMore || error) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, error, loadMore])

  const header = (
    <KudosSectionHeading caption={tPage('brand_caption')} title={t('section_title')} />
  )

  if (isLoading) {
    return (
      <section
        aria-label="All Kudos"
        className="flex w-full max-w-[760px] flex-col gap-[var(--spacing-kudos-feed-gap)]"
      >
        {header}
        {[1, 2, 3].map((i) => (
          <KudosFeedCardSkeleton key={i} />
        ))}
      </section>
    )
  }

  return (
    <section
      aria-label="All Kudos"
      className="flex w-full max-w-[760px] flex-col gap-[var(--spacing-kudos-feed-gap)]"
    >
      {header}

      <ReconnectBanner visible={!isConnected} />

      {error && (
        <div className="text-[16px] font-bold py-[16px]" style={{ color: 'var(--color-status-unread)' }}>
          {t('error')}
        </div>
      )}

      {kudos.length === 0 && !error ? (
        <p className="text-[20px] font-bold py-[40px] text-center" style={{ color: 'var(--color-kudos-text-timestamp)' }}>
          {t('empty')}
        </p>
      ) : (
        kudos.map((kudo) => (
          <KudosPostCard
            key={kudo.id}
            kudo={kudo as Kudos}
            currentUserId={currentUserId}
            onHashtagClick={setHashtag}
          />
        ))
      )}

      {/* Sentinel: when in view, IntersectionObserver triggers loadMore(). */}
      {hasMore && !error && <div ref={sentinelRef} aria-hidden="true" />}

      {isLoadingMore && (
        <div className="flex justify-center py-[24px]" aria-live="polite" aria-busy="true">
          <span
            className="w-[24px] h-[24px] rounded-full border-2 border-current border-t-transparent animate-spin"
            style={{ color: 'var(--color-cta-bg)' }}
            aria-label={t('load_more_loading')}
          />
        </div>
      )}

      {/* Retry button only on error — successful loads happen automatically on scroll. */}
      {error && (
        <LoadMoreButton
          onClick={loadMore}
          isLoading={isLoadingMore}
          hasMore={hasMore}
          error={true}
        />
      )}
    </section>
  )
}
