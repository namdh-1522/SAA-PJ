import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SunnerSearchQuerySchema } from '@/lib/kudos/schemas'

// Escape PostgreSQL ILIKE wildcard metacharacters so a user typing `50%_off`
// matches that literal string instead of "any 1+ chars + any single char + off".
function escapeIlike(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const parsed = SunnerSearchQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const { q } = parsed.data
  if (!q) return NextResponse.json([])

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, department_code')
    .ilike('full_name', `%${escapeIlike(q)}%`)
    .limit(20)

  if (error) return NextResponse.json({ error: 'Search failed' }, { status: 500 })

  return NextResponse.json(
    (data ?? []).map((row) => ({
      id: row.id,
      name: row.full_name ?? '',
      avatarUrl: row.avatar_url ?? null,
      department: row.department_code ?? null,
    }))
  )
}
