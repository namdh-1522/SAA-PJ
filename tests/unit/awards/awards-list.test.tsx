import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardsList from '@/components/awards/awards-list'
import type { AwardCategory } from '@/types/home'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
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

const awards6 = [
  makeAward('top-talent'),
  makeAward('top-project'),
  makeAward('top-project-leader'),
  makeAward('best-manager'),
  makeAward('signature-2025-creator'),
  makeAward('mvp'),
]

describe('AwardsList', () => {
  it('renders exactly 6 sections for 6 awards', () => {
    render(<AwardsList awards={awards6} />)
    const sections = document.querySelectorAll('[data-award-slug]')
    expect(sections).toHaveLength(6)
  })

  it('renders first award with image-left (xl:flex-row)', () => {
    const { container } = render(<AwardsList awards={awards6} />)
    const firstRow = container.querySelector('[data-award-slug="top-talent"]')
    const innerRow = firstRow?.querySelector('[class*="xl:flex-row"]')
    expect(innerRow?.className).not.toMatch(/xl:flex-row-reverse/)
  })

  it('renders second award with image-right (xl:flex-row-reverse)', () => {
    const { container } = render(<AwardsList awards={awards6} />)
    const secondRow = container.querySelector('[data-award-slug="top-project"]')
    const innerRow = secondRow?.querySelector('[class*="xl:flex-row-reverse"]')
    expect(innerRow).toBeInTheDocument()
  })

  it('alternates direction correctly for all 6 rows', () => {
    const { container } = render(<AwardsList awards={awards6} />)
    const rows = container.querySelectorAll('[data-award-slug]')
    rows.forEach((row, idx) => {
      if (idx % 2 === 0) {
        const innerRow = row.querySelector('[class*="xl:flex-row"]')
        expect(innerRow?.className).not.toMatch(/xl:flex-row-reverse/)
      } else {
        const innerRow = row.querySelector('[class*="xl:flex-row-reverse"]')
        expect(innerRow).toBeInTheDocument()
      }
    })
  })

  it('renders empty state message when awards array is empty', () => {
    render(<AwardsList awards={[]} />)
    expect(screen.getByText('awards.empty')).toBeInTheDocument()
  })
})
