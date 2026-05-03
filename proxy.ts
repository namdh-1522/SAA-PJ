import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'
import { parsePrelaunchEnd, isPrelaunchActive } from '@/lib/prelaunch/config'

const PRELAUNCH_ALLOWLIST = ['/prelaunch', '/auth/callback']

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  try {
    if (!url || !key) return false
    new URL(url)
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  // Prelaunch gate — runs before auth, keyed on NEXT_PUBLIC_PRELAUNCH_END
  const cutoff = parsePrelaunchEnd(process.env.NEXT_PUBLIC_PRELAUNCH_END)
  if (isPrelaunchActive(cutoff)) {
    if (!PRELAUNCH_ALLOWLIST.includes(pathname)) {
      return NextResponse.rewrite(new URL('/prelaunch', request.url))
    }
  } else if (pathname === '/prelaunch') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isSupabaseConfigured()) {
    return response
  }

  const supabase = createMiddlewareClient(request, response)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && pathname !== '/' && pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (user && pathname === '/') {
    const postAuthUrl = process.env.NEXT_PUBLIC_POST_AUTH_URL ?? '/dashboard'
    return NextResponse.redirect(new URL(postAuthUrl, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
}
