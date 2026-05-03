import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import KudosPromo from '@/components/home/kudos-promo'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => {
    const t = (key: string) => (ns ? `${ns}.${key}` : key)
    t.rich = (_key: string, _tags: Record<string, unknown>) => 'ĐIỂM MỚI mocked body'
    return t
  },
}))

describe('KudosPromo', () => {
  it('renders kicker, title, CTA, and logomark', () => {
    render(<KudosPromo />)
    expect(screen.getByText('home.kudos.kicker')).toBeInTheDocument()
    expect(screen.getByText('home.kudos.title')).toBeInTheDocument()
    expect(screen.getByText('home.cta.detail')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /sun\* kudos logo/i })).toBeInTheDocument()
  })
})
