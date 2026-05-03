import { useTranslations } from 'next-intl'

export default function AwardsPageTitle() {
  const t = useTranslations('awards')
  return (
    <div className="flex flex-col gap-4 w-full items-start" style={{ fontFamily: 'var(--font-montserrat)' }}>
      <p className="w-full text-2xl font-bold leading-8 text-white text-center">
        {t('subtitle')}
      </p>
      <hr className="h-px w-full border-0 bg-[var(--color-divider)]" aria-hidden="true" />
      <h1
        className="w-full font-bold text-[57px] leading-[64px] tracking-[-0.25px] text-[var(--color-accent-gold-alt)] text-center"
      >
        {t('title')}
      </h1>
    </div>
  )
}
