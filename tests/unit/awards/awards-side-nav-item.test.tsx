import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardsSideNavItem from '@/components/awards/awards-side-nav-item'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

const baseProps = {
  slug: 'top-talent',
  labelKey: 'awards.menu.top-talent',
  onClick: vi.fn(),
}

describe('AwardsSideNavItem', () => {
  it('renders an anchor with the correct href', () => {
    render(<AwardsSideNavItem {...baseProps} active={false} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '#top-talent')
  })

  it('renders the label via i18n key', () => {
    render(<AwardsSideNavItem {...baseProps} active={false} />)
    expect(screen.getByText('awards.menu.top-talent')).toBeInTheDocument()
  })

  it('renders the target icon (svg)', () => {
    const { container } = render(<AwardsSideNavItem {...baseProps} active={false} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('sets aria-current="true" when active', () => {
    render(<AwardsSideNavItem {...baseProps} active={true} />)
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'true')
  })

  it('does not set aria-current when inactive', () => {
    render(<AwardsSideNavItem {...baseProps} active={false} />)
    const link = screen.getByRole('link')
    expect(link).not.toHaveAttribute('aria-current', 'true')
  })

  it('applies active styling classes when active', () => {
    render(<AwardsSideNavItem {...baseProps} active={true} />)
    const link = screen.getByRole('link')
    expect(link.className).toMatch(/border-b/)
  })
})
