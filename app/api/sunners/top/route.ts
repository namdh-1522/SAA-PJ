import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { fetchTopSunners } from '@/lib/kudos/queries'
import { LEADERBOARD_LIMIT } from '@/lib/kudos/constants'

const TopSunnersQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v !== undefined ? parseInt(v, 10) : LEADERBOARD_LIMIT))
    .pipe(z.number().int().min(1).max(50)),
})

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const parsed = TopSunnersQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  try {
    const sunners = await fetchTopSunners(supabase, parsed.data.limit)
    return NextResponse.json(sunners)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch top sunners' }, { status: 500 })
  }
}
