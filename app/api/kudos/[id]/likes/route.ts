import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = { params: Promise<{ id: string }> }

async function getHeartWeight(supabase: Awaited<ReturnType<typeof createClient>>): Promise<1 | 2> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('special_days')
    .select('heart_weight')
    .eq('event_date', today)
    .maybeSingle()
  return (data?.heart_weight === 2 ? 2 : 1) as 1 | 2
}

async function getHeartCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  kudosId: string
): Promise<number> {
  const { data } = await supabase
    .from('hearts')
    .select('weight')
    .eq('kudos_id', kudosId)
  return (data ?? []).reduce((sum, r) => sum + (r.weight as number), 0)
}

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: kudosId } = await params

  // Verify the kudo exists and sender ≠ current user
  const { data: kudo, error: fetchErr } = await supabase
    .from('kudos')
    .select('sender_id')
    .eq('id', kudosId)
    .single()
  if (fetchErr || !kudo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (kudo.sender_id === user.id) {
    return NextResponse.json({ error: 'Cannot heart your own kudos' }, { status: 403 })
  }

  const weight = await getHeartWeight(supabase)
  const { error: insertErr } = await supabase
    .from('hearts')
    .insert({ kudos_id: kudosId, user_id: user.id, weight })
  if (insertErr) {
    if (insertErr.code === '23505') {
      return NextResponse.json({ error: 'Already liked' }, { status: 409 })
    }
    throw insertErr
  }

  const totalHearts = await getHeartCount(supabase, kudosId)
  return NextResponse.json({ weight, totalHearts, hasHearted: true }, { status: 201 })
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: kudosId } = await params

  // Fetch the existing heart to get its weight for client-side cache correction
  const { data: existing, error: selectErr } = await supabase
    .from('hearts')
    .select('weight')
    .eq('kudos_id', kudosId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (selectErr) throw selectErr

  const weight = ((existing as { weight?: number } | null)?.weight ?? 1) as 1 | 2

  const { error: deleteErr } = await supabase
    .from('hearts')
    .delete()
    .eq('kudos_id', kudosId)
    .eq('user_id', user.id)
  if (deleteErr) throw deleteErr

  const totalHearts = await getHeartCount(supabase, kudosId)
  return NextResponse.json({ weight, totalHearts, hasHearted: false })
}
