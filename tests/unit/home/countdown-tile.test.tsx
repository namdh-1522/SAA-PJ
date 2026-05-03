import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CountdownTile from '@/components/home/countdown-tile'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('CountdownTile', () => {
  it('zero-pads single-digit values', () => {
    render(<CountdownTile value={5} labelKey="home.countdown.days" />)
    expect(screen.getByTestId('countdown-value')).toHaveTextContent('05')
  })

  it('displays two-digit values as-is', () => {
    render(<CountdownTile value={42} labelKey="home.countdown.hours" />)
    expect(screen.getByTestId('countdown-value')).toHaveTextContent('42')
  })

  it('displays -- fallback when value is "--"', () => {
    render(<CountdownTile value="--" labelKey="home.countdown.minutes" />)
    expect(screen.getByTestId('countdown-value')).toHaveTextContent('--')
  })

  it('displays 00 for zero value', () => {
    render(<CountdownTile value={0} labelKey="home.countdown.days" />)
    expect(screen.getByTestId('countdown-value')).toHaveTextContent('00')
  })
})
