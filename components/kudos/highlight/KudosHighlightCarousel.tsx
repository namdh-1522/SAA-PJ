'use client'

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import ChevronLeftIcon from '@/components/icons/chevron-left-icon'
import ChevronRightIcon from '@/components/icons/chevron-right-icon'
import KudosHighlightCard from '@/components/kudos/highlight/KudosHighlightCard'
import KudosSlideBar from '@/components/kudos/highlight/KudosSlideBar'
import { CAROUSEL_INTERVAL_MS } from '@/lib/kudos/constants'
import type { KudosHighlight } from '@/types/kudos'

interface KudosHighlightCarouselProps {
  highlights: KudosHighlight[]
  currentUserId: string
}

/** B.2 carousel — Figma B.2.1/B.2.2: 80×80, radius 4px, transparent + gold hover; chevron icons; auto-advance does not wrap past last slide. */
export default function KudosHighlightCarousel({ highlights, currentUserId }: KudosHighlightCarouselProps) {
  const t = useTranslations('kudos.highlight')
  // Default to the 2nd slide so the viewport renders prev + current + next on first paint
  // (with 1 highlight there is no 2nd slot, so fall back to 0). The parent re-mounts the
  // component when `highlights` changes (key={ids}), so this initial value runs per dataset.
  const [index, setIndex] = useState(() => (highlights.length >= 2 ? 1 : 0))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const n = highlights.length
  const clamped = n > 0 ? Math.min(Math.max(index, 0), n - 1) : 0

  const startAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (n <= 1) return
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const c = Math.min(Math.max(prev, 0), n - 1)
        if (c >= n - 1) return c
        return c + 1
      })
    }, CAROUSEL_INTERVAL_MS)
  }, [n])

  const stopAutoAdvance = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoAdvance()
    return stopAutoAdvance
  }, [startAutoAdvance, stopAutoAdvance])

  const goToPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  const goToNext = useCallback(() => {
    setIndex((i) => Math.min(n - 1, i + 1))
  }, [n])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && clamped > 0) goToPrev()
      if (e.key === 'ArrowRight' && clamped < n - 1) goToNext()
    },
    [clamped, n, goToPrev, goToNext]
  )

  if (highlights.length === 0) return null

  const current = highlights[clamped]
  // Peeking neighbours (B.2 carousel — faded slides on either side of the
  // active card per Figma 2940:13465). Don't wrap: at edges the corresponding
  // peek is omitted so the arrow's disabled state still reads naturally.
  const prevNeighbour = clamped > 0 ? highlights[clamped - 1] : null
  const nextNeighbour = clamped < n - 1 ? highlights[clamped + 1] : null

  const arrowClass =
    'flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[var(--radius-kudos-arrow)] text-[var(--color-cta-bg)] transition-colors duration-150'

  const isFirst = clamped === 0
  const isLast = clamped >= n - 1

  const arrowEnter = (enabled: boolean, el: HTMLButtonElement) => {
    if (enabled) el.style.background = 'var(--color-kudos-pill-idle)'
  }
  const arrowLeave = (el: HTMLButtonElement) => {
    el.style.background = 'transparent'
  }

  return (
    <div
      className="flex flex-col gap-4"
      onMouseEnter={stopAutoAdvance}
      onMouseLeave={startAutoAdvance}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`Highlight carousel — slide ${clamped + 1} of ${highlights.length}`}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        {n > 1 && (
          <button
            type="button"
            onClick={goToPrev}
            className={`${arrowClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-bg)]`}
            style={{
              background: 'transparent',
              opacity: isFirst ? 0.4 : 1,
              cursor: isFirst ? 'not-allowed' : 'pointer',
            }}
            disabled={isFirst}
            aria-label={t('carousel_prev')}
            onMouseEnter={(e) => arrowEnter(!isFirst, e.currentTarget)}
            onMouseLeave={(e) => arrowLeave(e.currentTarget)}
          >
            <ChevronLeftIcon width={24} height={24} className="flex-shrink-0" />
          </button>
        )}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          {/* B.2 carousel viewport — Figma 2940:13465.
               Three equal 50%-wide slots are rendered side-by-side and
               centred. The combined width (~150% of viewport + gaps) overflows
               naturally on both sides, so the prev/next cards peek out exactly
               25% each — matching the Figma "faded sides" composition. Empty
               slots are still rendered (rather than omitted) when there's no
               prev/next so the active card stays horizontally centred at the
               first and last positions. */}
          <div className="flex items-stretch justify-center gap-4 sm:gap-6">
            {/* Prev slot — 50% of viewport width */}
            <div className="w-1/2 flex-shrink-0">
              {prevNeighbour ? (
                <div
                  className="pointer-events-none opacity-40 transition-opacity duration-500 ease-out"
                  aria-hidden
                >
                  <KudosHighlightCard highlight={prevNeighbour} currentUserId={currentUserId} />
                </div>
              ) : null}
            </div>
            {/* Current slot — 50% of viewport, full opacity, interactive. */}
            <div className="w-1/2 flex-shrink-0 relative z-[1]">
              <KudosHighlightCard highlight={current} currentUserId={currentUserId} />
            </div>
            {/* Next slot — 50% of viewport width */}
            <div className="w-1/2 flex-shrink-0">
              {nextNeighbour ? (
                <div
                  className="pointer-events-none opacity-40 transition-opacity duration-500 ease-out"
                  aria-hidden
                >
                  <KudosHighlightCard highlight={nextNeighbour} currentUserId={currentUserId} />
                </div>
              ) : null}
            </div>
          </div>
          {/* Edge gradient masks — sit above the peeks so they fade into the
               page background (var(--color-bg-dark) → transparent). */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[18%] sm:w-[22%]"
            style={{ background: 'var(--gradient-kudos-carousel-mask-left)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-[18%] sm:w-[22%]"
            style={{ background: 'var(--gradient-kudos-carousel-mask-right)' }}
            aria-hidden
          />
        </div>
        {n > 1 && (
          <button
            type="button"
            onClick={goToNext}
            className={`${arrowClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-bg)]`}
            style={{
              background: 'transparent',
              opacity: isLast ? 0.4 : 1,
              cursor: isLast ? 'not-allowed' : 'pointer',
            }}
            disabled={isLast}
            aria-label={t('carousel_next')}
            onMouseEnter={(e) => arrowEnter(!isLast, e.currentTarget)}
            onMouseLeave={(e) => arrowLeave(e.currentTarget)}
          >
            <ChevronRightIcon width={24} height={24} className="flex-shrink-0" />
          </button>
        )}
      </div>
      {n > 1 && (
        <KudosSlideBar
          current={clamped}
          total={n}
          onPrev={goToPrev}
          onNext={goToNext}
          canPrev={!isFirst}
          canNext={!isLast}
        />
      )}
    </div>
  )
}
