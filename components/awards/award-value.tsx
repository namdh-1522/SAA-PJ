import { useTranslations } from 'next-intl'
import LicenseIcon from '@/components/icons/license-icon'
import type { AwardValue as AwardValueType } from '@/types/home'

export interface AwardValueProps {
  values: readonly AwardValueType[]
}

function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

export default function AwardValue({ values }: AwardValueProps) {
  const t = useTranslations('awards')
  return (
    <div className="flex flex-col gap-6 w-full" style={{ fontFamily: 'var(--font-montserrat)' }}>
      <div className="flex items-center gap-4 text-[var(--color-accent-gold-alt)] font-bold text-2xl leading-8">
        <LicenseIcon width={24} height={24} />
        <span>{t('label.value')}</span>
      </div>
      <div className="flex flex-col gap-4">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col gap-1">
            <p className="text-white font-bold text-[36px] leading-[44px]">
              {formatVnd(v.amountVnd)}
            </p>
            {v.recipientType && (
              <p className="text-white font-bold text-sm leading-5 tracking-[0.1px]">
                {t(`value.recipient.${v.recipientType}`)}
              </p>
            )}
            {v.captionKey && !v.recipientType && (
              <p className="text-white font-bold text-sm leading-5 tracking-[0.1px]">
                {t('label.perAward')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
