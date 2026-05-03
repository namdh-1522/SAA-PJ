import { useTranslations } from 'next-intl'
import RootFurtherMark from './root-further-mark'

export default function AboutBody() {
  const t = useTranslations('home.about')

  return (
    <section
      className="flex flex-col gap-8 max-w-[1152px] mx-auto"
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      {/* B4.0 sub-heading — bigger size + horizontally centered per Figma */}
      <div className="flex justify-center w-full">
        <RootFurtherMark size="md" />
      </div>

      {/* Body paragraphs 1–3 — text-justify per design */}
      <div className="flex flex-col gap-6 text-[var(--color-text-primary)] text-base leading-6 tracking-[0.5px] text-justify px-4 md:px-0">
        <p>{t('body_p1')}</p>
        <p>{t('body_p2')}</p>
        <p>{t('body_p3')}</p>
      </div>

      {/* Quote (centered) */}
      <blockquote className="flex flex-col items-center gap-2 pt-4 pb-2 text-center text-[var(--color-text-primary)]">
        <p className="text-base md:text-lg leading-7 italic">{t('quote')}</p>
        <cite className="text-sm leading-5 tracking-[0.5px] not-italic text-[var(--color-text-muted)]">
          {t('quote_source')}
        </cite>
      </blockquote>

      {/* Body paragraphs 4–5 — appear AFTER the quote per Figma narrative order, also justified */}
      <div className="flex flex-col gap-6 text-[var(--color-text-primary)] text-base leading-6 tracking-[0.5px] text-justify px-4 md:px-0">
        <p>{t('body_p4')}</p>
        <p>{t('body_p5')}</p>
      </div>
    </section>
  )
}
