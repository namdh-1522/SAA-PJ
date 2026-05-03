import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/auth/ensure-profile'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const error = searchParams.get('error')
  const code = searchParams.get('code')

  if (error === 'access_denied') {
    return NextResponse.redirect(`${origin}/`)
  }

  if (error) {
    return NextResponse.redirect(`${origin}/?auth_error=true`)
  }

  if (code) {
    const supabase = await createClient()
    const { data: exchangeData, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      // Sync the `profiles` row from Google OAuth metadata (full_name,
      // avatar_url) and auto-assign DEFAULT_DEPARTMENT_CODE for first-time
      // logins so the Kudos board never renders with an empty avatar/name.
      // Errors are swallowed inside `ensureProfile` so a transient DB issue
      // won't break the login redirect — the kudos page also calls it as a
      // back-fill.
      const user = exchangeData?.user ?? null
      if (user) {
        await ensureProfile(supabase, user)
      }
      const postAuthUrl = process.env.NEXT_PUBLIC_POST_AUTH_URL ?? '/dashboard'
      return NextResponse.redirect(`${origin}${postAuthUrl}`)
    }
    return NextResponse.redirect(`${origin}/?auth_error=true`)
  }

  return NextResponse.redirect(`${origin}/?auth_error=true`)
}
