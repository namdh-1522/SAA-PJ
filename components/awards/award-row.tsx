import type { AwardCategory } from '@/types/home'
import AwardImage from './award-image'
import AwardContent from './award-content'

export interface AwardRowProps {
  award: AwardCategory
  direction: 'image-left' | 'image-right'
  priority?: boolean
}

export default function AwardRow({ award, direction, priority = false }: AwardRowProps) {
  const rowClass =
    direction === 'image-left'
      ? 'flex flex-col xl:flex-row gap-10 items-start'
      : 'flex flex-col xl:flex-row-reverse gap-10 items-start'

  return (
    <section
      id={award.slug}
      data-award-slug={award.slug}
      aria-labelledby={`${award.slug}-title`}
      className="w-full"
    >
      <div className={rowClass}>
        <AwardImage award={award} priority={priority} />
        <AwardContent award={award} />
      </div>
    </section>
  )
}
