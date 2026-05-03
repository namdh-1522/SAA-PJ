import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Countdown from '@/components/home/countdown'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-12-20T00:00:00+07:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders three tiles with zero-padded values from target ISO', () => {
    render(<Countdown targetISO="2025-12-26T18:30:00+07:00" />)
    const values = screen.getAllByTestId('countdown-value')
    expect(values).toHaveLength(3)
    expect(values[0]).toHaveTextContent('06')
    expect(values[1]).toHaveTextContent('18')
    expect(values[2]).toHaveTextContent('30')
  })

  it('shows "Coming soon" subtitle when event is in the future', () => {
    render(<Countdown targetISO="2025-12-26T18:30:00+07:00" />)
    expect(screen.getByText('home.countdown.subtitle')).toBeInTheDocument()
  })

  it('hides "Coming soon" and shows 00 when event has started', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00+07:00'))
    render(<Countdown targetISO="2025-12-26T18:30:00+07:00" />)
    expect(screen.queryByText('home.countdown.subtitle')).not.toBeInTheDocument()
    const values = screen.getAllByTestId('countdown-value')
    expect(values[0]).toHaveTextContent('00')
    expect(values[1]).toHaveTextContent('00')
    expect(values[2]).toHaveTextContent('00')
  })

  it('shows -- and hides subtitle when targetISO is undefined', () => {
    render(<Countdown targetISO={undefined} />)
    const values = screen.getAllByTestId('countdown-value')
    expect(values[0]).toHaveTextContent('--')
    expect(screen.queryByText('home.countdown.subtitle')).not.toBeInTheDocument()
  })

  it('updates values after a 60-second tick', () => {
    render(<Countdown targetISO="2025-12-20T00:02:00+07:00" />)
    expect(screen.getAllByTestId('countdown-value')[2]).toHaveTextContent('02')
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getAllByTestId('countdown-value')[2]).toHaveTextContent('01')
  })
})
