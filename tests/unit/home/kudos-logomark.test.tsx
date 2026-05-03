import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KudosLogomark from '@/components/home/kudos-logomark'

describe('KudosLogomark', () => {
  it('renders with role=img and the Sun* Kudos aria-label', () => {
    render(<KudosLogomark />)
    expect(screen.getByRole('img', { name: /sun\* kudos logo/i })).toBeInTheDocument()
  })
})
