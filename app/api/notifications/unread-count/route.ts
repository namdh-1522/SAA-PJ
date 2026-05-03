import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// TODO(notifications): the `notifications` table is not yet defined in any
// migration (see supabase/migrations/). Until that schema lands this endpoint
// fails open and returns 0, so the header bell never blocks page render.
// Tracking: spec MaZUn5xHXZ-Sun-Kudos-Live-board (notifications phase).
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ count: 0 })

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('seen', false)

  if (error) return NextResponse.json({ count: 0 })
  return NextResponse.json({ count: count ?? 0 })
}
