import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  captureSameOriginReferrer,
  consumePostAuthRedirect,
  stashRedirectTarget,
} from '@/lib/auth/post-auth-redirect'

const KEY = 'saa.postAuthRedirect'

beforeEach(() => {
  window.sessionStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('post-auth-redirect helpers', () => {
  it('stashRedirectTarget writes only same-origin paths starting with /', () => {
    stashRedirectTarget('/awards#mvp')
    expect(window.sessionStorage.getItem(KEY)).toBe('/awards#mvp')

    window.sessionStorage.clear()
    stashRedirectTarget('https://example.com/evil')
    expect(window.sessionStorage.getItem(KEY)).toBeNull()
  })

  it('consumePostAuthRedirect returns and deletes the stashed value', () => {
    window.sessionStorage.setItem(KEY, '/awards#top-project')
    expect(consumePostAuthRedirect()).toBe('/awards#top-project')
    expect(window.sessionStorage.getItem(KEY)).toBeNull()
  })

  it('consumePostAuthRedirect returns null when nothing is stashed', () => {
    expect(consumePostAuthRedirect()).toBeNull()
  })

  it('captureSameOriginReferrer returns pathname+hash for same-origin protected referrers', () => {
    Object.defineProperty(document, 'referrer', {
      value: `${window.location.origin}/awards#mvp`,
      configurable: true,
    })
    expect(captureSameOriginReferrer()).toBe('/awards#mvp')
  })

  it('captureSameOriginReferrer returns null for cross-origin referrers', () => {
    Object.defineProperty(document, 'referrer', {
      value: 'https://malicious.example.com/foo',
      configurable: true,
    })
    expect(captureSameOriginReferrer()).toBeNull()
  })

  it('captureSameOriginReferrer returns null for the login route itself', () => {
    Object.defineProperty(document, 'referrer', {
      value: `${window.location.origin}/`,
      configurable: true,
    })
    expect(captureSameOriginReferrer()).toBeNull()
  })

  it('captureSameOriginReferrer returns null for empty referrer', () => {
    Object.defineProperty(document, 'referrer', { value: '', configurable: true })
    expect(captureSameOriginReferrer()).toBeNull()
  })
})
