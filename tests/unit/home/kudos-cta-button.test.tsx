import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import KudosCtaButton from '@/components/home/kudos-cta-button'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('KudosCtaButton', () => {
  it('renders a filled-yellow link to /kudos', () => {
    render(<KudosCtaButton />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/kudos')
    expect(link.className).toContain('bg-[var(--color-cta-bg)]')
  })

  it('renders the "Chi tiết" label', () => {
    render(<KudosCtaButton />)
    expect(screen.getByText('home.cta.detail')).toBeInTheDocument()
  })

  it('renders an icon sibling', () => {
    render(<KudosCtaButton />)
    expect(screen.getByRole('link').querySelector('svg')).toBeInTheDocument()
  })
})
