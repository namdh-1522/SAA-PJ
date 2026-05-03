import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/components/prelaunch/prelaunch-countdown', () => ({
  default: ({ targetISO }: { targetISO?: string }) => (
    <div data-testid="prelaunch-countdown" data-target={targetISO ?? ''} />
  ),
}))

describe('PrelaunchPage metadata', () => {
  it('sets robots to noindex / nofollow', async () => {
    const { metadata } = await import('@/app/prelaunch/page')
    expect((metadata as { robots: unknown }).robots).toEqual({
      index: false,
      follow: false,
    })
  })
})

describe('PrelaunchPage component', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('passes NEXT_PUBLIC_PRELAUNCH_END to PrelaunchCountdown when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_PRELAUNCH_END', '2026-06-07T18:30:00+07:00')
    const { default: PrelaunchPage } = await import('@/app/prelaunch/page')
    render(<PrelaunchPage />)
    expect(screen.getByTestId('prelaunch-countdown')).toHaveAttribute(
      'data-target',
      '2026-06-07T18:30:00+07:00'
    )
  })

  it('passes empty string to PrelaunchCountdown when env var is unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_PRELAUNCH_END', '')
    const { default: PrelaunchPage } = await import('@/app/prelaunch/page')
    render(<PrelaunchPage />)
    expect(screen.getByTestId('prelaunch-countdown')).toHaveAttribute('data-target', '')
  })
})
