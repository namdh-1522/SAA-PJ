import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardQuantity from '@/components/awards/award-quantity'
import { renderWithIntl } from '@/tests/utils/render-with-intl'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('AwardQuantity', () => {
  it('renders the quantity number', () => {
    render(<AwardQuantity quantity={10} quantityUnit="unit" />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders the unit as an i18n key', () => {
    render(<AwardQuantity quantity={2} quantityUnit="team" />)
    expect(screen.getByText('awards.unit.team')).toBeInTheDocument()
  })

  it('renders the diamond icon (svg)', () => {
    const { container } = render(<AwardQuantity quantity={1} quantityUnit="individual" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders the quantity label', () => {
    render(<AwardQuantity quantity={5} quantityUnit="unit" />)
    expect(screen.getByText('awards.label.quantity')).toBeInTheDocument()
  })
})
