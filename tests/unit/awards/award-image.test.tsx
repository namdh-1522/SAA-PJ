import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AwardImage from '@/components/awards/award-image'
import type { AwardCategory } from '@/types/home'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

const award: AwardCategory = {
  id: 'top-talent',
  titleKey: 'home.awards.top-talent.title',
  descriptionKey: 'home.awards.top-talent.description',
  descriptionLongKey: 'awards.top-talent.descriptionLong',
  image: '/assets/home/awards/top-talent.png',
  nameOverlayImage: '/assets/awards/overlays/top-talent.png',
  slug: 'top-talent',
  quantity: 10,
  quantityUnit: 'unit',
  values: [{ amountVnd: 7_000_000, captionKey: 'awards.label.perAward' }],
}

describe('AwardImage', () => {
  it('renders background image with empty alt and aria-hidden', () => {
    const { container } = render(<AwardImage award={award} />)
    const allImgs = Array.from(container.querySelectorAll('img'))
    const bgImage = allImgs.find((img) => img.getAttribute('alt') === '')
    expect(bgImage).toBeInTheDocument()
    expect(bgImage).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders overlay image with alt equal to the award title key', () => {
    render(<AwardImage award={award} />)
    const overlayImg = screen.getByAltText('home.awards.top-talent.title')
    expect(overlayImg).toBeInTheDocument()
  })

  it('applies glow shadow class to the wrapper', () => {
    const { container } = render(<AwardImage award={award} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.className).toMatch(/shadow/)
  })

  it('applies mix-blend-screen to the wrapper', () => {
    const { container } = render(<AwardImage award={award} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.className).toMatch(/mix-blend/)
  })
})
