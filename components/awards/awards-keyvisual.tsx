import RootFurtherMark from '@/components/home/root-further-mark'

/** Awards "Hệ thống giải" keyvisual — Figma `zFYDgyj_pD` (id `313:8437`).
 *
 *  Sizing: content-driven (matches the homepage `<HeroSection>` pattern).
 *  Previously this used `h-[547px]` which reserved ~227px of empty banner
 *  below the ROOT FURTHER mark, creating a large dead zone before the
 *  "Sun* Annual Awards 2025" title underneath. Letting the content size the
 *  section naturally — with the same padding scale as the homepage hero —
 *  keeps the brand mark in the same vertical position as the homepage logo
 *  AND tightens the gap to the title section to match the Figma frame.
 */
export default function AwardsKeyvisual() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 home-hero-bg" aria-hidden="true" />
      {/* Cover gradient — fades the bottom edge of the banner into the page bg. */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(0deg, #00101A -4.23%, rgba(0, 19, 32, 0.00) 52.79%)',
        }}
      />
      {/* Brand-mark row — matches the homepage hero's padding scale so the
          logo sits at the same vertical position on both pages
          (`pt-24` mobile / `pt-32` md / `pt-40` lg+). */}
      <div className="relative px-4 md:px-12 xl:px-36 pt-24 md:pt-32 lg:pt-40 pb-16">
        <div className="w-full max-w-[1224px]">
          <RootFurtherMark size="xl" />
        </div>
      </div>
    </section>
  )
}
