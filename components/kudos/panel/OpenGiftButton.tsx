'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import OpenGiftIcon from '@/components/icons/open-gift-icon'

interface OpenGiftButtonProps {
  secretBoxClosed: number
}

export default function OpenGiftButton({ secretBoxClosed }: OpenGiftButtonProps) {
  const router = useRouter()
  const t = useTranslations('kudos.stats')
  const isDisabled = secretBoxClosed === 0

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => router.push('/kudos/open-box')}
      className="w-full flex items-center justify-center gap-[8px] py-[10px] text-[16px] font-bold leading-[24px] transition-opacity"
      style={{
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-cta-bg)',
        color: 'var(--color-cta-text)',
        opacity: isDisabled ? 0.4 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
      aria-disabled={isDisabled}
    >
      <OpenGiftIcon width={20} height={20} aria-hidden="true" />
      {t('open_gift')}
    </button>
  )
}
