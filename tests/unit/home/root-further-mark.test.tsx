import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RootFurtherMark from '@/components/home/root-further-mark'

describe('RootFurtherMark', () => {
  it('renders with role=img and aria-label "ROOT FURTHER"', () => {
    render(<RootFurtherMark size="xl" />)
    expect(screen.getByRole('img', { name: 'ROOT FURTHER' })).toBeInTheDocument()
  })

  it('applies xl dimensions via width attribute', () => {
    const { container } = render(<RootFurtherMark size="xl" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('width', '1224')
  })

  it('applies md dimensions when size=md', () => {
    // The md variant CSS-crops the empty right whitespace via background-image,
    // so it renders a <div> with role=img + a 290px-wide container (not an <img>).
    render(<RootFurtherMark size="md" />)
    const el = screen.getByRole('img', { name: 'ROOT FURTHER' })
    expect(el).toHaveStyle({ width: '290px' })
  })
})
