import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeaderControls from '@/components/ui/header-controls'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/components/ui/language-selector', () => ({
  default: () => <div data-testid="language-selector" />,
}))

vi.mock('@/components/ui/notification-button', () => ({
  default: () => <div data-testid="notification-button" />,
}))

vi.mock('@/components/ui/avatar-menu', () => ({
  default: ({ isAdmin }: { isAdmin: boolean }) => (
    <div data-testid="avatar-menu" data-admin={String(isAdmin)} />
  ),
}))

describe('HeaderControls', () => {
  it('renders language selector, notification button, and avatar menu', () => {
    render(<HeaderControls isAdmin={false} />)
    expect(screen.getByTestId('language-selector')).toBeInTheDocument()
    expect(screen.getByTestId('notification-button')).toBeInTheDocument()
    expect(screen.getByTestId('avatar-menu')).toBeInTheDocument()
  })

  it('propagates isAdmin prop to AvatarMenu', () => {
    render(<HeaderControls isAdmin={true} />)
    expect(screen.getByTestId('avatar-menu')).toHaveAttribute('data-admin', 'true')
  })
})
