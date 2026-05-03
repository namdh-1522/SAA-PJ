import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DigitTile from '@/components/prelaunch/digit-tile'

describe('DigitTile', () => {
  it('renders the given character', () => {
    render(<DigitTile char="5" />)
    expect(screen.getByTestId('digit-char')).toHaveTextContent('5')
  })

  it('falls back to "-" when char is undefined', () => {
    render(<DigitTile />)
    expect(screen.getByTestId('digit-char')).toHaveTextContent('-')
  })

  it('falls back to "-" when char is explicitly passed as undefined', () => {
    render(<DigitTile char={undefined} />)
    expect(screen.getByTestId('digit-char')).toHaveTextContent('-')
  })

  it('renders aria-hidden="true" on the wrapper element', () => {
    render(<DigitTile char="3" />)
    expect(screen.getByTestId('digit-tile')).toHaveAttribute('aria-hidden', 'true')
  })

  it('outer wrapper has rounded class using prelaunch radius token', () => {
    render(<DigitTile char="0" />)
    expect(screen.getByTestId('digit-tile').className).toMatch(
      /rounded-\[var\(--radius-tile-prelaunch\)\]/
    )
  })

  it('inner glass rectangle has opacity-50', () => {
    const { container } = render(<DigitTile char="0" />)
    const inner = container.querySelector('[data-testid="digit-tile-glass"]')
    expect(inner?.className).toMatch(/opacity-50/)
  })

  it('inner glass rectangle has backdrop-blur', () => {
    const { container } = render(<DigitTile char="0" />)
    const inner = container.querySelector('[data-testid="digit-tile-glass"]')
    expect(inner?.className).toMatch(/backdrop-blur/)
  })

  it('digit span is flex-centered', () => {
    render(<DigitTile char="7" />)
    const span = screen.getByTestId('digit-char')
    expect(span.className).toMatch(/flex/)
    expect(span.className).toMatch(/items-center/)
    expect(span.className).toMatch(/justify-center/)
  })
})
