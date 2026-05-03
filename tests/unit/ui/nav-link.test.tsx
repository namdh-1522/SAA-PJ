import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NavLink from '@/components/ui/nav-link'

const mockPathname = vi.fn<() => string>()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('NavLink', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/')
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
  })

  it('renders with active styling when pathname matches exactly', () => {
    mockPathname.mockReturnValue('/about-saa-2025')
    render(<NavLink href="/about-saa-2025" labelKey="common.nav.about" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('data-active', 'true')
  })

  it('renders without active styling when pathname does not match', () => {
    mockPathname.mockReturnValue('/other')
    render(<NavLink href="/about-saa-2025" labelKey="common.nav.about" />)
    expect(screen.getByRole('link')).toHaveAttribute('data-active', 'false')
  })

  it('uses startsWith match mode correctly', () => {
    mockPathname.mockReturnValue('/awards/top-talent')
    render(<NavLink href="/awards" labelKey="common.nav.awards" matchMode="startsWith" />)
    expect(screen.getByRole('link')).toHaveAttribute('data-active', 'true')
  })

  it('calls scrollTo and prevents default when self-link is clicked', () => {
    mockPathname.mockReturnValue('/about-saa-2025')
    render(<NavLink href="/about-saa-2025" labelKey="common.nav.about" />)
    const link = screen.getByRole('link')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(event)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(event.defaultPrevented).toBe(true)
  })

  it('does NOT prevent default when an inactive link is clicked', () => {
    mockPathname.mockReturnValue('/other')
    render(<NavLink href="/about-saa-2025" labelKey="common.nav.about" />)
    const link = screen.getByRole('link')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })
})
