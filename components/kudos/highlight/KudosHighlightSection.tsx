'use client'

import { useTranslations } from 'next-intl'
import KudosFilters from '@/components/kudos/highlight/KudosFilters'
import KudosHighlightCarousel from '@/components/kudos/highlight/KudosHighlightCarousel'
import KudosSectionHeading from '@/components/kudos/shared/KudosSectionHeading'
import { KudosCarouselSkeleton } from '@/components/kudos/shared/KudosSkeleton'
import { useKudosFilters } from '@/hooks/kudos/use-kudos-filters'
import { useKudosHighlights } from '@/hooks/kudos/use-kudos-highlights'

interface KudosHighlightSectionProps {
  currentUserId: string
}

/** B_Highlight — Figma MaZUn5xHXZ.
 *  When 0 highlights are returned with NO active filter, the entire B.1–B.5
 *  block is hidden (spec FR-017). When a filter IS active and returns 0
 *  highlights, the section stays visible so the user can see/clear the
 *  selected filter — otherwise the dropdowns vanish and they're stuck. */
export default function KudosHighlightSection({ currentUserId }: KudosHighlightSectionProps) {
  const t = useTranslations('kudos.highlight')
  const tFeed = useTranslations('kudos.feed')
  const tPage = useTranslations('kudos.page')
  const { hashtag, dept } = useKudosFilters()
  const { highlights, isLoading } = useKudosHighlights()

  const hasActiveFilter = Boolean(hashtag) || Boolean(dept)
  const isEmpty = !isLoading && highlights.length === 0

  // FR-017: hide entire block only when there are NO highlights AND the user
  // has no filter selected — otherwise we keep the filter dropdown visible.
  if (isEmpty && !hasActiveFilter) return null

  return (
    <section className="flex flex-col gap-6" aria-label="Highlight Kudos">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <KudosSectionHeading caption={tPage('brand_caption')} title={t('section_title')} />
        <KudosFilters />
      </div>

      {isLoading ? (
        <KudosCarouselSkeleton />
      ) : isEmpty ? (
        <div
          className="rounded-[var(--radius-kudos-highlight)] py-[40px] px-[24px] text-center"
          style={{
            border: 'var(--border-kudos-highlight)',
            background: 'var(--color-kudos-cream)',
          }}
        >
          <p
            className="text-[20px] font-bold"
            style={{ color: 'var(--color-kudos-text-on-cream, #00101A)' }}
          >
            {tFeed('empty')}
          </p>
        </div>
      ) : (
        <KudosHighlightCarousel
          key={highlights.map((h) => h.id).join('|')}
          highlights={highlights}
          currentUserId={currentUserId}
        />
      )}
    </section>
  )
}
