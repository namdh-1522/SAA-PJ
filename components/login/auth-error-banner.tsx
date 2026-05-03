'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function AuthErrorBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations('login')

  if (!searchParams.get('auth_error')) return null

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 rounded-[var(--radius-btn)] border border-red-400/30 bg-red-900/20 px-4 py-3 text-sm text-white backdrop-blur-sm"
    >
      <span>{t('error.oauth_failed')}</span>
      <button
        type="button"
        aria-label="dismiss"
        onClick={() => router.replace('/')}
        className="shrink-0 rounded p-1 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
