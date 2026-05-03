import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardsPageTitle from '@/components/awards/awards-page-title'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('AwardsPageTitle', () => {
  it('renders the eyebrow text from awards.subtitle', () => {
    render(<AwardsPageTitle />)
    expect(screen.getByText('awards.subtitle')).toBeInTheDocument()
  })

  it('renders the main heading from awards.title', () => {
    render(<AwardsPageTitle />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('awards.title')).toBeInTheDocument()
  })

  it('renders a divider between eyebrow and heading', () => {
    const { container } = render(<AwardsPageTitle />)
    const divider = container.querySelector('[role="separator"], hr, [class*="h-px"]')
    expect(divider).toBeInTheDocument()
  })

  it('applies yellow accent color to the main heading', () => {
    render(<AwardsPageTitle />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.className).toMatch(/color-accent/)
  })
})
