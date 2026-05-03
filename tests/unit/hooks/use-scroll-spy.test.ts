import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollSpy } from '@/hooks/use-scroll-spy'

const SLUGS = ['top-talent', 'top-project', 'mvp'] as const

let observerInstances: Array<{
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
  trigger: (entries: Array<{ slug: string; ratio: number; isIntersecting: boolean }>) => void
}> = []

beforeEach(() => {
  observerInstances = []

  class FakeIntersectionObserver {
    observe: ReturnType<typeof vi.fn>
    disconnect: ReturnType<typeof vi.fn>
    unobserve: ReturnType<typeof vi.fn>
    private callback: IntersectionObserverCallback

    constructor(cb: IntersectionObserverCallback) {
      this.callback = cb
      this.observe = vi.fn()
      this.disconnect = vi.fn()
      this.unobserve = vi.fn()
      observerInstances.push({
        observe: this.observe,
        disconnect: this.disconnect,
        trigger: (entries) => {
          this.callback(
            entries.map(
              ({ slug, ratio, isIntersecting }) => ({
                target: { dataset: { awardSlug: slug } } as unknown as Element,
                intersectionRatio: ratio,
                isIntersecting,
                boundingClientRect: {} as DOMRectReadOnly,
                intersectionRect: {} as DOMRectReadOnly,
                rootBounds: null,
                time: 0,
              }),
            ),
            this as unknown as IntersectionObserver,
          )
        },
      })
    }
    takeRecords() {
      return []
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)

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

  for (const slug of SLUGS) {
    const el = document.createElement('section')
    el.setAttribute('data-award-slug', slug)
    document.body.appendChild(el)
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useScrollSpy', () => {
  it('initialises activeSlug to the first slug', () => {
    const { result } = renderHook(() => useScrollSpy(SLUGS))
    expect(result.current.activeSlug).toBe('top-talent')
  })

  it('observes every section element on mount', () => {
    renderHook(() => useScrollSpy(SLUGS))
    expect(observerInstances).toHaveLength(1)
    expect(observerInstances[0].observe).toHaveBeenCalledTimes(SLUGS.length)
  })

  it('updates activeSlug when an entry crosses the threshold', () => {
    const { result } = renderHook(() => useScrollSpy(SLUGS))
    act(() => {
      observerInstances[0].trigger([
        { slug: 'top-project', ratio: 0.6, isIntersecting: true },
        { slug: 'top-talent', ratio: 0.1, isIntersecting: true },
      ])
    })
    expect(result.current.activeSlug).toBe('top-project')
  })

  it('scrollTo updates activeSlug, scrolls the target, and writes the hash', () => {
    const { result } = renderHook(() => useScrollSpy(SLUGS))
    const target = document.querySelector<HTMLElement>('[data-award-slug="mvp"]')!
    const scrollSpy = vi.spyOn(target, 'scrollIntoView').mockImplementation(() => {})
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

    act(() => {
      result.current.scrollTo('mvp')
    })

    expect(scrollSpy).toHaveBeenCalled()
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '#mvp')
    expect(result.current.activeSlug).toBe('mvp')
    scrollSpy.mockRestore()
    replaceStateSpy.mockRestore()
  })

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderHook(() => useScrollSpy(SLUGS))
    unmount()
    expect(observerInstances[0].disconnect).toHaveBeenCalled()
  })
})
