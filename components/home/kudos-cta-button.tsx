import Link from 'next/link'
import { useTranslations } from 'next-intl'
import ArrowUpRightIcon from '@/components/icons/arrow-up-right-icon'

export default function KudosCtaButton() {
  const t = useTranslations('home.cta')
  return (
    <Link
      href="/kudos"
      className="inline-flex items-center gap-2 w-fit min-w-[127px] h-14 px-6 py-4 bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-bg-hover)] active:bg-[var(--color-cta-bg-active)] rounded-[var(--radius-btn)] text-[var(--color-cta-text)] font-bold text-base leading-6 tracking-[0.5px] transition-colors duration-150 focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-cta-bg)] focus-visible:outline-offset-2"
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      <span>{t('detail')}</span>
      <ArrowUpRightIcon width={20} height={20} />
    </Link>
  )
}
