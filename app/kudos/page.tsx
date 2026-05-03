import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth/get-user-role'
import { ensureProfile } from '@/lib/auth/ensure-profile'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import HeaderNav from '@/components/ui/header-nav'
import HeaderControls from '@/components/ui/header-controls'
import FooterNav from '@/components/ui/footer-nav'
import KudosLiveBoard from '@/components/kudos/KudosLiveBoard'
import type { KudosUser } from '@/types/kudos'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('kudos.meta')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function KudosPage() {
  // If Supabase isn't configured (e.g. dev env without keys), createServerClient
  // throws "Invalid supabaseUrl". Treat that the same as not-authenticated and
  // redirect to login — matches the middleware's `isSupabaseConfigured()` gate.
  let user
  let supabase
  try {
    supabase = await createClient()
    const result = await supabase.auth.getUser()
    user = result.data.user
  } catch {
    redirect('/')
  }

  if (!user || !supabase) redirect('/')

  // Back-fill `profiles` from Google OAuth metadata (full_name, avatar_url) and
  // assign `DEFAULT_DEPARTMENT_CODE` for first-time logins. The auth callback
  // is the canonical entry, but this defence-in-depth call covers users who
  // signed in before the helper shipped, or whose row was wiped by an admin.
  await ensureProfile(supabase, user)

  const role = await getUserRole()
  const isAdmin = role === 'admin'

  // Read the freshly-synced profile so the header avatar matches the kudos
  // board cards (both render off the `profiles` table now, not the OAuth
  // metadata directly — that way star_tier and admin-assigned departments
  // show up consistently).
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, department_code, star_tier')
    .eq('id', user.id)
    .maybeSingle()

  const profileRow = (profile ?? null) as {
    full_name: string | null
    avatar_url: string | null
    department_code: string | null
    star_tier: 1 | 2 | 3 | null
  } | null

  const currentUser: KudosUser = {
    id: user.id,
    name: profileRow?.full_name ?? user.user_metadata?.full_name ?? user.email ?? 'Sunner',
    email: user.email ?? '',
    avatarUrl: profileRow?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    department: profileRow?.department_code ?? null,
    starTier: profileRow?.star_tier ?? null,
  }

  return (
    <>
      <Header
        className="!bg-[var(--color-bg-header-kudos)]"
        navSlot={<HeaderNav />}
        rightSlot={<HeaderControls isAdmin={isAdmin} userEmail={currentUser.email} />}
      />
      <main className="pt-20">
        <KudosLiveBoard currentUser={currentUser} />
      </main>
      <Footer navSlot={<FooterNav />} />
    </>
  )
}
