import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CountdownUnit from '@/components/prelaunch/countdown-unit'

describe('CountdownUnit', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('value={6} renders digit tiles "0" and "6"', () => {
    render(<CountdownUnit value={6} label="DAYS" />)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles).toHaveLength(2)
    expect(tiles[0]).toHaveTextContent('0')
    expect(tiles[1]).toHaveTextContent('6')
  })

  it('value="--" renders two "-" tiles', () => {
    render(<CountdownUnit value="--" label="HOURS" />)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles).toHaveLength(2)
    expect(tiles[0]).toHaveTextContent('-')
    expect(tiles[1]).toHaveTextContent('-')
  })

  it('value={9} renders digit tiles "0" and "9"', () => {
    render(<CountdownUnit value={9} label="MINUTES" />)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles[0]).toHaveTextContent('0')
    expect(tiles[1]).toHaveTextContent('9')
  })

  it('value={0} renders two "0" tiles', () => {
    render(<CountdownUnit value={0} label="DAYS" />)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles[0]).toHaveTextContent('0')
    expect(tiles[1]).toHaveTextContent('0')
  })

  it('value={99} renders "9" and "9" tiles without warning', () => {
    render(<CountdownUnit value={99} label="DAYS" />)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles[0]).toHaveTextContent('9')
    expect(tiles[1]).toHaveTextContent('9')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('value={100} clamps to "9" and "9" and emits console.warn', () => {
    render(<CountdownUnit value={100} label="DAYS" />)
    const tiles = screen.getAllByTestId('digit-char')
    expect(tiles[0]).toHaveTextContent('9')
    expect(tiles[1]).toHaveTextContent('9')
    expect(console.warn).toHaveBeenCalled()
  })

  it('renders the label text in a span', () => {
    render(<CountdownUnit value={5} label="MINUTES" />)
    expect(screen.getByText('MINUTES')).toBeInTheDocument()
    expect(screen.getByText('MINUTES').tagName.toLowerCase()).toBe('span')
  })
})
