import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchKudosTotal } from '@/lib/kudos/queries'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const total = await fetchKudosTotal(supabase)
    return NextResponse.json({ total })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch total' }, { status: 500 })
  }
}
