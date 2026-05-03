import { useTranslations } from 'next-intl'
import type { AwardCategory } from '@/types/home'
import AwardsDivider from './awards-divider'
import AwardQuantity from './award-quantity'
import AwardValue from './award-value'

export interface AwardContentProps {
  award: AwardCategory
}

export default function AwardContent({ award }: AwardContentProps) {
  const t = useTranslations()
  const title = t(award.titleKey)
  const descriptionLong = t(award.descriptionLongKey)

  return (
    <article
      className="flex flex-col gap-8 w-full xl:w-[480px] rounded-2xl backdrop-blur-[32px]"
      style={{ fontFamily: 'var(--font-montserrat)' }}
    >
      <div className="flex flex-col gap-6">
        <h2
          id={`${award.slug}-title`}
          className="font-bold text-2xl leading-8 text-[var(--color-accent-gold-alt)]"
        >
          {title}
        </h2>
        <p
          className="text-white font-bold text-base leading-6 tracking-[0.5px]"
          style={{ textAlign: 'justify' }}
        >
          {descriptionLong}
        </p>
      </div>
      <AwardsDivider />
      <AwardQuantity quantity={award.quantity} quantityUnit={award.quantityUnit} />
      <AwardsDivider />
      <AwardValue values={award.values} />
    </article>
  )
}
