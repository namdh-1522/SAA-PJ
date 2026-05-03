'use client'

import { useTranslations } from 'next-intl'

interface ReconnectBannerProps {
  visible: boolean
}

export default function ReconnectBanner({ visible }: ReconnectBannerProps) {
  const t = useTranslations('kudos.feed')

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[8px] text-[14px] font-bold"
      style={{
        background: 'rgba(212, 39, 29, 0.15)',
        border: '1px solid var(--color-status-unread)',
        color: 'var(--color-text-primary)',
      }}
    >
      <span
        className="w-[14px] h-[14px] rounded-full border-2 border-current border-t-transparent animate-spin"
        aria-hidden="true"
      />
      {t('reconnecting')}
    </div>
  )
}
