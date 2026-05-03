'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import BellIcon from '@/components/icons/bell-icon'

export default function NotificationButton() {
  const t = useTranslations('home.a11y')
  const [unreadCount, setUnreadCount] = useState(0)
  const [fetchFailed, setFetchFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchCount() {
      try {
        const res = await fetch('/api/notifications/unread-count', { cache: 'no-store' })
        if (!res.ok) throw new Error(`status ${res.status}`)
        const data = (await res.json()) as { count: number }
        if (!cancelled) setUnreadCount(typeof data.count === 'number' ? data.count : 0)
      } catch {
        if (!cancelled) setFetchFailed(true)
      }
    }
    fetchCount()
    return () => {
      cancelled = true
    }
  }, [])

  const showBadge = !fetchFailed && unreadCount > 0

  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-hover-surface)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,234,158,0.5)] transition-colors cursor-pointer"
    >
      <BellIcon width={24} height={24} />
      {showBadge && (
        <span
          aria-label={t('unread_notifications', { count: unreadCount })}
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-status-unread)]"
        />
      )}
    </button>
  )
}
