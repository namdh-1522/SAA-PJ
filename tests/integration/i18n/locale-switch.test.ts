import { describe, it, expect } from 'vitest'
import { resolveLocale, SUPPORTED_LOCALES } from '@/i18n/request'

describe('resolveLocale', () => {
  it('resolves locale from cookie when set to "en"', () => {
    expect(resolveLocale('en')).toBe('en')
  })

  it('resolves locale from cookie when set to "vi"', () => {
    expect(resolveLocale('vi')).toBe('vi')
  })

  it('defaults to "vi" for first-time visitors (no cookie)', () => {
    expect(resolveLocale(undefined)).toBe('vi')
  })

  it('defaults to "vi" for unsupported locale in cookie', () => {
    expect(resolveLocale('fr')).toBe('vi')
  })

  it('supported locales include "vi" and "en"', () => {
    expect(SUPPORTED_LOCALES).toContain('vi')
    expect(SUPPORTED_LOCALES).toContain('en')
  })
})
