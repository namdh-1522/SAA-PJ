import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import DiamondIcon from '@/components/icons/diamond-icon'

describe('DiamondIcon', () => {
  it('renders an SVG with default 24x24 dimensions', () => {
    const { container } = render(<DiamondIcon />)
    const svg = container.querySelector('svg')!
    expect(svg).toBeInTheDocument()
    expect(svg.getAttribute('width')).toBe('24')
    expect(svg.getAttribute('height')).toBe('24')
  })

  it('marks itself decorative via aria-hidden', () => {
    const { container } = render(<DiamondIcon />)
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true')
  })

  it('uses currentColor for stroke/fill', () => {
    const { container } = render(<DiamondIcon />)
    expect(container.innerHTML).toMatch(/currentColor/)
  })
})
