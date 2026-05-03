import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import ArrowUpRightIcon from '@/components/icons/arrow-up-right-icon'
import type { AwardSpec } from '@/types/home'

export interface AwardCardProps {
  award: AwardSpec
}

export default function AwardCard({ award }: AwardCardProps) {
  const t = useTranslations()
  const href = `/awards#${award.slug}`
  const title = t(award.titleKey)
  const description = t(award.descriptionKey)

  return (
    <article className="group flex flex-col gap-6 w-full" style={{ fontFamily: 'var(--font-montserrat)' }}>
      <Link
        href={href}
        className="relative block aspect-square w-full rounded-[var(--radius-card)] overflow-hidden border border-[rgba(250,226,135,0.60)] shadow-[var(--shadow-card-default)] transition-all duration-200 group-hover:shadow-[var(--shadow-card-hover)] group-hover:-translate-y-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-bg)]"
      >
        <Image
          src={award.image}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 336px"
          quality={90}
          className="object-cover"
        />
      </Link>
      <div className="flex flex-col gap-3">
        <Link href={href} className="block">
          <h3
            className="text-[var(--color-accent-gold-alt)] font-normal text-2xl leading-8"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {title}
          </h3>
        </Link>
        <p
          className="text-[var(--color-text-primary)] text-base leading-6 tracking-[0.5px] min-h-[48px] overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
          title={description}
        >
          {description}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 w-fit text-[var(--color-text-primary)] hover:underline underline-offset-4"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.15px',
          }}
        >
          <span>{t('home.cta.detail')}</span>
          <ArrowUpRightIcon width={20} height={20} />
        </Link>
      </div>
    </article>
  )
}
