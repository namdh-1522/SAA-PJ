import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '@/components/ui/header'

describe('Header backward-compatibility', () => {
  it('renders children in the right slot (Login call-site pattern)', () => {
    render(
      <Header>
        <button type="button" data-testid="login-lang">VN</button>
      </Header>
    )
    expect(screen.getByTestId('login-lang')).toBeInTheDocument()
  })

  it('still renders the default logo link to "/"', () => {
    render(
      <Header>
        <span data-testid="right">R</span>
      </Header>
    )
    const link = screen.getByRole('link', { name: /go to homepage|saa 2025|home/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('prefers rightSlot over children when both are passed', () => {
    render(
      <Header rightSlot={<span data-testid="right-slot">R</span>}>
        <span data-testid="children-slot">C</span>
      </Header>
    )
    expect(screen.getByTestId('right-slot')).toBeInTheDocument()
    expect(screen.queryByTestId('children-slot')).not.toBeInTheDocument()
  })

  it('accepts navSlot between leftSlot and rightSlot', () => {
    render(
      <Header
        navSlot={<nav data-testid="nav-slot">Nav</nav>}
        rightSlot={<span data-testid="r">R</span>}
      />
    )
    expect(screen.getByTestId('nav-slot')).toBeInTheDocument()
  })

  it('accepts a custom leftSlot overriding the default logo', () => {
    render(
      <Header
        leftSlot={<span data-testid="custom-left">custom</span>}
        rightSlot={<span data-testid="r">R</span>}
      />
    )
    expect(screen.getByTestId('custom-left')).toBeInTheDocument()
  })
})
