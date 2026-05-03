'use client'

import { useTranslations } from 'next-intl'
import HamburgerIcon from '@/components/icons/hamburger-icon'

export interface HamburgerButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export default function HamburgerButton({ isOpen, onToggle }: HamburgerButtonProps) {
  const t = useTranslations('home.a11y')
  return (
    <button
      type="button"
      aria-label={isOpen ? t('close_menu') : t('open_menu')}
      aria-controls="mobile-nav-drawer"
      aria-expanded={isOpen}
      onClick={onToggle}
      className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-hover-surface)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,234,158,0.5)] cursor-pointer"
    >
      <HamburgerIcon width={24} height={24} />
    </button>
  )
}
