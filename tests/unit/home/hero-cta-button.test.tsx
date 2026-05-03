import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeroCtaButton from '@/components/home/hero-cta-button'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('HeroCtaButton', () => {
  it('renders a link to the given href with the label text', () => {
    render(<HeroCtaButton href="/awards-information" labelKey="home.cta.about_awards" />)
    const link = screen.getByRole('link', { name: /home\.cta\.about_awards/ })
    expect(link).toHaveAttribute('href', '/awards-information')
  })

  it('applies outlined default classes', () => {
    render(<HeroCtaButton href="/awards-information" labelKey="home.cta.about_awards" />)
    const link = screen.getByRole('link')
    expect(link.className).toContain('bg-[var(--color-cta-outline-bg)]')
    expect(link.className).toContain('border')
  })

  it('applies hover classes that flip to filled yellow', () => {
    render(<HeroCtaButton href="/awards-information" labelKey="home.cta.about_awards" />)
    expect(screen.getByRole('link').className).toContain('hover:bg-[var(--color-cta-bg)]')
  })

  it('renders an icon sibling to the label', () => {
    render(<HeroCtaButton href="/awards-information" labelKey="home.cta.about_awards" />)
    expect(screen.getByRole('link').querySelector('svg')).toBeInTheDocument()
  })
})
