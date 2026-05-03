import { useTranslations } from 'next-intl'
import DiamondIcon from '@/components/icons/diamond-icon'
import type { AwardQuantityUnit } from '@/types/home'

export interface AwardQuantityProps {
  quantity: number
  quantityUnit: AwardQuantityUnit
}

export default function AwardQuantity({ quantity, quantityUnit }: AwardQuantityProps) {
  const t = useTranslations('awards')
  return (
    <div className="flex items-center gap-4 w-full" style={{ fontFamily: 'var(--font-montserrat)' }}>
      <div className="flex items-center gap-2 text-[var(--color-accent-gold-alt)] font-bold text-2xl leading-8">
        <DiamondIcon width={24} height={24} />
        <span>{t('label.quantity')}</span>
      </div>
      <span className="text-[var(--color-accent-gold-alt)] font-bold text-2xl leading-8">
        {quantity}
      </span>
      <span className="text-[var(--color-accent-gold-alt)] font-bold text-2xl leading-8">
        {t(`unit.${quantityUnit}`)}
      </span>
    </div>
  )
}
