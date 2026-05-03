import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchNextSecretBox } from '@/lib/kudos/queries'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const box = await fetchNextSecretBox(supabase, user.id)
    return NextResponse.json({ box })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch secret box' }, { status: 500 })
  }
}
