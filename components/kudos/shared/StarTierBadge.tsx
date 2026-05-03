import type { KudosUser } from '@/types/kudos'

const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: 'đã nhận được 10 Kudos',
  2: 'đã nhận được 20 Kudos',
  3: 'đã nhận được 50 Kudos',
}

interface StarTierBadgeProps {
  tier: KudosUser['starTier']
  className?: string
}

export default function StarTierBadge({ tier, className = '' }: StarTierBadgeProps) {
  if (!tier) return null

  const stars = Array.from({ length: tier })
  const label = TIER_LABELS[tier]

  return (
    <span
      className={`inline-flex items-center gap-[2px] ${className}`}
      aria-label={label}
      title={label}
    >
      {stars.map((_, i) => (
        <svg
          key={i}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 1l1.18 2.4L9 3.82l-2 1.95.47 2.73L5 7.25 2.53 8.5 3 5.77 1 3.82l2.82-.42L5 1z"
            fill="#FFEA9E"
          />
        </svg>
      ))}
    </span>
  )
}
