'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import NavLink from './nav-link'
import LanguageSelector from './language-selector'
import { createClient } from '@/lib/supabase/client'

export interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  isAdmin: boolean
}

const LINKS = [
  { href: '/about-saa-2025', labelKey: 'common.nav.about', matchMode: 'exact' as const },
  { href: '/awards', labelKey: 'common.nav.awards', matchMode: 'startsWith' as const },
  { href: '/kudos', labelKey: 'common.nav.kudos', matchMode: 'startsWith' as const },
]

export default function MobileNavDrawer({ isOpen, onClose, isAdmin }: MobileNavDrawerProps) {
  const router = useRouter()
  const t = useTranslations('home.menu')

  useEffect(() => {
    if (!isOpen) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    onClose()
    router.push('/')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      id="mobile-nav-drawer"
      className="fixed inset-0 z-[var(--z-dropdown)] md:hidden"
    >
      <div
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-[var(--color-bg-dark)] border-l border-[var(--color-divider)] flex flex-col gap-6 p-6 overflow-y-auto">
        <nav className="flex flex-col gap-4 text-lg">
          {LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              labelKey={link.labelKey}
              matchMode={link.matchMode}
            />
          ))}
        </nav>
        <div className="border-t border-[var(--color-divider)] pt-4">
          <LanguageSelector />
        </div>
        <div className="border-t border-[var(--color-divider)] pt-4 flex flex-col gap-2">
          <Link
            href="/profile"
            onClick={onClose}
            className="text-[var(--color-text-primary)]"
          >
            {t('profile')}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="text-[var(--color-text-primary)]"
            >
              {t('admin')}
            </Link>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="text-left text-[var(--color-text-primary)]"
          >
            {t('sign_out')}
          </button>
        </div>
      </div>
    </div>
  )
}
