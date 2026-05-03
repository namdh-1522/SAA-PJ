import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { AwardCategory } from '@/types/home'

export interface AwardImageProps {
  award: AwardCategory
  priority?: boolean
}

export default function AwardImage({ award, priority = false }: AwardImageProps) {
  const t = useTranslations()
  const title = t(award.titleKey)
  return (
    <div
      className="relative flex-shrink-0 w-full aspect-square xl:w-[336px] xl:h-[336px] rounded-3xl overflow-hidden ring-1 ring-[var(--color-accent-gold-alt)] shadow-[var(--shadow-award-image)] mix-blend-screen"
    >
      <Image
        src={award.image}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 1279px) 100vw, 336px"
        quality={90}
        className="object-cover"
        priority={priority}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={award.nameOverlayImage}
          alt={title}
          width={232}
          height={64}
          className="object-contain"
        />
      </div>
    </div>
  )
}
