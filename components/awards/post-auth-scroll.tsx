'use client'

import { usePostAuthRedirect } from '@/hooks/use-post-auth-redirect'

export default function PostAuthScroll({ pathname }: { pathname: string }) {
  usePostAuthRedirect(pathname)
  return null
}
