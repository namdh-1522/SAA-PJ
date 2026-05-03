'use client'

import { useEffect } from 'react'
import { consumePostAuthRedirect } from '@/lib/auth/post-auth-redirect'

export function usePostAuthRedirect(currentPathname: string): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stashed = consumePostAuthRedirect()
    if (!stashed) return

    const [pathname, hash] = stashed.split('#')
    if (pathname !== currentPathname) return
    if (!hash) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`[data-award-slug="${hash}"]`)
      if (!target) return
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      window.history.replaceState(null, '', `#${hash}`)
    })
  }, [currentPathname])
}
