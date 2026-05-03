'use client'

import { useState, useCallback, useRef } from 'react'
import { COPY_LINK_RESET_MS } from '@/lib/kudos/constants'

interface UseCopyLinkResult {
  copied: boolean
  copy: (url: string) => Promise<void>
}

export function useCopyLink(): UseCopyLinkResult {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(async (url: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      timerRef.current = setTimeout(() => setCopied(false), COPY_LINK_RESET_MS)
    } catch {
      setCopied(false)
    }
  }, [])

  return { copied, copy }
}
