import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(() => ({ replace: mockReplace })),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const keys: Record<string, string> = {
      'error.oauth_failed': 'Login failed. Please try again.',
    }
    return keys[key] ?? key
  },
}))

import { useSearchParams } from 'next/navigation'
import AuthErrorBanner from '@/components/login/auth-error-banner'

describe('AuthErrorBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders banner when ?auth_error=true is in URL', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('auth_error=true') as never
    )
    render(<AuthErrorBanner />)
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('Login failed. Please try again.')).toBeTruthy()
  })

  it('does not render when auth_error param is absent', () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as never)
    render(<AuthErrorBanner />)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('calls router.replace("/") on dismiss', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('auth_error=true') as never
    )
    render(<AuthErrorBanner />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(mockReplace).toHaveBeenCalledWith('/')
  })
})
