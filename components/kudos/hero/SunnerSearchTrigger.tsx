'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import MmMediaSearchIcon from '@/components/icons/mm-media-search-icon'

interface SunnerSearchTriggerProps {
  className?: string
}

/** Hero "Tìm kiếm sunner" — Figma 2940:13450 (381×72 pill).
 *  Visual: same pill treatment as A.1 (gold-soft fill + #998C5F border, radius
 *  64), search icon on the left, placeholder copy "Tìm kiếm" — laid out like a
 *  search input prompt, NOT a centred-label button. */
export default function SunnerSearchTrigger({ className = '' }: SunnerSearchTriggerProps) {
  const router = useRouter()
  const t = useTranslations('kudos.hero')

  return (
    <button
      type="button"
      onClick={() => router.push('/kudos/search')}
      aria-label={t('search_aria')}
      className={`group inline-flex h-[72px] min-h-[72px] items-center gap-2 rounded-[var(--radius-kudos-pill-lg)] border border-[var(--color-kudos-border)] px-6 text-left font-bold text-[16px] leading-[24px] transition-colors duration-150 ${className}`}
      style={{
        background: 'var(--color-kudos-pill-idle)',
        color: 'var(--color-text-primary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-kudos-pill-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-kudos-pill-idle)'
      }}
    >
      <MmMediaSearchIcon
        width={32}
        height={32}
        className="flex-shrink-0 text-[var(--color-cta-bg)]"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{t('search_cta')}</span>
    </button>
  )
}
