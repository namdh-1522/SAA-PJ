import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MobileNavDrawer from '@/components/ui/mobile-nav-drawer'

vi.mock('next/navigation', () => ({
  usePathname: () => '/about-saa-2025',
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'vi',
}))

// MobileNavDrawer renders LanguageSelector internally — stub it so this suite
// stays focused on drawer behaviour and doesn't need a QueryClient or i18n provider.
vi.mock('@/components/ui/language-selector', () => ({
  default: () => <div data-testid="language-selector-stub" />,
}))

describe('MobileNavDrawer', () => {
  it('does not render content when closed', () => {
    render(<MobileNavDrawer isOpen={false} onClose={vi.fn()} isAdmin={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog with nav links when open', () => {
    render(<MobileNavDrawer isOpen={true} onClose={vi.fn()} isAdmin={false} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3)
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<MobileNavDrawer isOpen={true} onClose={onClose} isAdmin={false} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<MobileNavDrawer isOpen={true} onClose={onClose} isAdmin={false} />)
    fireEvent.click(screen.getByTestId('drawer-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })
})
