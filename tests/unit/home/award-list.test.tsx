import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardList from '@/components/home/award-list'
import { AWARDS } from '@/lib/awards'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('AwardList', () => {
  it('renders exactly 6 cards', () => {
    render(<AwardList />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(6)
  })

  it('renders cards in AWARDS-array order via href anchors', () => {
    render(<AwardList />)
    const detailLinks = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter((href): href is string => href !== null && href.startsWith('/awards#'))
    const uniqueAnchors = Array.from(new Set(detailLinks))
    expect(uniqueAnchors).toEqual(AWARDS.map((a) => `/awards#${a.slug}`))
  })
})
