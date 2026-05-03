'use client'

import { useTranslations } from 'next-intl'
import HeartIcon from '@/components/icons/heart-icon'
import { useHeart } from '@/hooks/kudos/use-heart'

interface HeartButtonProps {
  kudosId: string
  senderId: string
  currentUserId: string
  initialCount: number
  initialHearted: boolean
  realtimeCount?: number
  realtimeHearted?: boolean
  /** Figma C.4.1 / B.4.4: cream surface uses 32×32 icon + 24/32 count #00101A. */
  surface?: 'dark' | 'cream'
}

export default function HeartButton({
  kudosId,
  senderId,
  currentUserId,
  initialCount,
  initialHearted,
  realtimeCount,
  realtimeHearted,
  surface = 'dark',
}: HeartButtonProps) {
  const t = useTranslations('kudos.a11y')
  const { heartCount, hasHearted, isPending, isDisabled, toggle } = useHeart({
    kudosId,
    currentUserId,
    senderId,
    initialCount,
    initialHearted,
    realtimeCount,
    realtimeHearted,
  })

  const label = hasHearted
    ? t('heart_button_active', { count: heartCount })
    : isDisabled
    ? t('heart_disabled_own')
    : t('heart_button', { count: heartCount })

  const iconSize = surface === 'cream' ? 32 : 20
  const countClass =
    surface === 'cream' ? 'text-[24px] font-bold leading-[32px]' : 'text-[16px] font-bold leading-[24px]'

  const countColor =
    surface === 'cream'
      ? hasHearted
        ? 'var(--color-status-unread)'
        : 'var(--color-kudos-text-on-cream)'
      : hasHearted
        ? 'var(--color-status-unread)'
        : 'var(--color-kudos-text-timestamp)'

  const iconColor =
    hasHearted
      ? 'var(--color-status-unread)'
      : surface === 'cream'
        ? 'var(--color-kudos-text-timestamp)'
        : 'var(--color-kudos-text-timestamp)'

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isDisabled || isPending}
      aria-label={label}
      aria-pressed={hasHearted}
      className="relative inline-flex min-h-[48px] min-w-[48px] cursor-pointer items-center gap-1 transition-colors disabled:cursor-not-allowed sm:gap-2"
      style={{
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      <span className="absolute inset-[-4px] rounded-full" aria-hidden="true" />
      <span className={countClass} style={{ color: countColor }}>
        {heartCount}
      </span>
      <span className="flex items-center" style={{ color: iconColor }}>
        <HeartIcon width={iconSize} height={iconSize} filled={hasHearted} />
      </span>
    </button>
  )
}
