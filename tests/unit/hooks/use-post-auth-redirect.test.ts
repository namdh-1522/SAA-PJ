import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePostAuthRedirect } from '@/hooks/use-post-auth-redirect'

beforeEach(() => {
  window.sessionStorage.clear()
  for (const slug of ['mvp', 'top-talent']) {
    const el = document.createElement('section')
    el.setAttribute('data-award-slug', slug)
    document.body.appendChild(el)
  }
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 1
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('usePostAuthRedirect', () => {
  it('scrolls to the matching slug when stashed pathname matches and hash is present', () => {
    window.sessionStorage.setItem('saa.postAuthRedirect', '/awards#mvp')
    const target = document.querySelector<HTMLElement>('[data-award-slug="mvp"]')!
    const scrollSpy = vi.spyOn(target, 'scrollIntoView').mockImplementation(() => {})

    renderHook(() => usePostAuthRedirect('/awards'))

    expect(scrollSpy).toHaveBeenCalled()
    scrollSpy.mockRestore()
  })

  it('is a no-op when stashed pathname does not match', () => {
    window.sessionStorage.setItem('saa.postAuthRedirect', '/other#mvp')
    const target = document.querySelector<HTMLElement>('[data-award-slug="mvp"]')!
    const scrollSpy = vi.spyOn(target, 'scrollIntoView').mockImplementation(() => {})

    renderHook(() => usePostAuthRedirect('/awards'))

    expect(scrollSpy).not.toHaveBeenCalled()
    scrollSpy.mockRestore()
  })

  it('is a no-op when no hash is present', () => {
    window.sessionStorage.setItem('saa.postAuthRedirect', '/awards')
    const target = document.querySelector<HTMLElement>('[data-award-slug="mvp"]')!
    const scrollSpy = vi.spyOn(target, 'scrollIntoView').mockImplementation(() => {})

    renderHook(() => usePostAuthRedirect('/awards'))

    expect(scrollSpy).not.toHaveBeenCalled()
    scrollSpy.mockRestore()
  })

  it('is a no-op when nothing is stashed', () => {
    const target = document.querySelector<HTMLElement>('[data-award-slug="mvp"]')!
    const scrollSpy = vi.spyOn(target, 'scrollIntoView').mockImplementation(() => {})

    renderHook(() => usePostAuthRedirect('/awards'))

    expect(scrollSpy).not.toHaveBeenCalled()
    scrollSpy.mockRestore()
  })
})
