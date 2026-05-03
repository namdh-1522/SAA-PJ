'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { MouseEvent } from 'react'

export interface NavLinkProps {
  href: string
  labelKey: string
  matchMode?: 'exact' | 'startsWith'
  className?: string
  activeClassName?: string
  inactiveClassName?: string
}

export default function NavLink({
  href,
  labelKey,
  matchMode = 'exact',
  className = '',
  activeClassName = 'text-[var(--color-accent-gold-alt)] underline underline-offset-8 decoration-2',
  inactiveClassName = 'text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold-alt)]',
}: NavLinkProps) {
  const pathname = usePathname()
  const t = useTranslations()
  const isActive =
    matchMode === 'startsWith' ? pathname.startsWith(href) : pathname === href

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isActive) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Link
      href={href}
      data-active={String(isActive)}
      onClick={handleClick}
      className={`transition-colors duration-150 ${isActive ? activeClassName : inactiveClassName} ${className}`}
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      {t(labelKey)}
    </Link>
  )
}
