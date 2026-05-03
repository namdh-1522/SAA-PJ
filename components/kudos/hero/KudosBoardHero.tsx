'use client'

import { useTranslations } from 'next-intl'
import KudosComposeTrigger from '@/components/kudos/hero/KudosComposeTrigger'
import SunnerSearchTrigger from '@/components/kudos/hero/SunnerSearchTrigger'

/** Hero / Bìa — Figma node 2940:13434 (frame MaZUn5xHXZ).
 *
 *  Banner stack (per user-supplied design reference):
 *    1. "Hệ thống ghi nhận và cảm ơn" subtitle — gold (`--color-cta-bg`),
 *       sits ABOVE the wordmark (previously rendered below).
 *    2. SUN* Kudos logomark — the brand mark + "KUDOS" wordmark drawn as a
 *       single PNG (`/assets/home/kudos-logomark.png`). Replaces the previous
 *       text-only Impact-fallback rendering, which couldn't reproduce the red
 *       Sun* "S" glyph that opens the wordmark.
 *    3. Compose / search CTA pills below.
 *
 *  All three rows are horizontally centred and constrained to the
 *  `xl:px-36` page gutter so the hero aligns with the rest of the board.
 */
export default function KudosBoardHero() {
  const t = useTranslations('kudos.hero')

  return (
    <section
      className="relative isolate flex w-full flex-col items-stretch overflow-hidden py-8 md:py-[80px]"
      aria-label="Sun* Kudos Live Board"
    >
      <div className="absolute inset-0 z-0 kudos-hero-bg" aria-hidden="true" />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0) 63.41%)',
        }}
        aria-hidden="true"
      />

      {/* Banner stack — LEFT-ALIGNED per the user-supplied design crop:
          subtitle and wordmark both start at the page gutter (`xl:px-36`),
          not centred. */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-col items-start px-4 text-left md:px-12 xl:px-36">
        {/* Subtitle — gold, above the wordmark. */}
        <p
          className="mb-4 px-0 text-[24px] font-bold leading-[32px] md:mb-6 md:text-[36px] md:leading-[44px]"
          style={{ color: 'var(--color-cta-bg)' }}
        >
          {t('subtitle')}
        </p>

        {/* Wordmark — Sun* logomark + KUDOS lettering as a single SVG.
            Sized to match the Figma `MM_MEDIA_Kudos logo` group (593×104 in
            the 1440-wide canvas). Parent is `flex flex-col items-start`, so
            the h1 needs `w-full` for the inner image's `w-full` to resolve
            against the gutter container instead of collapsing to the image's
            intrinsic size. */}
        <h1 className="mb-6 w-full select-none md:mb-6">
          <span className="sr-only">SUN* Kudos</span>
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG; next/image would need dangerouslyAllowSVG */}
          <img
            src="/assets/home/kudos-logomark.svg"
            alt=""
            aria-hidden="true"
            width={593}
            height={104}
            className="block h-auto w-full max-w-[593px]"
          />
        </h1>

        <div className="flex w-full max-w-[1200px] flex-col items-stretch gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
          <KudosComposeTrigger className="w-full md:max-w-[738px] md:flex-1" />
          <SunnerSearchTrigger className="w-full md:w-[381px] md:flex-none" />
        </div>
      </div>
    </section>
  )
}
