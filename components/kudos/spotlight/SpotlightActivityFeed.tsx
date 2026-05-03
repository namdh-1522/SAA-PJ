'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { formatKudosActivityTime } from '@/lib/kudos/format-timestamp'
import type { Kudos } from '@/types/kudos'

const SPOTLIGHT_ACTIVITY_ROWS = 6

async function fetchRecentKudos(): Promise<Kudos[]> {
  const res = await fetch('/api/kudos?page=1')
  if (!res.ok) throw new Error('Failed to load recent kudos')
  const body = (await res.json()) as { data: Kudos[] }
  return (body.data ?? []).slice(0, SPOTLIGHT_ACTIVITY_ROWS)
}

/** B.7.4 — bottom-left activity rail; copy pattern aligned with `Thông báo content` (spec). */
export default function SpotlightActivityFeed() {
  const t = useTranslations('kudos.spotlight')
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['spotlight-activity-feed'],
    queryFn: fetchRecentKudos,
    staleTime: 45_000,
    refetchInterval: 60_000,
  })

  // API returns newest-first; reverse so the newest row anchors at the bottom
  // (where the fade mask is fully opaque) and older rows fade out toward the top.
  const lines = useMemo(
    () =>
      rows
        .map((k) => ({
          kudosId: k.id,
          time: formatKudosActivityTime(k.createdAt),
          name: k.receiver.name || '—',
        }))
        .reverse(),
    [rows]
  )

  if (isLoading && lines.length === 0) {
    return (
      <div className="space-y-2" aria-hidden>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-[min(100%,280px)] animate-pulse rounded" style={{ background: 'var(--color-kudos-skeleton)' }} />
        ))}
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <p className="max-w-[min(100%,380px)] text-[12px] font-bold leading-[18px] sm:text-[14px] sm:leading-[20px]" style={{ color: 'var(--color-kudos-text-timestamp)' }}>
        {t('activity_empty')}
      </p>
    )
  }

  // Older rows (top) fade out; newest row (bottom) stays fully visible.
  const fadeMask = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.7) 65%, #000 100%)'

  return (
    <div
      className="flex max-w-[min(100%,420px)] flex-col gap-2"
      aria-label={t('activity_aria')}
      style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
    >
      {lines.map((line) => (
        <Link
          key={line.kudosId}
          href={`/kudos/${line.kudosId}`}
          className="text-left text-[12px] font-bold leading-[18px] transition-opacity hover:opacity-90 sm:text-[14px] sm:leading-[20px]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('activity_received', { time: line.time, name: line.name })}
        </Link>
      ))}
    </div>
  )
}
