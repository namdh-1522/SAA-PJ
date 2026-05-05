import RootFurtherMark from './root-further-mark'
import Countdown from './countdown'
import EventInfo from './event-info'
import HeroCtaButton from './hero-cta-button'

export interface HeroSectionProps {
  eventStartISO: string | undefined
}

export default function HeroSection({ eventStartISO }: HeroSectionProps) {
  // Content sizes naturally — the BG decoration is rendered at the PAGE level (see app/about-saa-2025/page.tsx)
  // so it can extend below the hero content without forcing an artificial min-height that creates an empty gap.
  return (
    <section className="relative w-full">
      {/* Top padding: header is fixed at h-20 (80px), so pt-24/28/32 leaves
          16/32/48px of breathing room below it on each breakpoint. Tightened
          from pt-40 on lg so the two CTA pills fit above the fold on a
          standard 900px desktop viewport. */}
      <div className="px-4 md:px-12 xl:px-36 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="flex flex-col gap-8 max-w-[var(--spacing-content-max-w)] w-full mx-auto">
          <div className="w-full max-w-[1224px]">
            <RootFurtherMark size="xl" />
          </div>
          <Countdown targetISO={eventStartISO} />
          <EventInfo eventStartISO={eventStartISO} />
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-2">
            <HeroCtaButton href="/awards" labelKey="home.cta.about_awards" />
            <HeroCtaButton href="/kudos" labelKey="home.cta.about_kudos" />
          </div>
        </div>
      </div>
    </section>
  )
}
