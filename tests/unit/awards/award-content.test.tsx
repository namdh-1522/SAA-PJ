import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardContent from '@/components/awards/award-content'
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

describe('AwardContent', () => {
  it('renders the title with the correct id for aria-labelledby', () => {
    render(<AwardContent award={award} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveAttribute('id', 'top-talent-title')
  })

  it('renders the long description', () => {
    render(<AwardContent award={award} />)
    expect(screen.getByText('awards.top-talent.descriptionLong')).toBeInTheDocument()
  })

  it('renders the quantity block', () => {
    render(<AwardContent award={award} />)
    expect(screen.getByText('awards.label.quantity')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders the value block', () => {
    render(<AwardContent award={award} />)
    expect(screen.getByText('awards.label.value')).toBeInTheDocument()
  })

  it('wraps content in an article with backdrop-blur class', () => {
    const { container } = render(<AwardContent award={award} />)
    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
    expect(article?.className).toMatch(/backdrop-blur/)
  })
})
