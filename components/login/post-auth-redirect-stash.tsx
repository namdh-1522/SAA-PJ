'use client'

import { useEffect } from 'react'
import { captureSameOriginReferrer, stashRedirectTarget } from '@/lib/auth/post-auth-redirect'

export default function PostAuthRedirectStash() {
  useEffect(() => {
    const target = captureSameOriginReferrer()
    if (target) stashRedirectTarget(target)
  }, [])
  return null
}
