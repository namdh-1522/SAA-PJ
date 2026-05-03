'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import UserIcon from '@/components/icons/user-icon'
import { createClient } from '@/lib/supabase/client'

export interface AvatarMenuProps {
  isAdmin: boolean
  userEmail?: string
}

export default function AvatarMenu({ isAdmin, userEmail }: AvatarMenuProps) {
  const router = useRouter()
  const t = useTranslations('home.menu')
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } finally {
      setIsOpen(false)
      setIsSigningOut(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full border border-[var(--color-cta-outline-border)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-hover-surface)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,234,158,0.5)] transition-colors cursor-pointer"
      >
        <UserIcon width={24} height={24} />
      </button>
      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 top-12 min-w-[200px] z-[var(--z-dropdown)] bg-[var(--color-bg-header)] border border-[var(--color-divider)] rounded-[var(--radius-lang)] overflow-hidden py-1"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {userEmail && (
            <li className="px-4 py-2 text-sm text-[var(--color-text-muted)] truncate" role="none">
              {userEmail}
            </li>
          )}
          <li role="none">
            <Link
              href="/profile"
              role="menuitem"
              className="block px-4 py-2 text-[var(--color-text-primary)] hover:bg-[var(--color-hover-surface)]"
              onClick={() => setIsOpen(false)}
            >
              {t('profile')}
            </Link>
          </li>
          {isAdmin && (
            <li role="none">
              <Link
                href="/admin"
                role="menuitem"
                className="block px-4 py-2 text-[var(--color-text-primary)] hover:bg-[var(--color-hover-surface)]"
                onClick={() => setIsOpen(false)}
              >
                {t('admin')}
              </Link>
            </li>
          )}
          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full text-left px-4 py-2 text-[var(--color-text-primary)] hover:bg-[var(--color-hover-surface)] disabled:opacity-60 disabled:cursor-wait"
            >
              {t('sign_out')}
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
