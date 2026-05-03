import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NotificationButton from '@/components/ui/notification-button'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    if (values && 'count' in values) return `${values.count} unread notifications`
    return key
  },
}))

describe('NotificationButton', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('renders the bell button', () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ count: 0 }),
    } as Response)
    render(<NotificationButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('hides badge when unread count is 0', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ count: 0 }),
    } as Response)
    render(<NotificationButton />)
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())
    expect(screen.queryByLabelText(/unread notifications/)).not.toBeInTheDocument()
  })

  it('shows badge with aria-label when unread count > 0', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ count: 3 }),
    } as Response)
    render(<NotificationButton />)
    await waitFor(() => expect(screen.getByLabelText('3 unread notifications')).toBeInTheDocument())
  })

  it('hides badge silently when fetch fails', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('network'))
    render(<NotificationButton />)
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())
    expect(screen.queryByLabelText(/unread notifications/)).not.toBeInTheDocument()
  })
})
