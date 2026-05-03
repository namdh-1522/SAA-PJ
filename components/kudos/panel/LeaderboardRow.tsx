import UserInfoBlock from '@/components/kudos/shared/UserInfoBlock'
import type { LeaderboardEntry } from '@/types/kudos'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
}

export default function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <div
      className="flex items-center gap-[12px] px-[12px] py-[8px] rounded-[8px] transition-colors"
      style={{ '--hover-bg': 'var(--color-cta-bg-hover)' } as React.CSSProperties}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,234,158,0.08)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
    >
      <span
        className="w-[24px] text-[16px] font-bold leading-[24px] text-center flex-shrink-0"
        style={{ color: entry.rank === 1 ? 'var(--color-accent-red-hot)' : 'var(--color-text-muted)' }}
      >
        {entry.rank}
      </span>
      <div className="flex-1 min-w-0">
        <UserInfoBlock
          user={entry.user}
          size="lg"
          nameClassName="text-[18px] font-bold leading-[28px] sm:text-[22px] text-[var(--color-text-primary)]"
        />
      </div>
      <span
        className="text-[16px] font-bold leading-[24px] flex-shrink-0"
        style={{ color: 'var(--color-cta-bg)' }}
      >
        {entry.kudosReceived}
      </span>
    </div>
  )
}
