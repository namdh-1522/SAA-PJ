import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AwardsSideNav from '@/components/awards/awards-side-nav'
import type { AwardCategory } from '@/types/home'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

vi.mock('@/hooks/use-scroll-spy', () => ({
  useScrollSpy: () => ({
    activeSlug: 'top-talent',
    setActiveSlug: vi.fn(),
    scrollTo: vi.fn(),
  }),
}))

const makeAward = (slug: string): AwardCategory => ({
  id: slug,
  titleKey: `home.awards.${slug}.title`,
  descriptionKey: `home.awards.${slug}.description`,
  descriptionLongKey: `awards.${slug}.descriptionLong`,
  image: `/assets/home/awards/${slug}.png`,
  nameOverlayImage: `/assets/awards/overlays/${slug}.png`,
  slug,
  quantity: 1,
  quantityUnit: 'unit',
  values: [{ amountVnd: 1_000_000 }],
})

const awards = [
  makeAward('top-talent'),
  makeAward('top-project'),
  makeAward('top-project-leader'),
  makeAward('best-manager'),
  makeAward('signature-2025-creator'),
  makeAward('mvp'),
]

describe('AwardsSideNav', () => {
  it('renders nav items for all 6 awards (desktop + mobile = 12 total links)', () => {
    render(<AwardsSideNav awards={awards} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(12)
  })

  it('renders items in the correct order in the desktop aside', () => {
    const { container } = render(<AwardsSideNav awards={awards} />)
    const aside = container.querySelector('aside')!
    const links = Array.from(aside.querySelectorAll('a'))
    expect(links[0]).toHaveAttribute('href', '#top-talent')
    expect(links[5]).toHaveAttribute('href', '#mvp')
  })

  it('marks the active slug item with aria-current="true"', () => {
    render(<AwardsSideNav awards={awards} />)
    const activeLinks = screen.getAllByRole('link').filter(
      (l) => l.getAttribute('aria-current') === 'true',
    )
    expect(activeLinks.length).toBeGreaterThan(0)
    activeLinks.forEach((l) => expect(l).toHaveAttribute('href', '#top-talent'))
  })

  it('marks non-active items without aria-current', () => {
    render(<AwardsSideNav awards={awards} />)
    const mvpLinks = screen.getAllByRole('link').filter(
      (l) => l.getAttribute('href') === '#mvp',
    )
    expect(mvpLinks.length).toBeGreaterThan(0)
    mvpLinks.forEach((l) => expect(l).not.toHaveAttribute('aria-current', 'true'))
  })
})
