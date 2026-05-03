'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
// Plain <img> instead of next/image — avatars come from arbitrary OAuth hosts
// (Google, dicebear, etc.); a single un-allowlisted host throws at render and
// would otherwise crash the surrounding KudosSectionErrorBoundary.
import StarTierBadge from '@/components/kudos/shared/StarTierBadge'
import { AVATAR_HOVER_DELAY_MS } from '@/lib/kudos/constants'
import type { KudosUser } from '@/types/kudos'

interface AvatarHoverPreviewProps {
  user: KudosUser
  children: React.ReactNode
  className?: string
}

export default function AvatarHoverPreview({
  user,
  children,
  className = '',
}: AvatarHoverPreviewProps) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => setOpen(true), AVATAR_HOVER_DELAY_MS)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(false)
  }, [])

  const handleClick = useCallback(() => {
    router.push(`/profile/${user.id}`)
  }, [router, user.id])

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Xem profile ${user.name}`}
        className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-bg)] rounded-full"
      >
        {children}
      </button>

      {open && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px] rounded-[var(--radius-kudos-panel)] p-[16px] flex flex-col gap-[8px] shadow-lg pointer-events-none"
          style={{
            background: 'var(--color-kudos-bg-panel)',
            border: 'var(--border-kudos-panel)',
            zIndex: 'var(--z-kudos-tooltip)',
          }}
        >
          <div className="flex items-center gap-[8px]">
            <div
              className="relative flex-shrink-0 rounded-full overflow-hidden"
              style={{ width: 48, height: 48, border: 'var(--border-kudos-avatar)' }}
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-cta-text)] font-bold text-[14px]"
                  style={{ background: 'var(--color-kudos-gold-hover)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold leading-[20px] text-[var(--color-cta-bg)] truncate">
                {user.name}
              </span>
              <StarTierBadge tier={user.starTier} />
              {user.department && (
                <span className="text-[12px] font-bold leading-[16px] text-[var(--color-kudos-text-timestamp)] truncate">
                  {user.department}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
