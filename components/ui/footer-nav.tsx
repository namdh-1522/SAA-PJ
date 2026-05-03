import NavLink from './nav-link'

const LINKS = [
  { href: '/about-saa-2025', labelKey: 'common.nav.about', matchMode: 'exact' as const },
  { href: '/awards', labelKey: 'common.nav.awards', matchMode: 'startsWith' as const },
  { href: '/kudos', labelKey: 'common.nav.kudos', matchMode: 'startsWith' as const },
  { href: '/common-standards', labelKey: 'common.nav.standards', matchMode: 'startsWith' as const },
]

export default function FooterNav() {
  return (
    <nav className="flex flex-wrap items-center gap-8 md:gap-12 text-base leading-6 font-bold">
      {LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          labelKey={link.labelKey}
          matchMode={link.matchMode}
        />
      ))}
    </nav>
  )
}
