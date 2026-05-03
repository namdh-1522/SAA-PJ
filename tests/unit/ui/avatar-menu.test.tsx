import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AvatarMenu from '@/components/ui/avatar-menu'

const mockPush = vi.fn()
const mockSignOut = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signOut: mockSignOut } }),
}))

describe('AvatarMenu', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockSignOut.mockReset()
    mockSignOut.mockResolvedValue({ error: null })
  })

  it('menu is hidden by default', () => {
    render(<AvatarMenu isAdmin={false} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens menu on button click', () => {
    render(<AvatarMenu isAdmin={false} />)
    fireEvent.click(screen.getByRole('button', { name: /open menu|account|avatar/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('hides Admin Dashboard when isAdmin is false', () => {
    render(<AvatarMenu isAdmin={false} />)
    fireEvent.click(screen.getByRole('button', { name: /open menu|account|avatar/i }))
    expect(screen.queryByText('home.menu.admin')).not.toBeInTheDocument()
  })

  it('shows Admin Dashboard when isAdmin is true', () => {
    render(<AvatarMenu isAdmin={true} />)
    fireEvent.click(screen.getByRole('button', { name: /open menu|account|avatar/i }))
    expect(screen.getByText('home.menu.admin')).toBeInTheDocument()
  })

  it('calls signOut and navigates to "/" when Sign out is clicked', async () => {
    render(<AvatarMenu isAdmin={false} />)
    fireEvent.click(screen.getByRole('button', { name: /open menu|account|avatar/i }))
    fireEvent.click(screen.getByText('home.menu.sign_out'))
    await waitFor(() => expect(mockSignOut).toHaveBeenCalled())
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'))
  })

  it('closes menu when Escape is pressed', () => {
    render(<AvatarMenu isAdmin={false} />)
    fireEvent.click(screen.getByRole('button', { name: /open menu|account|avatar/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
