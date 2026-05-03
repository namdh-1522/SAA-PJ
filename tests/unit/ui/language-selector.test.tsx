import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LanguageSelector from '@/components/ui/language-selector'
import { renderWithIntl } from '@/tests/utils/render-with-intl'

const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderSelector(locale: 'vi' | 'en' = 'vi') {
  const queryClient = makeQueryClient()
  return renderWithIntl(
    <QueryClientProvider client={queryClient}>
      <LanguageSelector />
    </QueryClientProvider>,
    { locale },
  )
}

const originalFetch = globalThis.fetch
const originalCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')

beforeEach(() => {
  mockRefresh.mockReset()
  globalThis.fetch = vi.fn().mockResolvedValue(
    new Response(null, { status: 204 }) as Response,
  )
  // Reset cookie storage between tests.
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get: () => '',
    set: () => undefined,
  })
})

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalCookie) Object.defineProperty(Document.prototype, 'cookie', originalCookie)
})

// =====================================================================
// US1 — Authenticated user switches locale
// =====================================================================
describe('LanguageSelector — US1 switch locale', () => {
  it('renders trigger button with current-locale flag and label', () => {
    renderSelector('vi')
    const trigger = screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveTextContent('VN')
  })

  it('opens panel on trigger click and lists VN then EN in fixed order', () => {
    renderSelector('vi')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    const panel = screen.getByRole('menu')
    expect(panel).toBeInTheDocument()
    const items = screen.getAllByRole('menuitemradio')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('VN')
    expect(items[1]).toHaveTextContent('EN')
  })

  it('marks the row matching the active locale as aria-checked (vi → VN)', () => {
    renderSelector('vi')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    const items = screen.getAllByRole('menuitemradio')
    expect(items[0]).toHaveAttribute('aria-checked', 'true')
    expect(items[1]).toHaveAttribute('aria-checked', 'false')
  })

  it('marks the row matching the active locale as aria-checked (en → EN)', () => {
    renderSelector('en')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    const items = screen.getAllByRole('menuitemradio')
    expect(items[0]).toHaveAttribute('aria-checked', 'false')
    expect(items[1]).toHaveAttribute('aria-checked', 'true')
  })

  it('clicking the non-active row writes the cookie, refreshes router, and closes the panel', async () => {
    let cookieWritten = ''
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => cookieWritten,
      set: (value: string) => {
        cookieWritten = value
      },
    })

    renderSelector('vi')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    fireEvent.click(screen.getAllByRole('menuitemradio')[1]) // EN row

    expect(cookieWritten).toMatch(/NEXT_LOCALE=en/)
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled())
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicking the active row is a silent no-op (no cookie write, no refresh, no fetch)', async () => {
    let cookieWritten = ''
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => cookieWritten,
      set: (value: string) => {
        cookieWritten = value
      },
    })

    renderSelector('vi')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    fireEvent.click(screen.getAllByRole('menuitemradio')[0]) // VN row (already active)

    expect(cookieWritten).toBe('')
    expect(mockRefresh).not.toHaveBeenCalled()
    expect(globalThis.fetch).not.toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument() // closes anyway
  })

  it('US4 — fires PUT /api/users/me on selection (fire-and-forget)', async () => {
    renderSelector('vi')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    fireEvent.click(screen.getAllByRole('menuitemradio')[1]) // EN row

    await waitFor(() =>
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/users/me',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ locale: 'en' }),
        }),
      ),
    )
  })

  it('US4 — PUT failure does NOT block the locale switch (no thrown error, panel still closes)', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 500 }) as Response)

    renderSelector('vi')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    fireEvent.click(screen.getAllByRole('menuitemradio')[1])

    await waitFor(() => expect(mockRefresh).toHaveBeenCalled())
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

// =====================================================================
// US2 — Dismiss without changing locale
// =====================================================================
describe('LanguageSelector — US2 dismissal', () => {
  it('outside click closes the panel without changing locale', () => {
    renderSelector('vi')
    fireEvent.click(screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  it('Escape closes the panel and returns focus to the trigger', async () => {
    renderSelector('vi')
    const trigger = screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i })
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  it('trigger re-click toggles the panel closed without changing locale', () => {
    renderSelector('vi')
    const trigger = screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i })
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(mockRefresh).not.toHaveBeenCalled()
  })
})

// =====================================================================
// US3 — Keyboard navigation + ARIA
// =====================================================================
describe('LanguageSelector — US3 keyboard + ARIA', () => {
  it('trigger exposes aria-haspopup, aria-expanded, aria-controls', () => {
    renderSelector('vi')
    const trigger = screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    const ctrlsAttr = trigger.getAttribute('aria-controls')
    expect(ctrlsAttr).toBeTruthy()

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panel = screen.getByRole('menu')
    expect(panel).toHaveAttribute('id', ctrlsAttr!)
  })

  it('opens with focus on the active locale row (vi → VN row focused)', async () => {
    renderSelector('vi')
    const trigger = screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i })
    await userEvent.tab()
    expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    const items = screen.getAllByRole('menuitemradio')
    expect(items[0]).toHaveFocus()
  })

  it('opens with focus on the active locale row (en → EN row focused)', async () => {
    renderSelector('en')
    const trigger = screen.getByRole('button', { name: /chọn ngôn ngữ|select language/i })
    await userEvent.tab()
    expect(trigger).toHaveFocus()
    await userEvent.keyboard(' ') // Space
    const items = screen.getAllByRole('menuitemradio')
    expect(items[1]).toHaveFocus()
  })

  it('arrow keys wrap focus between the two rows', async () => {
    renderSelector('vi')
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    const items = screen.getAllByRole('menuitemradio')
    expect(items[0]).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(items[1]).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(items[0]).toHaveFocus() // wraps
    await userEvent.keyboard('{ArrowUp}')
    expect(items[1]).toHaveFocus() // wraps backward
  })

  it('Enter on focused row selects and closes', async () => {
    renderSelector('vi')
    await userEvent.tab()
    await userEvent.keyboard('{Enter}') // open
    await userEvent.keyboard('{ArrowDown}') // focus EN
    await userEvent.keyboard('{Enter}') // select

    await waitFor(() => expect(mockRefresh).toHaveBeenCalled())
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
