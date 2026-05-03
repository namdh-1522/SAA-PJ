'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import CountdownTile from './countdown-tile'
import { parseEventStart, getInitialCountdown } from '@/lib/event'
import type { CountdownValues } from '@/types/home'

export interface CountdownProps {
  targetISO: string | undefined
}

export default function Countdown({ targetISO }: CountdownProps) {
  const t = useTranslations('home.countdown')
  // Memoise target on the stable `targetISO` string — avoids the infinite-loop bug
  // caused by re-creating the Date on every render and using it as a useEffect dep.
  const target = useMemo(() => parseEventStart(targetISO), [targetISO])
  const [values, setValues] = useState<CountdownValues>(() =>
    getInitialCountdown(new Date(), target),
  )

  useEffect(() => {
    if (!target) return
    function tick() {
      try {
        setValues(getInitialCountdown(new Date(), target))
      } catch {
        setValues({ days: '--', hours: '--', minutes: '--', hasStarted: false })
      }
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [target])

  const showSubtitle = !!target && !values.hasStarted && values.days !== '--'

  return (
    <div className="flex flex-col gap-4" aria-live="polite" aria-atomic="true">
      {showSubtitle && (
        <p
          className="text-[var(--color-text-primary)] font-bold"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'var(--text-hero-sub-size)',
            lineHeight: 'var(--text-hero-sub-lh)',
          }}
        >
          {t('subtitle')}
        </p>
      )}
      <div className="flex flex-row gap-4 md:gap-6 lg:gap-10">
        <CountdownTile value={values.days} labelKey="home.countdown.days" />
        <CountdownTile value={values.hours} labelKey="home.countdown.hours" />
        <CountdownTile value={values.minutes} labelKey="home.countdown.minutes" />
      </div>
    </div>
  )
}
