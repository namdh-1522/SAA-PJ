interface SkeletonProps {
  className?: string
}

function Shimmer({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: 'var(--color-kudos-skeleton)' }}
      aria-hidden="true"
    />
  )
}

export function KudosFeedCardSkeleton() {
  return (
    <div
      className="p-[var(--spacing-kudos-card-pad)] rounded-[var(--radius-kudos-card)] flex flex-col gap-[var(--spacing-kudos-card-gap)]"
      style={{ background: 'var(--color-kudos-skeleton)' }}
    >
      <div className="flex items-center gap-[8px]">
        <Shimmer className="w-[40px] h-[40px] rounded-full" />
        <Shimmer className="w-[24px] h-[16px]" />
        <Shimmer className="w-[40px] h-[40px] rounded-full" />
        <Shimmer className="w-[80px] h-[16px] ml-2" />
      </div>
      <Shimmer className="w-full h-[20px]" />
      <Shimmer className="w-3/4 h-[20px]" />
      <Shimmer className="w-1/2 h-[20px]" />
      <div className="flex gap-[8px]">
        <Shimmer className="w-[60px] h-[24px] rounded-full" />
        <Shimmer className="w-[80px] h-[24px] rounded-full" />
      </div>
    </div>
  )
}

export function KudosHighlightCardSkeleton() {
  return (
    <div
      className="p-[24px] rounded-[var(--radius-kudos-highlight)] flex flex-col gap-[16px]"
      style={{ background: 'var(--color-kudos-skeleton)', border: 'var(--border-kudos-highlight)' }}
    >
      <div className="flex items-center gap-[8px]">
        <Shimmer className="w-[40px] h-[40px] rounded-full" />
        <Shimmer className="w-[100px] h-[16px]" />
      </div>
      <Shimmer className="w-full h-[16px]" />
      <Shimmer className="w-3/4 h-[16px]" />
      <Shimmer className="w-1/2 h-[16px]" />
    </div>
  )
}

export function KudosStatsCardSkeleton() {
  return (
    <div
      className="p-[var(--spacing-kudos-panel-pad)] rounded-[var(--radius-kudos-panel)] flex flex-col gap-[var(--spacing-kudos-panel-gap)]"
      style={{ background: 'var(--color-kudos-skeleton)', border: 'var(--border-kudos-panel)' }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <Shimmer className="w-[140px] h-[14px]" />
          <Shimmer className="w-[40px] h-[20px]" />
        </div>
      ))}
      <Shimmer className="w-full h-[40px] rounded-[var(--radius-kudos-open-gift)] mt-[8px]" />
    </div>
  )
}

export function KudosLeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-[12px] py-[8px]">
      <Shimmer className="w-[24px] h-[24px]" />
      <Shimmer className="w-[32px] h-[32px] rounded-full" />
      <Shimmer className="w-[100px] h-[14px]" />
      <Shimmer className="w-[40px] h-[14px] ml-auto" />
    </div>
  )
}

export function KudosCarouselSkeleton() {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center justify-between">
        <Shimmer className="w-[200px] h-[44px]" />
        <Shimmer className="w-[120px] h-[32px]" />
      </div>
      <KudosHighlightCardSkeleton />
      <div className="flex justify-center gap-[8px]">
        <Shimmer className="w-[32px] h-[32px] rounded-[var(--radius-kudos-arrow)]" />
        <Shimmer className="w-[60px] h-[16px]" />
        <Shimmer className="w-[32px] h-[32px] rounded-[var(--radius-kudos-arrow)]" />
      </div>
    </div>
  )
}

export function KudosHeroSkeleton() {
  return (
    <div className="flex flex-col items-center gap-[24px] py-[80px]">
      <Shimmer className="w-[300px] h-[80px]" />
      <Shimmer className="w-[200px] h-[24px]" />
      <div className="flex gap-[16px]">
        <Shimmer className="w-[140px] h-[52px] rounded-[var(--radius-kudos-pill-lg)]" />
        <Shimmer className="w-[180px] h-[52px] rounded-[var(--radius-kudos-pill-lg)]" />
      </div>
    </div>
  )
}

export default function KudosSkeleton() {
  return (
    <div className="flex flex-col gap-[var(--spacing-kudos-feed-gap)] w-full" aria-busy="true" aria-label="Đang tải...">
      <KudosHeroSkeleton />
      <KudosCarouselSkeleton />
      <div className="flex gap-[24px]">
        <div className="flex-1 flex flex-col gap-[var(--spacing-kudos-feed-gap)]">
          {Array.from({ length: 3 }).map((_, i) => (
            <KudosFeedCardSkeleton key={i} />
          ))}
        </div>
        <div className="w-[320px] flex flex-col gap-[24px]">
          <KudosStatsCardSkeleton />
          {Array.from({ length: 5 }).map((_, i) => (
            <KudosLeaderboardRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
