import Link from 'next/link'
import { useTranslations } from 'next-intl'
import ArrowUpRightIcon from '@/components/icons/arrow-up-right-icon'

export interface HeroCtaButtonProps {
  href: string
  labelKey: string
}

export default function HeroCtaButton({ href, labelKey }: HeroCtaButtonProps) {
  const t = useTranslations()
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 w-full sm:w-[276px] h-[60px] px-6 py-4 rounded-[var(--radius-btn)] font-bold text-[22px] leading-7 transition-colors duration-150 border bg-[var(--color-cta-outline-bg)] border-[var(--color-cta-outline-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-cta-bg)] hover:text-[var(--color-cta-text)] hover:border-transparent focus-visible:outline-2 focus-visible:outline-[var(--color-cta-bg)] focus-visible:outline-offset-2 focus:outline-none"
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      <span className="flex-1 text-center whitespace-nowrap">{t(labelKey)}</span>
      <ArrowUpRightIcon width={24} height={24} />
    </Link>
  )
}
