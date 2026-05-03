import { useTranslations } from 'next-intl'
import type { AwardCategory } from '@/types/home'
import AwardRow from './award-row'
import AwardsDivider from './awards-divider'

export interface AwardsListProps {
  awards: readonly AwardCategory[]
}

export default function AwardsList({ awards }: AwardsListProps) {
  const t = useTranslations('awards')

  if (awards.length === 0) {
    return (
      <p className="text-white text-base leading-6 py-12">{t('empty')}</p>
    )
  }

  return (
    <div className="flex flex-col w-full gap-20">
      {awards.map((award, idx) => (
        <div key={award.slug} className="flex flex-col gap-20">
          <AwardRow
            award={award}
            direction={idx % 2 === 0 ? 'image-left' : 'image-right'}
            priority={idx < 2}
          />
          {idx < awards.length - 1 && <AwardsDivider />}
        </div>
      ))}
    </div>
  )
}
