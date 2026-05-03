'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import LeaderboardRow from '@/components/kudos/panel/LeaderboardRow'
import { KudosLeaderboardRowSkeleton } from '@/components/kudos/shared/KudosSkeleton'
import { STALE_TIME_LEADERBOARD, LEADERBOARD_LIMIT } from '@/lib/kudos/constants'
import type { LeaderboardEntry } from '@/types/kudos'

async function fetchTopSunners(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`/api/sunners/top?limit=${LEADERBOARD_LIMIT}`)
  if (!res.ok) throw new Error('Failed to fetch leaderboard')
  return res.json()
}

/** D.3 — Figma 2940:13510. */
export default function KudosLeaderboard() {
  const router = useRouter()
  const t = useTranslations('kudos.leaderboard')

  const { data: entries = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['kudos-leaderboard'],
    queryFn: fetchTopSunners,
    staleTime: STALE_TIME_LEADERBOARD,
  })

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-kudos-panel)]"
      style={{ border: 'var(--border-kudos-panel)', background: 'var(--color-kudos-bg-panel)' }}
    >
      <div
        className="px-[var(--spacing-kudos-panel-pad)] pb-3 pt-[var(--spacing-kudos-panel-pad)]"
        style={{ borderBottom: '1px solid var(--color-divider-dark)' }}
      >
        <h3 className="text-[16px] font-bold leading-[24px] sm:text-[18px] sm:leading-[28px]" style={{ color: 'var(--color-text-primary)' }}>
          {t('section_title')}
        </h3>
      </div>
      <div className="flex flex-col gap-1 px-3 py-2">
        {isLoading ? (
          Array.from({ length: 5 }, (_, i) => <KudosLeaderboardRowSkeleton key={i} />)
        ) : entries.length === 0 ? (
          <p className="py-4 text-center text-[14px] font-bold" style={{ color: 'var(--color-text-muted)' }}>
            {t('empty')}
          </p>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.user.id}
              type="button"
              onClick={() => router.push(`/profile/${entry.user.id}`)}
              className="w-full text-left"
            >
              <LeaderboardRow entry={entry} />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
