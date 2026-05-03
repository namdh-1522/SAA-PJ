'use client'

import { useTranslations } from 'next-intl'
import OpenGiftButton from '@/components/kudos/panel/OpenGiftButton'
import { KudosStatsCardSkeleton } from '@/components/kudos/shared/KudosSkeleton'
import { useKudosStats } from '@/hooks/kudos/use-kudos-stats'

interface KudosStatsCardProps {
  userId: string
}

/** D.1 — Figma 2940:13489: panel #00070C, labels 22/28 white, values 32/40 gold, dividers #2E3940. */
function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-[var(--spacing-kudos-panel-gap)]">
      <span className="text-[18px] font-bold leading-[28px] sm:text-[22px]" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </span>
      <span className="text-[28px] font-bold leading-[36px] sm:text-[32px] sm:leading-[40px]" style={{ color: 'var(--color-cta-bg)' }}>
        {value.toLocaleString('vi-VN')}
      </span>
    </div>
  )
}

export default function KudosStatsCard({ userId }: KudosStatsCardProps) {
  const t = useTranslations('kudos.stats')
  const { stats, isLoading } = useKudosStats(userId)

  if (isLoading || !stats) return <KudosStatsCardSkeleton />

  return (
    <div
      className="rounded-[var(--radius-kudos-panel)]"
      style={{ border: 'var(--border-kudos-panel)', background: 'var(--color-kudos-bg-panel)' }}
    >
      <div
        className="px-[var(--spacing-kudos-panel-pad)] pb-3 pt-[var(--spacing-kudos-panel-pad)]"
        style={{ borderBottom: '1px solid var(--color-divider-dark)' }}
      >
        <h3 className="text-[18px] font-bold leading-[28px] sm:text-[20px] sm:leading-[32px]" style={{ color: 'var(--color-text-primary)' }}>
          {t('section_title')}
        </h3>
      </div>
      <div className="flex flex-col gap-0 px-[var(--spacing-kudos-panel-pad)] py-[var(--spacing-kudos-panel-pad)]">
        <StatRow label={t('kudos_received')} value={stats.kudosReceived} />
        <div style={{ borderTop: '1px solid var(--color-divider-dark)' }} />
        <StatRow label={t('kudos_sent')} value={stats.kudosSent} />
        <div style={{ borderTop: '1px solid var(--color-divider-dark)' }} />
        <StatRow label={t('hearts')} value={stats.hearts} />
        <div style={{ borderTop: '1px solid var(--color-divider-dark)' }} />
        <StatRow label={t('boxes_opened')} value={stats.secretBoxOpened} />
        <div style={{ borderTop: '1px solid var(--color-divider-dark)' }} />
        <StatRow label={t('boxes_closed')} value={stats.secretBoxClosed} />
        <div className="mt-4">
          <OpenGiftButton secretBoxClosed={stats.secretBoxClosed} />
        </div>
      </div>
    </div>
  )
}
