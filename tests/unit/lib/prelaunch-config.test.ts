import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parsePrelaunchEnd, isPrelaunchActive } from '@/lib/prelaunch/config'

describe('parsePrelaunchEnd', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when input is undefined', () => {
    expect(parsePrelaunchEnd(undefined)).toBeNull()
  })

  it('returns null when input is an empty string', () => {
    expect(parsePrelaunchEnd('')).toBeNull()
  })

  it('returns null and warns when input is not a parseable ISO string', () => {
    const result = parsePrelaunchEnd('not-a-date')
    expect(result).toBeNull()
    expect(console.warn).toHaveBeenCalledWith('Invalid NEXT_PUBLIC_PRELAUNCH_END')
  })

  it('returns null and warns for a random garbage string', () => {
    const result = parsePrelaunchEnd('2026-99-99T99:99:99')
    expect(result).toBeNull()
    expect(console.warn).toHaveBeenCalledWith('Invalid NEXT_PUBLIC_PRELAUNCH_END')
  })

  it('returns a valid Date for a correct ISO string', () => {
    const result = parsePrelaunchEnd('2026-06-07T18:30:00+07:00')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getTime()).toBe(new Date('2026-06-07T18:30:00+07:00').getTime())
  })

  it('does NOT warn for a valid ISO string', () => {
    parsePrelaunchEnd('2026-06-07T18:30:00+07:00')
    expect(console.warn).not.toHaveBeenCalled()
  })
})

describe('isPrelaunchActive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false when cutoff is null (env var missing/invalid)', () => {
    expect(isPrelaunchActive(null)).toBe(false)
  })

  it('returns false when cutoff is in the past', () => {
    vi.setSystemTime(new Date('2026-06-10T00:00:00+07:00'))
    const pastCutoff = new Date('2026-06-07T18:30:00+07:00')
    expect(isPrelaunchActive(pastCutoff)).toBe(false)
  })

  it('returns true when cutoff is in the future', () => {
    vi.setSystemTime(new Date('2026-06-01T00:00:00+07:00'))
    const futureCutoff = new Date('2026-06-07T18:30:00+07:00')
    expect(isPrelaunchActive(futureCutoff)).toBe(true)
  })

  it('returns false when cutoff equals now exactly', () => {
    const cutoff = new Date('2026-06-07T18:30:00+07:00')
    vi.setSystemTime(cutoff)
    expect(isPrelaunchActive(cutoff)).toBe(false)
  })
})
