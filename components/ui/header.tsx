import Link from 'next/link'
import type { ReactNode } from 'react'

export interface HeaderProps {
  leftSlot?: ReactNode
  navSlot?: ReactNode
  rightSlot?: ReactNode
  /** Merged onto the `<header>` element (e.g. screen-specific background tokens). */
  className?: string
  /** @deprecated Use `rightSlot`. Kept for Login call-site backward-compatibility. */
  children?: ReactNode
}

function DefaultLogo() {
  return (
    <Link href="/" aria-label="Go to homepage" className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG; next/image would need dangerouslyAllowSVG */}
      <img
        src="/assets/login/logos/site-logo.svg"
        width={52}
        height={48}
        alt="SAA 2025"
      />
    </Link>
  )
}

export default function Header({
  leftSlot,
  navSlot,
  rightSlot,
  className,
  children,
}: HeaderProps) {
  const resolvedRight = rightSlot ?? children
  const resolvedLeft = leftSlot ?? <DefaultLogo />
  const headerClass = [
    'fixed top-0 w-full h-20 z-[var(--z-header)] flex items-center justify-between px-4 md:px-12 xl:px-36 bg-[var(--color-bg-header)]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={headerClass}>
      <div className="flex items-center gap-16">
        {resolvedLeft}
        {navSlot}
      </div>
      {resolvedRight}
    </header>
  )
}
