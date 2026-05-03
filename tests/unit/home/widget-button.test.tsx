import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import WidgetButton from '@/components/home/widget-button'

vi.mock('next-intl', () => ({
  useTranslations: (ns?: string) => (key: string) => (ns ? `${ns}.${key}` : key),
}))

describe('WidgetButton', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('renders as a fixed-position button', () => {
    render(<WidgetButton />)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('fixed')
  })

  it('logs console.warn stub on click', () => {
    render(<WidgetButton />)
    fireEvent.click(screen.getByRole('button'))
    expect(warnSpy).toHaveBeenCalledWith('[WidgetButton] menu destinations TBD')
  })

  it('toggles a tooltip on click', () => {
    render(<WidgetButton />)
    expect(screen.queryByText('home.widget.stub_tooltip')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('home.widget.stub_tooltip')).toBeInTheDocument()
  })
})
