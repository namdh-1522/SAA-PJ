'use client'

import type { CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import MmMediaSearchIcon from '@/components/icons/mm-media-search-icon'
import { SUNNER_SEARCH_MAX_LENGTH } from '@/lib/kudos/constants'

interface SpotlightSearchProps {
  value: string
  onChange: (v: string) => void
  className?: string
  /** B.7.3 board variant: icon + short placeholder, pill shell. */
  variant?: 'default' | 'board'
}

const inputStyle: CSSProperties = {
  background: 'transparent',
}

const shellStyle: CSSProperties = {
  background: 'var(--color-kudos-pill-idle)',
}

/** B.7.3 — flat gold outline pill per design-style (no blur on cards). */
export default function SpotlightSearch({
  value,
  onChange,
  className,
  variant = 'default',
}: SpotlightSearchProps) {
  const t = useTranslations('kudos.spotlight')
  const placeholder =
    variant === 'board' ? t('search_placeholder_board') : t('search_placeholder')

  if (variant === 'board') {
    return (
      <div
        className={[
          'inline-flex min-h-[48px] w-full max-w-[min(320px,calc(100vw-3rem))] min-w-0 items-center gap-2 rounded-[var(--radius-kudos-pill-md)] border border-[var(--color-kudos-border)] px-3 py-2 sm:max-w-[280px]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={shellStyle}
      >
        <MmMediaSearchIcon width={24} height={24} className="flex-shrink-0 text-[var(--color-cta-bg)]" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={SUNNER_SEARCH_MAX_LENGTH}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-[16px] font-bold leading-[24px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-kudos-text-timestamp)] focus-visible:ring-0"
          style={inputStyle}
        />
      </div>
    )
  }

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={SUNNER_SEARCH_MAX_LENGTH}
      placeholder={placeholder}
      aria-label={placeholder}
      className={[
        'w-full min-w-0 rounded-[var(--radius-kudos-pill-md)] border border-[var(--color-kudos-border)] px-4 py-3 text-[16px] font-bold leading-[24px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-kudos-text-timestamp)] focus-visible:ring-2 focus-visible:ring-[var(--color-cta-bg)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background: 'var(--color-kudos-pill-idle)' }}
    />
  )
}
