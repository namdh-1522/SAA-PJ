'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const DESKTOP_ROOT_MARGIN = '-112px 0px -50% 0px'
const MOBILE_ROOT_MARGIN = '-56px 0px -50% 0px'
const MOBILE_QUERY = '(max-width: 767px)'

export interface UseScrollSpyOptions {
  rootMargin?: string
  smooth?: boolean
}

export interface UseScrollSpyReturn {
  activeSlug: string | null
  setActiveSlug: (slug: string) => void
  scrollTo: (slug: string, options?: { updateHash?: boolean }) => void
}

function pickRootMargin(custom?: string): string {
  if (custom) return custom
  if (typeof window === 'undefined') return DESKTOP_ROOT_MARGIN
  return window.matchMedia(MOBILE_QUERY).matches ? MOBILE_ROOT_MARGIN : DESKTOP_ROOT_MARGIN
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useScrollSpy(
  slugs: readonly string[],
  options: UseScrollSpyOptions = {},
): UseScrollSpyReturn {
  const [activeSlug, setActiveSlug] = useState<string | null>(slugs[0] ?? null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const buildObserver = useCallback(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return null

    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const slug = (visible.target as HTMLElement).dataset.awardSlug
        if (slug && slugs.includes(slug)) {
          setActiveSlug(slug)
        }
      },
      { rootMargin: pickRootMargin(options.rootMargin), threshold: [0, 0.1, 0.5, 1] },
    )

    for (const slug of slugs) {
      const el = document.querySelector<HTMLElement>(`[data-award-slug="${slug}"]`)
      if (el) observer.observe(el)
    }

    observerRef.current = observer
    return observer
  }, [options.rootMargin, slugs])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let observer: IntersectionObserver | null = null
    try {
      observer = buildObserver()
    } catch {
      observer = null
    }

    if (options.rootMargin) return () => observer?.disconnect()

    const mql = window.matchMedia(MOBILE_QUERY)
    const handleChange = () => {
      try {
        observer = buildObserver()
      } catch {
        // ignore — observer rebuild failed; existing one keeps running
      }
    }
    mql.addEventListener('change', handleChange)

    return () => {
      mql.removeEventListener('change', handleChange)
      observer?.disconnect()
    }
  }, [buildObserver, options.rootMargin])

  const scrollTo = useCallback(
    (slug: string, scrollOptions: { updateHash?: boolean } = {}) => {
      if (typeof window === 'undefined') return
      const el = document.querySelector<HTMLElement>(`[data-award-slug="${slug}"]`)
      if (!el) return

      const reduced = prefersReducedMotion()
      const smooth = options.smooth ?? !reduced
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })

      if (scrollOptions.updateHash !== false) {
        window.history.replaceState(null, '', `#${slug}`)
      }
      setActiveSlug(slug)
    },
    [options.smooth],
  )

  return { activeSlug, setActiveSlug, scrollTo }
}
