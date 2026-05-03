import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchSpotlightSunners } from '@/lib/kudos/queries'

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const hashtag = searchParams.get('hashtag')
  const dept = searchParams.get('dept')

  try {
    const sunners = await fetchSpotlightSunners(supabase, { hashtag, dept })
    return NextResponse.json(sunners)
  } catch {
    return NextResponse.json({ error: 'Failed to load spotlight sunners' }, { status: 500 })
  }
}
