'use client'

import { useTranslations } from 'next-intl'
import CopyLinkIcon from '@/components/icons/copy-link-icon'
import { useCopyLink } from '@/hooks/kudos/use-copy-link'

interface CopyLinkButtonProps {
  kudosId: string
  /** C.4.2 on cream: #00101A body emphasis. */
  surface?: 'dark' | 'cream'
}

export default function CopyLinkButton({ kudosId, surface = 'dark' }: CopyLinkButtonProps) {
  const t = useTranslations('kudos')
  const { copied, copy } = useCopyLink()

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/kudos/${kudosId}`
    : `/kudos/${kudosId}`

  const fg =
    surface === 'cream' ? 'var(--color-kudos-text-on-cream)' : 'var(--color-kudos-text-timestamp)'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => copy(url)}
        aria-label={t('a11y.copy_link_button')}
        className="relative inline-flex min-h-[48px] cursor-pointer items-center gap-2 text-[16px] font-bold leading-[24px] transition-colors hover:opacity-90"
        style={{ color: fg }}
      >
        <span className="absolute inset-[-4px] rounded-full" aria-hidden="true" />
        <CopyLinkIcon width={24} height={24} />
        <span>{t('feed.copy_link')}</span>
      </button>
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-[12px] font-bold"
          style={{
            background: 'var(--color-kudos-bg-panel)',
            border: 'var(--border-kudos-panel)',
            color: 'var(--color-cta-bg)',
            zIndex: 'var(--z-kudos-toast)',
          }}
        >
          {t('feed.copied')}
        </div>
      )}
    </div>
  )
}
