'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import type { AwardCategory } from '@/types/home'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import AwardsSideNavItem from './awards-side-nav-item'

export interface AwardsSideNavProps {
  awards: readonly AwardCategory[]
}

export default function AwardsSideNav({ awards }: AwardsSideNavProps) {
  const slugs = useMemo(() => awards.map((a) => a.slug), [awards])
  const { activeSlug, setActiveSlug, scrollTo } = useScrollSpy(slugs)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    if (hash && slugs.includes(hash)) {
      setActiveSlug(hash)
      scrollTo(hash, { updateHash: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function handleClick(slug: string) {
    return function (e: React.MouseEvent<HTMLAnchorElement>) {
      e.preventDefault()
      setActiveSlug(slug)
      scrollTo(slug, { updateHash: true })
    }
  }

  return (
    <>
      {/* Desktop: sticky side column */}
      <aside
        className="hidden xl:flex flex-col gap-4 w-[178px] sticky top-[112px] self-start shrink-0"
        aria-label="Award categories"
      >
        {awards.map((award) => (
          <AwardsSideNavItem
            key={award.slug}
            slug={award.slug}
            labelKey={`awards.menu.${award.slug}`}
            active={activeSlug === award.slug}
            onClick={handleClick(award.slug)}
          />
        ))}
      </aside>

      {/* Mobile / tablet: horizontal scroll strip pinned below the header */}
      <nav
        className="xl:hidden sticky top-[56px] z-[var(--z-header)] bg-[var(--color-bg-dark)] border-b border-[var(--color-divider)] flex overflow-x-auto gap-1 px-4 h-14 items-center"
        aria-label="Award categories"
      >
        {awards.map((award) => (
          <AwardsSideNavItem
            key={award.slug}
            slug={award.slug}
            labelKey={`awards.menu.${award.slug}`}
            active={activeSlug === award.slug}
            onClick={handleClick(award.slug)}
          />
        ))}
      </nav>
    </>
  )
}
