import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HamburgerButton from '@/components/ui/hamburger-button'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

describe('HamburgerButton', () => {
  it('renders a button with aria-controls and aria-expanded=false by default', () => {
    render(<HamburgerButton isOpen={false} onToggle={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-controls', 'mobile-nav-drawer')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('reflects aria-expanded=true when isOpen', () => {
    render(<HamburgerButton isOpen={true} onToggle={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<HamburgerButton isOpen={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalled()
  })
})
