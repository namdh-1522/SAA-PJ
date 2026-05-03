import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchHighlights } from '@/lib/kudos/queries'
import { KudosHighlightsQuerySchema } from '@/lib/kudos/schemas'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const parsed = KudosHighlightsQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  try {
    const highlights = await fetchHighlights(supabase, user.id, {
      hashtag: parsed.data.hashtag,
      dept: parsed.data.dept,
    })
    return NextResponse.json(highlights)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch highlights' }, { status: 500 })
  }
}
