// Avatars are tiny (32–40px) and may come from arbitrary OAuth providers
// (Google, dicebear seed data, etc.). Plain `<img>` avoids the strict hostname
// allowlist that `next/image` enforces — a single mis-configured host would
// otherwise throw at render time and crash the entire surrounding section.
import StarTierBadge from '@/components/kudos/shared/StarTierBadge'
import type { KudosUser } from '@/types/kudos'

interface UserInfoBlockProps {
  user: KudosUser
  showDept?: boolean
  size?: 'sm' | 'md' | 'lg'
  /**
   * Layout direction.
   * - `'row'` (default): avatar on the LEFT, name/dept stacked to the RIGHT — used
   *   in leaderboards and inline contexts.
   * - `'column'`: avatar on TOP, name/dept centered BELOW — matches the Figma
   *   `Info user` design used inside Kudos cards (B.3 highlight, C.3 feed).
   */
  layout?: 'row' | 'column'
  /** When set, overrides default name colour (e.g. cream cards use `--color-kudos-text-on-cream`). */
  nameClassName?: string
  className?: string
}

export default function UserInfoBlock({
  user,
  showDept = true,
  size = 'md',
  layout = 'row',
  nameClassName,
  className = '',
}: UserInfoBlockProps) {
  const avatarSize = size === 'sm' ? 32 : size === 'lg' ? 64 : 40
  const nameClass =
    nameClassName ??
    (size === 'lg'
      ? 'text-[16px] font-bold leading-[24px] tracking-[0.15px] text-[var(--color-kudos-text-on-cream)]'
      : size === 'sm'
        ? 'text-[14px] font-bold leading-[20px] text-[var(--color-cta-bg)]'
        : 'text-[16px] font-bold leading-[24px] text-[var(--color-cta-bg)]')

  const initialSizeClass = size === 'lg' ? 'text-[18px]' : 'text-[12px]'

  // ── Column layout: matches Figma `Info user` (instances 256:4858 / 256:4860).
  // Frame: flex-col, gap 13px, items-center, justify-center, width ~235px.
  // Inner Frame 477: flex-col, gap 2px, items-flex-start, name text-align center.
  if (layout === 'column') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-[13px] ${className}`}
      >
        <div
          className="relative flex-shrink-0 overflow-hidden rounded-full"
          style={{
            width: avatarSize,
            height: avatarSize,
            border: 'var(--border-kudos-avatar)',
          }}
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              width={avatarSize}
              height={avatarSize}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center font-bold text-[var(--color-cta-text)] ${initialSizeClass}`}
              style={{ background: 'var(--color-kudos-gold-hover)' }}
              aria-hidden="true"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex w-full min-w-0 flex-col items-center gap-[2px]">
          <span className={`${nameClass} max-w-full truncate text-center`}>
            {user.name}
          </span>
          <div className="flex items-center justify-center gap-[10px]">
            <StarTierBadge tier={user.starTier} />
            {showDept && user.department && (
              <span
                className="truncate text-[14px] font-bold leading-[20px] tracking-[0.10px] text-[var(--color-kudos-text-timestamp)]"
              >
                {user.department}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Row layout (default): avatar LEFT, name+dept stacked to the RIGHT.
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-full"
        style={{
          width: avatarSize,
          height: avatarSize,
          border: 'var(--border-kudos-avatar)',
        }}
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name}
            width={avatarSize}
            height={avatarSize}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center font-bold text-[var(--color-cta-text)] ${initialSizeClass}`}
            style={{ background: 'var(--color-kudos-gold-hover)' }}
            aria-hidden="true"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-1">
          <span className={`${nameClass} truncate`}>{user.name}</span>
          <StarTierBadge tier={user.starTier} />
        </div>
        {showDept && user.department && (
          <span
            className="truncate text-[14px] font-bold leading-[20px] tracking-[0.10px] text-[var(--color-kudos-text-timestamp)]"
          >
            {user.department}
          </span>
        )}
      </div>
    </div>
  )
}
