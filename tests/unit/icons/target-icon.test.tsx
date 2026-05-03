import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import TargetIcon from '@/components/icons/target-icon'

describe('TargetIcon', () => {
  it('renders an SVG with default 24x24 dimensions', () => {
    const { container } = render(<TargetIcon />)
    const svg = container.querySelector('svg')!
    expect(svg).toBeInTheDocument()
    expect(svg.getAttribute('width')).toBe('24')
    expect(svg.getAttribute('height')).toBe('24')
  })

  it('marks itself decorative via aria-hidden', () => {
    const { container } = render(<TargetIcon />)
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true')
  })

  it('uses currentColor so the consumer drives the color via Tailwind text-* classes', () => {
    const { container } = render(<TargetIcon />)
    const html = container.innerHTML
    expect(html).toMatch(/currentColor/)
  })

  it('forwards arbitrary SVG props', () => {
    const { container } = render(<TargetIcon className="text-yellow-300" data-testid="t" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('class')).toBe('text-yellow-300')
    expect(svg.getAttribute('data-testid')).toBe('t')
  })
})
