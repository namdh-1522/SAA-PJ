import { describe, it, expect } from 'vitest'
import { parseEventStart, getInitialCountdown } from '@/lib/event'

describe('parseEventStart', () => {
  it('returns a Date when given a valid ISO string', () => {
    const d = parseEventStart('2025-12-26T18:30:00+07:00')
    expect(d).toBeInstanceOf(Date)
    expect(d?.getTime()).toBe(new Date('2025-12-26T18:30:00+07:00').getTime())
  })

  it('returns null when input is undefined', () => {
    expect(parseEventStart(undefined)).toBeNull()
  })

  it('returns null when input is an empty string', () => {
    expect(parseEventStart('')).toBeNull()
  })

  it('returns null when input is unparsable', () => {
    expect(parseEventStart('not-a-date')).toBeNull()
  })
})

describe('getInitialCountdown', () => {
  it('computes days/hours/minutes correctly for a future target', () => {
    const now = new Date('2025-12-20T00:00:00+07:00')
    const target = new Date('2025-12-26T18:30:00+07:00')
    const r = getInitialCountdown(now, target)
    expect(r.hasStarted).toBe(false)
    expect(r.days).toBe(6)
    expect(r.hours).toBe(18)
    expect(r.minutes).toBe(30)
  })

  it('collapses to zeros and hasStarted=true when target <= now', () => {
    const now = new Date('2026-01-01T00:00:00+07:00')
    const target = new Date('2025-12-26T18:30:00+07:00')
    const r = getInitialCountdown(now, target)
    expect(r.hasStarted).toBe(true)
    expect(r.days).toBe(0)
    expect(r.hours).toBe(0)
    expect(r.minutes).toBe(0)
  })

  it('returns --/--/-- with hasStarted=false when target is null', () => {
    const r = getInitialCountdown(new Date(), null)
    expect(r.days).toBe('--')
    expect(r.hours).toBe('--')
    expect(r.minutes).toBe('--')
    expect(r.hasStarted).toBe(false)
  })

  it('handles sub-minute remaining correctly (floors minutes)', () => {
    const now = new Date('2025-12-26T18:29:30+07:00')
    const target = new Date('2025-12-26T18:30:00+07:00')
    const r = getInitialCountdown(now, target)
    expect(r.days).toBe(0)
    expect(r.hours).toBe(0)
    expect(r.minutes).toBe(0)
    expect(r.hasStarted).toBe(false)
  })
})
