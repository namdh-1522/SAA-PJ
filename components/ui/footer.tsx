import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

export interface FooterProps {
  logoSlot?: ReactNode
  navSlot?: ReactNode
}

function DefaultLogo() {
  return (
    <Link href="/" aria-label="Go to homepage" className="flex items-center shrink-0">
      <Image
        src="/assets/login/logos/site-logo.png"
        width={52}
        height={48}
        alt="SAA 2025"
      />
    </Link>
  )
}

export default async function Footer({ logoSlot, navSlot }: FooterProps) {
  const t = await getTranslations('footer')
  const hasSlots = Boolean(logoSlot || navSlot)

  if (!hasSlots) {
    // Login call-site (no slots) — copyright-only layout.
    // Mobile-first responsive padding per design-style.md §D + Responsive section.
    // Always centered (single-child flex) per Figma: copyright sits horizontally centered in viewport.
    return (
      <footer className="absolute bottom-0 w-full z-[2] flex items-center justify-center px-4 py-6 md:px-12 md:py-10 xl:px-[90px] border-t border-[var(--color-divider)]">
        <p
          className="text-[var(--color-text-primary)] font-bold text-base leading-6 text-center min-w-[275px] max-w-full"
          style={{ fontFamily: 'var(--font-montserrat-alt)' }}
        >
          {t('copyright')}
        </p>
      </footer>
    )
  }

  // Homepage call-site (with slots) — logo + nav + copyright
  return (
    <footer className="relative w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-6 md:px-12 md:py-10 xl:px-36 border-t border-[var(--color-divider)]">
      <div className="flex items-center gap-20">
        {logoSlot ?? <DefaultLogo />}
        {navSlot}
      </div>
      <p
        className="text-[var(--color-text-primary)] font-bold text-base leading-6 text-center"
        style={{ fontFamily: 'var(--font-montserrat-alt)' }}
      >
        {t('copyright')}
      </p>
    </footer>
  )
}
