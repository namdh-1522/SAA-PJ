import type { SupabaseClient } from '@supabase/supabase-js'
import { localeSchema, type Locale } from '@/lib/validators/locale'

export async function getUserLocale(
  supabase: SupabaseClient,
): Promise<Locale | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_preferences')
    .select('locale')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !data) return null
  const parsed = localeSchema.safeParse(data.locale)
  return parsed.success ? parsed.data : null
}

export async function upsertUserLocale(
  supabase: SupabaseClient,
  locale: Locale,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('upsertUserLocale: no authenticated user')

  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      { user_id: user.id, locale },
      { onConflict: 'user_id' },
    )
  if (error) throw error
}
