import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { localeSchema } from '@/lib/validators/locale'
import { upsertUserLocale } from '@/lib/user-preferences'

export async function PUT(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = localeSchema.safeParse(
    typeof body === 'object' && body !== null && 'locale' in body
      ? (body as { locale: unknown }).locale
      : undefined,
  )
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await upsertUserLocale(supabase, parsed.data)
  } catch {
    return NextResponse.json({ error: 'Failed to persist locale' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
