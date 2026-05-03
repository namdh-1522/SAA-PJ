import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import PrelaunchCountdown from '@/components/prelaunch/prelaunch-countdown'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('PrelaunchCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('headline is rendered as an h1', () => {
    vi.setSystemTime(new Date('2026-06-01T00:00:00+07:00'))
    render(<PrelaunchCountdown targetISO="2026-06-07T18:30:00+07:00" />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('wrapper has aria-live="polite" and aria-atomic="true"', () => {
    render(<PrelaunchCountdown targetISO="2026-06-07T18:30:00+07:00" />)
    const live = document.querySelector('[aria-live="polite"]')
    expect(live).toBeInTheDocument()
    expect(live).toHaveAttribute('aria-atomic', 'true')
  })

  it('renders 3 countdown units with correct initial values', () => {
    vi.setSystemTime(new Date('2026-06-01T00:00:00+07:00'))
    render(<PrelaunchCountdown targetISO="2026-06-07T18:30:00+07:00" />)
    // 6 days, 18 hours, 30 minutes from 2026-06-01T00:00 to 2026-06-07T18:30 (+07)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles).toHaveLength(6)
    // days = 06
    expect(tiles[0]).toHaveTextContent('0')
    expect(tiles[1]).toHaveTextContent('6')
    // hours = 18
    expect(tiles[2]).toHaveTextContent('1')
    expect(tiles[3]).toHaveTextContent('8')
    // minutes = 30
    expect(tiles[4]).toHaveTextContent('3')
    expect(tiles[5]).toHaveTextContent('0')
  })

  it('updates values after a 60-second tick', () => {
    vi.setSystemTime(new Date('2026-06-07T18:30:02+07:00'))
    render(<PrelaunchCountdown targetISO="2026-06-07T18:32:02+07:00" />)
    // initially 0 days, 0 hours, 2 minutes
    const minuteTiles = screen.getAllByTestId('digit-char').slice(4)
    expect(minuteTiles[0]).toHaveTextContent('0')
    expect(minuteTiles[1]).toHaveTextContent('2')

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    const updatedTiles = screen.getAllByTestId('digit-char').slice(4)
    expect(updatedTiles[0]).toHaveTextContent('0')
    expect(updatedTiles[1]).toHaveTextContent('1')
  })

  it('all tiles show "-" when targetISO is undefined', () => {
    render(<PrelaunchCountdown targetISO={undefined} />)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles).toHaveLength(6)
    tiles.forEach((tile) => expect(tile).toHaveTextContent('-'))
  })

  it('contains no interactive elements (FR-005)', () => {
    render(<PrelaunchCountdown targetISO="2026-06-07T18:30:00+07:00" />)
    expect(document.querySelectorAll('a, button, form, input')).toHaveLength(0)
  })

  it('renders 00/00/00 when countdown reaches zero without any navigation (FR-013)', () => {
    vi.setSystemTime(new Date('2026-06-07T18:30:01+07:00'))
    const mockReplace = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { replace: mockReplace },
      writable: true,
    })

    render(<PrelaunchCountdown targetISO="2026-06-07T18:30:00+07:00" />)
    const tiles = screen.getAllByTestId('digit-char')
    tiles.forEach((tile) => expect(tile).toHaveTextContent('0'))
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
