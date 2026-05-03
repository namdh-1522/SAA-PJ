import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardRow from '@/components/awards/award-row'
import type { AwardCategory } from '@/types/home'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

const award: AwardCategory = {
  id: 'top-talent',
  titleKey: 'home.awards.top-talent.title',
  descriptionKey: 'home.awards.top-talent.description',
  descriptionLongKey: 'awards.top-talent.descriptionLong',
  image: '/assets/home/awards/top-talent.png',
  nameOverlayImage: '/assets/awards/overlays/top-talent.png',
  slug: 'top-talent',
  quantity: 10,
  quantityUnit: 'unit',
  values: [{ amountVnd: 7_000_000, captionKey: 'awards.label.perAward' }],
}

describe('AwardRow', () => {
  it('renders the section with id and data-award-slug matching the slug', () => {
    render(<AwardRow award={award} direction="image-left" />)
    const section = document.getElementById('top-talent')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('data-award-slug', 'top-talent')
  })

  it('renders section with aria-labelledby pointing to the heading id', () => {
    render(<AwardRow award={award} direction="image-left" />)
    const section = document.getElementById('top-talent')
    expect(section).toHaveAttribute('aria-labelledby', 'top-talent-title')
  })

  it('direction image-left adds xl:flex-row class to the inner row', () => {
    const { container } = render(<AwardRow award={award} direction="image-left" />)
    const innerRow = container.querySelector('[class*="xl:flex-row"]')
    expect(innerRow).toBeInTheDocument()
    expect(innerRow?.className).not.toMatch(/xl:flex-row-reverse/)
  })

  it('direction image-right adds xl:flex-row-reverse class to the inner row', () => {
    const { container } = render(<AwardRow award={award} direction="image-right" />)
    const innerRow = container.querySelector('[class*="xl:flex-row-reverse"]')
    expect(innerRow).toBeInTheDocument()
  })
})
