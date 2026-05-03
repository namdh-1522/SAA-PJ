import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchUserStats } from '@/lib/kudos/queries'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const stats = await fetchUserStats(supabase, user.id)
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
