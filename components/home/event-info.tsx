import { useLocale, useTranslations } from 'next-intl'

export interface EventInfoProps {
  /** Same ISO string the countdown targets. Drives the displayed date so the
   *  two never drift out of sync. Falls back to the i18n string when missing. */
  eventStartISO: string | undefined
}

const EVENT_TIMEZONE = 'Asia/Ho_Chi_Minh'

function formatEventDate(iso: string | undefined, locale: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: EVENT_TIMEZONE,
  }).format(d)
}

export default function EventInfo({ eventStartISO }: EventInfoProps) {
  const t = useTranslations('home.event')
  const locale = useLocale()
  const dateValue = formatEventDate(eventStartISO, locale) ?? t('date_value')
  return (
    <div className="flex flex-col gap-2 text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-montserrat)' }}>
      {/* Row 1: Time + Location. Per design-items, labels are "văn bản phụ" (secondary,
          regular weight) and values are "văn bản chính" (primary, bold). */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-[60px] gap-2">
        <span className="text-base leading-6 tracking-[0.5px]">
          <span className="font-normal">{t('time_label')} </span>
          <span className="font-bold">{dateValue}</span>
        </span>
        <span className="text-base leading-6 tracking-[0.5px]">
          <span className="font-normal">{t('location_label')} </span>
          <span className="font-bold">{t('location_value')}</span>
        </span>
      </div>
      {/* Row 2: livestream note — Montserrat 700 16/24 ls:0.5 (verified against Figma node 2167:9061) */}
      <p className="text-base leading-6 tracking-[0.5px] font-bold">
        {t('livestream_note')}
      </p>
    </div>
  )
}
