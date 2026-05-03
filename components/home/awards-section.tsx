import { useTranslations } from 'next-intl'
import AwardList from './award-list'

export default function AwardsSection() {
  const t = useTranslations('home.awards')
  return (
    <section className="flex flex-col gap-20" style={{ fontFamily: 'var(--font-montserrat)' }}>
      <header className="flex flex-col gap-4">
        <p
          className="text-[var(--color-text-primary)] font-bold"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: '0',
          }}
        >
          {t('section_caption')}
        </p>
        <hr className="border-0 border-t border-[var(--color-divider)]" />
        <h2
          className="text-[var(--color-accent-gold)] font-bold leading-none tracking-[-0.25px]"
          style={{
            fontSize: 'clamp(32px, 7vw, 57px)',
            lineHeight: 1.12,
          }}
        >
          {t('section_title')}
        </h2>
      </header>
      <AwardList />
    </section>
  )
}
