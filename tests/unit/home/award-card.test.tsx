import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardCard from '@/components/home/award-card'
import type { AwardSpec } from '@/types/home'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

const award: AwardSpec = {
  id: 'top-talent',
  titleKey: 'home.awards.top-talent.title',
  descriptionKey: 'home.awards.top-talent.description',
  image: '/assets/home/awards/top-talent.png',
  slug: 'top-talent',
}

describe('AwardCard', () => {
  it('renders the image with correct alt text from the title key', () => {
    render(<AwardCard award={award} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'home.awards.top-talent.title')
  })

  it('links to /awards#<slug>', () => {
    render(<AwardCard award={award} />)
    const links = screen.getAllByRole('link')
    links.forEach((l) => expect(l).toHaveAttribute('href', '/awards#top-talent'))
  })

  it('renders the title and description from i18n keys', () => {
    render(<AwardCard award={award} />)
    expect(screen.getByText('home.awards.top-talent.title')).toBeInTheDocument()
    expect(screen.getByText('home.awards.top-talent.description')).toBeInTheDocument()
  })

  it('includes a "Chi tiết" link', () => {
    render(<AwardCard award={award} />)
    expect(screen.getByText('home.cta.detail')).toBeInTheDocument()
  })
})
