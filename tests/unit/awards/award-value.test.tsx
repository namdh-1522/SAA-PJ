import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardValue from '@/components/awards/award-value'
import type { AwardValue as AwardValueType } from '@/types/home'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

const singleValue: readonly AwardValueType[] = [
  { amountVnd: 7_000_000, captionKey: 'awards.label.perAward' },
]

const dualValues: readonly AwardValueType[] = [
  { amountVnd: 5_000_000, recipientType: 'individual' },
  { amountVnd: 8_000_000, recipientType: 'team' },
]

describe('AwardValue', () => {
  it('renders the value label', () => {
    render(<AwardValue values={singleValue} />)
    expect(screen.getByText('awards.label.value')).toBeInTheDocument()
  })

  it('renders the license icon (svg)', () => {
    const { container } = render(<AwardValue values={singleValue} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a single value amount containing the number', () => {
    render(<AwardValue values={singleValue} />)
    const text = screen.getByText(/7/)
    expect(text).toBeInTheDocument()
  })

  it('renders the caption key for a single value with captionKey', () => {
    render(<AwardValue values={singleValue} />)
    expect(screen.getByText('awards.label.perAward')).toBeInTheDocument()
  })

  it('renders two value amounts for dual-value awards', () => {
    render(<AwardValue values={dualValues} />)
    expect(screen.getByText(/5/)).toBeInTheDocument()
    expect(screen.getByText(/8/)).toBeInTheDocument()
  })

  it('renders recipient type captions for dual-value awards', () => {
    render(<AwardValue values={dualValues} />)
    expect(screen.getByText('awards.value.recipient.individual')).toBeInTheDocument()
    expect(screen.getByText('awards.value.recipient.team')).toBeInTheDocument()
  })
})
