import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeaderNav from '@/components/ui/header-nav'

vi.mock('next/navigation', () => ({
  usePathname: () => '/about-saa-2025',
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('HeaderNav', () => {
  it('renders exactly three nav links', () => {
    render(<HeaderNav />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
  })

  it('links point to the correct routes', () => {
    render(<HeaderNav />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/about-saa-2025')
    expect(links[1]).toHaveAttribute('href', '/awards')
    expect(links[2]).toHaveAttribute('href', '/kudos')
  })

  it('marks "/about-saa-2025" as active when pathname matches', () => {
    render(<HeaderNav />)
    const [about, awards, kudos] = screen.getAllByRole('link')
    expect(about).toHaveAttribute('data-active', 'true')
    expect(awards).toHaveAttribute('data-active', 'false')
    expect(kudos).toHaveAttribute('data-active', 'false')
  })
})
