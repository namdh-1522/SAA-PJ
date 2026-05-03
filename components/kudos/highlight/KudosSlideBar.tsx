'use client'

import { useTranslations } from 'next-intl'
import ChevronLeftIcon from '@/components/icons/chevron-left-icon'
import ChevronRightIcon from '@/components/icons/chevron-right-icon'

interface KudosSlideBarProps {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

const barArrowClass =
  'flex h-12 w-12 min-h-[48px] min-w-[48px] flex-shrink-0 items-center justify-center rounded-[var(--radius-kudos-arrow)] text-[var(--color-cta-bg)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-bg)]'

/** B.5 — Figma `--text-h3` 28/36 for counter; chevrons match B.2 (transparent + soft-gold hover, no border). */
export default function KudosSlideBar({
  current,
  total,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: KudosSlideBarProps) {
  const t = useTranslations('kudos.highlight')

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={`${t('carousel_prev')} (${current + 1} / ${total})`}
        className={`${barArrowClass} disabled:cursor-not-allowed`}
        style={{
          background: 'transparent',
          opacity: canPrev ? 1 : 0.4,
          cursor: canPrev ? 'pointer' : 'not-allowed',
        }}
        onMouseEnter={(e) => {
          if (canPrev) e.currentTarget.style.background = 'var(--color-kudos-pill-idle)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <ChevronLeftIcon width={24} height={24} className="flex-shrink-0" />
      </button>
      <span
        className="text-[24px] font-bold leading-[32px] sm:text-[28px] sm:leading-[36px]"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {t('slide_counter', { current: current + 1, total })}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label={`${t('carousel_next')} (${current + 1} / ${total})`}
        className={`${barArrowClass} disabled:cursor-not-allowed`}
        style={{
          background: 'transparent',
          opacity: canNext ? 1 : 0.4,
          cursor: canNext ? 'pointer' : 'not-allowed',
        }}
        onMouseEnter={(e) => {
          if (canNext) e.currentTarget.style.background = 'var(--color-kudos-pill-idle)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <ChevronRightIcon width={24} height={24} className="flex-shrink-0" />
      </button>
    </div>
  )
}
