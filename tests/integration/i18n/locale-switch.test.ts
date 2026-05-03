import { describe, it, expect } from 'vitest'
import { resolveLocale, SUPPORTED_LOCALES } from '@/i18n/request'

describe('resolveLocale', () => {
  it('resolves locale from cookie when set to "en"', () => {
    expect(resolveLocale('en', null)).toBe('en')
  })

  it('resolves locale from cookie when set to "vi"', () => {
    expect(resolveLocale('vi', null)).toBe('vi')
  })

  it('falls back to accept-language header when no cookie', () => {
    expect(resolveLocale(undefined, 'en-US,en;q=0.9')).toBe('en')
  })

  it('defaults to "vi" when no cookie and no accept-language header', () => {
    expect(resolveLocale(undefined, null)).toBe('vi')
  })

  it('falls back to "vi" for unsupported locale in cookie', () => {
    expect(resolveLocale('fr', null)).toBe('vi')
  })

  it('falls back to "vi" for unsupported locale in accept-language', () => {
    expect(resolveLocale(undefined, 'ja-JP,ja;q=0.9')).toBe('vi')
  })

  it('supported locales include "vi" and "en"', () => {
    expect(SUPPORTED_LOCALES).toContain('vi')
    expect(SUPPORTED_LOCALES).toContain('en')
  })
})
