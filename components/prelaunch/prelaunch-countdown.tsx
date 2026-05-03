'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { CountdownValues } from '@/types/home'
import { parseEventStart, getInitialCountdown } from '@/lib/event'
import CountdownUnit from './countdown-unit'

interface Props {
  targetISO?: string
}

export default function PrelaunchCountdown({ targetISO }: Props) {
  const t = useTranslations('prelaunch')
  const target = parseEventStart(targetISO)

  const [values, setValues] = useState<CountdownValues>(() =>
    getInitialCountdown(new Date(), target)
  )

  useEffect(() => {
    const id = setInterval(() => {
      setValues(getInitialCountdown(new Date(), target))
    }, 60_000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetISO])

  const days = values.days
  const hours = values.hours
  const minutes = values.minutes

  return (
    <div className="flex flex-col items-center gap-6">
      <h1
        className="text-white text-center font-bold"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '36px',
          lineHeight: '48px',
          letterSpacing: '0',
        }}
      >
        {t('headline')}
      </h1>

      {/* TODO: extract interval logic into a useCountdown hook */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-row gap-6 md:gap-10 lg:gap-[var(--spacing-prelaunch-units-gap)] items-center"
      >
        <CountdownUnit value={days} label={t('days_label')} />
        <CountdownUnit value={hours} label={t('hours_label')} />
        <CountdownUnit value={minutes} label={t('minutes_label')} />
      </div>
    </div>
  )
}
