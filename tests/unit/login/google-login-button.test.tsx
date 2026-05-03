import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSignInWithOAuth = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: { signInWithOAuth: mockSignInWithOAuth },
  })),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const keys: Record<string, string> = {
      cta: 'LOGIN With Google',
      'error.oauth_failed': 'Login failed.',
      'error.cookies_required': 'Please enable cookies.',
    }
    return keys[key] ?? key
  },
}))

vi.mock('@/components/icons/google-icon', () => ({
  default: () => <span data-testid="google-icon" />,
}))

import GoogleLoginButton from '@/components/login/google-login-button'

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'cookieEnabled', {
      value: true,
      writable: true,
      configurable: true,
    })
  })

  it('renders the CTA button with correct text', () => {
    render(<GoogleLoginButton />)
    expect(screen.getByRole('button', { name: /login with google/i })).toBeTruthy()
  })

  it('has aria-label="Login with Google"', () => {
    render(<GoogleLoginButton />)
    expect(screen.getByLabelText(/login with google/i)).toBeTruthy()
  })

  it('calls signInWithOAuth with google provider on click', async () => {
    render(<GoogleLoginButton />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() =>
      expect(mockSignInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'google' })
      )
    )
  })

  it('sets isLoading state on click (button becomes disabled)', async () => {
    render(<GoogleLoginButton />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    await waitFor(() => expect(btn).toHaveAttribute('disabled'))
  })

  it('does NOT call signInWithOAuth when cookies are disabled', async () => {
    Object.defineProperty(navigator, 'cookieEnabled', { value: false })
    render(<GoogleLoginButton />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(mockSignInWithOAuth).not.toHaveBeenCalled())
  })

  it('shows cookies_required error when cookies are disabled', async () => {
    Object.defineProperty(navigator, 'cookieEnabled', { value: false })
    render(<GoogleLoginButton />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() =>
      expect(screen.getByText('Please enable cookies.')).toBeTruthy()
    )
  })
})
