'use client'

import { useTranslations } from 'next-intl'
import PencilKudosIcon from '@/components/icons/pencil-kudos-icon'
import { useKudoComposeContext } from '@/components/kudos/compose/KudoComposeProvider'

interface KudosComposeTriggerProps {
  className?: string
}

/** A.1 Ghi nhận — Figma 2940:13449 (738×72 pill).
 *  Visual: gold-soft fill (rgba(255,234,158,0.10)) + 1px gold border (#998C5F),
 *  pencil icon (32×32) on the left, placeholder copy
 *  "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?" — laid out like a
 *  composer prompt, NOT a centred-label button. Click opens the Viết Kudo modal
 *  (frame ihQ26W78P2) via KudoComposeProvider. */
export default function KudosComposeTrigger({ className = '' }: KudosComposeTriggerProps) {
  const t = useTranslations('kudos.hero')
  const { open } = useKudoComposeContext()

  return (
    <button
      type="button"
      onClick={open}
      aria-label={t('compose_aria')}
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
      <PencilKudosIcon
        width={32}
        height={32}
        className="flex-shrink-0 text-[var(--color-cta-bg)]"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{t('compose_cta')}</span>
    </button>
  )
}
