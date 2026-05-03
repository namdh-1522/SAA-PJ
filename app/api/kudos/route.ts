import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { KudosFeedQuerySchema, KudosCreateBodySchema } from '@/lib/kudos/schemas'
import { fetchKudosFeed, createKudo } from '@/lib/kudos/queries'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = KudosFeedQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )
  if (!parsed.success) {
    return NextResponse.json({ error: 'Bad request', issues: parsed.error.issues }, { status: 400 })
  }

  const { page, hashtag, dept } = parsed.data
  const result = await fetchKudosFeed(supabase, user.id, { page, hashtag, dept })
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = KudosCreateBodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Bad request', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  // Reject self-kudos at the API layer (DB also enforces via CHECK constraint, but a 400 is friendlier than 500).
  if (parsed.data.receiverId === user.id) {
    return NextResponse.json({ error: 'Cannot send a Kudo to yourself' }, { status: 400 })
  }

  try {
    const result = await createKudo(supabase, user.id, parsed.data)
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    // Surface enough detail on the server so dev/CI logs pinpoint schema/RLS errors.
    // PostgrestError carries `code`/`details`/`hint`; keep them out of the response body
    // (avoid leaking internals to the client) but log them server-side.
    const pgErr = err as { message?: string; code?: string; details?: string; hint?: string }
    console.error('[POST /api/kudos] createKudo failed:', {
      message: pgErr?.message,
      code: pgErr?.code,
      details: pgErr?.details,
      hint: pgErr?.hint,
    })
    return NextResponse.json(
      { error: 'Create failed', code: pgErr?.code ?? null },
      { status: 500 }
    )
  }
}
