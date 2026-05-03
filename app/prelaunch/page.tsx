import type { Metadata } from 'next'
import PrelaunchCountdown from '@/components/prelaunch/prelaunch-countdown'

export const metadata: Metadata = {
  title: 'SAA 2025 — Coming Soon',
  description: 'The event will start soon.',
  robots: { index: false, follow: false },
}

export default function PrelaunchPage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg-dark)] overflow-hidden">
      {/* Background image layer */}
      <div
        aria-hidden="true"
        role="presentation"
        className="absolute inset-0 z-[var(--z-hero-bg)] home-hero-bg"
      />

      {/* Diagonal cover gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[var(--z-hero-overlay)] pointer-events-none"
        style={{ background: 'var(--overlay-prelaunch-cover)' }}
      />

      {/* Main content */}
      <div className="relative z-[var(--z-main-content)] flex min-h-screen items-center justify-center px-4 py-12 md:px-12 md:py-20 lg:px-[var(--spacing-prelaunch-page-px)] lg:py-[var(--spacing-prelaunch-page-py)]">
        <PrelaunchCountdown targetISO={process.env.NEXT_PUBLIC_PRELAUNCH_END} />
      </div>
    </div>
  )
}
