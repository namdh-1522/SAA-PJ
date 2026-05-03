import { useTranslations } from 'next-intl'
import TargetIcon from '@/components/icons/target-icon'

export interface AwardsSideNavItemProps {
  slug: string
  labelKey: string
  active: boolean
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export default function AwardsSideNavItem({ slug, labelKey, active, onClick }: AwardsSideNavItemProps) {
  const t = useTranslations()
  const activeClasses =
    'text-[var(--color-accent-gold-alt)] border-b border-[var(--color-accent-gold-alt)] [text-shadow:var(--text-shadow-active)] [filter:var(--filter-glow-active)]'
  const inactiveClasses =
    'text-white rounded hover:bg-[var(--color-cta-outline-hover)]'

  return (
    <a
      href={`#${slug}`}
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={`flex items-center gap-1 p-4 h-14 font-bold text-sm leading-5 tracking-[0.25px] transition-colors duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold-alt)] focus-visible:outline-offset-2 ${active ? activeClasses : inactiveClasses}`}
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      <TargetIcon width={24} height={24} />
      <span>{t(labelKey)}</span>
    </a>
  )
}
