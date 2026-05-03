import { useTranslations } from 'next-intl'
import KudosLogomark from './kudos-logomark'
import KudosCtaButton from './kudos-cta-button'

export default function KudosPromo() {
  const t = useTranslations('home.kudos')
  return (
    <section
      className="relative w-full max-w-[1224px] mx-auto rounded-[var(--radius-card)] overflow-hidden"
      style={{
        fontFamily: 'var(--font-montserrat)',
        backgroundImage: "url('/assets/home/kudos-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'var(--color-bg-dark-alt)',
      }}
    >
      <div className="relative flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-16">
        <div className="flex-1 flex flex-col gap-8 max-w-[457px]">
          <p
            className="text-[var(--color-text-primary)] font-bold"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '24px',
              lineHeight: '32px',
              letterSpacing: '0',
            }}
          >
            {t('kicker')}
          </p>
          <h2
            className="text-[var(--color-accent-gold-alt)] font-bold leading-none tracking-[-0.25px]"
            style={{ fontSize: 'clamp(32px, 6vw, 57px)', lineHeight: 1.12 }}
          >
            {t('title')}
          </h2>
          <p
            className="text-[var(--color-text-primary)] font-bold"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.5px',
            }}
          >
            {t.rich('description_rich', {
              strong: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </p>
          <KudosCtaButton />
        </div>

        <div className="hidden md:flex flex-1 justify-end items-center pr-4 lg:pr-8">
          <KudosLogomark />
        </div>
      </div>
    </section>
  )
}
