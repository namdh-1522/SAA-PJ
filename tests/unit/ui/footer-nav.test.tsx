import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FooterNav from '@/components/ui/footer-nav'

vi.mock('next/navigation', () => ({
  usePathname: () => '/about-saa-2025',
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('FooterNav', () => {
  it('renders four nav links', () => {
    render(<FooterNav />)
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('includes all four expected destinations', () => {
    render(<FooterNav />)
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual([
      '/about-saa-2025',
      '/awards',
      '/kudos',
      '/common-standards',
    ])
  })
})
