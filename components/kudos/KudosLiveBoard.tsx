'use client'

import { Suspense } from 'react'
import KudosBoardHero from '@/components/kudos/hero/KudosBoardHero'
import KudosAllFeed from '@/components/kudos/feed/KudosAllFeed'
import KudosHighlightSection from '@/components/kudos/highlight/KudosHighlightSection'
import SpotlightBoard from '@/components/kudos/spotlight/SpotlightBoard'
import KudosRightPanel from '@/components/kudos/panel/KudosRightPanel'
import KudosSectionErrorBoundary from '@/components/kudos/shared/KudosSectionErrorBoundary'
import { KudoComposeProvider } from '@/components/kudos/compose/KudoComposeProvider'
import KudoComposeModal from '@/components/kudos/compose/KudoComposeModal'
import {
  KudosCarouselSkeleton,
  KudosFeedCardSkeleton,
  KudosStatsCardSkeleton,
} from '@/components/kudos/shared/KudosSkeleton'
import type { KudosUser } from '@/types/kudos'

interface KudosLiveBoardProps {
  currentUser: KudosUser
}

/** Kudos Live Board — Figma `MaZUn5xHXZ` (node 2940:13431), file `9ypp4enmFmdK3YAFJLIu6C`.
 *  B_Highlight + B.6/B.7 Spotlight share one column with `gap-24` (see design-style §Layout).
 *  Page horizontal gutter matches header / footer. */
const GUTTER = 'px-4 md:px-12 xl:px-36'
const SHELL = 'mx-auto w-full max-w-[1440px]'

export default function KudosLiveBoard({ currentUser }: KudosLiveBoardProps) {
  return (
    <KudoComposeProvider>
    <div
      className="min-h-screen w-full"
      style={{ background: 'var(--color-bg-dark)' }}
    >
      {/* A — Hero: full-bleed background, inner content max 1440px */}
      <KudosBoardHero />

      {/* B — Highlight carousel (optional) + B.6/B.7 Spotlight — single stack, gap 24px */}
      <div className={SHELL}>
      <div className={`${GUTTER} pt-10 pb-8`}>
        <div className="flex flex-col gap-6">
          <KudosSectionErrorBoundary>
            <Suspense fallback={<KudosCarouselSkeleton />}>
              <KudosHighlightSection currentUserId={currentUser.id} />
            </Suspense>
          </KudosSectionErrorBoundary>
          <KudosSectionErrorBoundary>
            <Suspense fallback={<KudosCarouselSkeleton />}>
              <SpotlightBoard />
            </Suspense>
          </KudosSectionErrorBoundary>
        </div>
      </div>
      </div>

      {/* C + D — Feed + Right Panel */}
      <div className={SHELL}>
      <div className={`${GUTTER} flex flex-col items-start gap-8 pb-20 lg:flex-row`}>
        {/* C — ~2fr */}
        <div className="w-full min-w-0 lg:flex-1">
          <KudosSectionErrorBoundary>
            <Suspense fallback={
              <div className="flex flex-col gap-[var(--spacing-kudos-feed-gap)]">
                {[1, 2, 3].map((i) => <KudosFeedCardSkeleton key={i} />)}
              </div>
            }>
              <KudosAllFeed currentUserId={currentUser.id} />
            </Suspense>
          </KudosSectionErrorBoundary>
        </div>

        {/* D — Right Panel: hidden on mobile, show as block from lg up */}
        <aside
          className="w-full lg:w-[min(422px,100%)] lg:flex-shrink-0 lg:block"
          aria-label="Thống kê và bảng xếp hạng"
        >
          {/* Tablet accordion: collapsed by default (lg:block overrides) */}
          <details className="lg:hidden" open={false}>
            <summary
              className="text-[16px] font-bold py-[12px] cursor-pointer"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Thống kê &amp; Bảng xếp hạng
            </summary>
            <KudosSectionErrorBoundary>
              <Suspense fallback={<KudosStatsCardSkeleton />}>
                <KudosRightPanel currentUser={currentUser} />
              </Suspense>
            </KudosSectionErrorBoundary>
          </details>
          <div className="hidden lg:block">
            <KudosSectionErrorBoundary>
              <Suspense fallback={<KudosStatsCardSkeleton />}>
                <KudosRightPanel currentUser={currentUser} />
              </Suspense>
            </KudosSectionErrorBoundary>
          </div>
        </aside>
      </div>
      </div>

      {/* Viết Kudo modal — frame ihQ26W78P2; mounted via Radix portal */}
      <KudoComposeModal />
    </div>
    </KudoComposeProvider>
  )
}
