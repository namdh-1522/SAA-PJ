'use client'

import { useTranslations } from 'next-intl'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('awards')
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        <h2
          className="text-[var(--color-accent-gold-alt)] font-bold text-3xl leading-tight"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {t('error.title')}
        </h2>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center h-14 px-6 bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-bg-hover)] text-[var(--color-cta-text)] font-bold text-base leading-6 rounded-[var(--radius-btn)]"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {t('error.retry')}
        </button>
      </div>
    </div>
  )
}
