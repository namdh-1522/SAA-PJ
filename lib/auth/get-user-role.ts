import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/home'

export async function getUserRole(): Promise<UserRole> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user
    if (!user) return 'user'
    const appRole = (user.app_metadata as { role?: string } | null)?.role
    const userRole = (user.user_metadata as { role?: string } | null)?.role
    const role = appRole ?? userRole
    return role === 'admin' ? 'admin' : 'user'
  } catch {
    return 'user'
  }
}
