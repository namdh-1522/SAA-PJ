import type { CountdownValues } from '@/types/home'

export function parseEventStart(iso: string | undefined): Date | null {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 86_400_000

export function getInitialCountdown(now: Date, target: Date | null): CountdownValues {
  if (!target) {
    return { days: '--', hours: '--', minutes: '--', hasStarted: false }
  }
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, hasStarted: true }
  }
  const days = Math.floor(diff / MS_PER_DAY)
  const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR)
  const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE)
  return { days, hours, minutes, hasStarted: false }
}
