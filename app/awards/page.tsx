import type { Metadata } from 'next'
import { getUserRole } from '@/lib/auth/get-user-role'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import HeaderNav from '@/components/ui/header-nav'
import HeaderControls from '@/components/ui/header-controls'
import FooterNav from '@/components/ui/footer-nav'
import HomepageMobileNav from '@/components/home/homepage-mobile-nav'
import KudosPromo from '@/components/home/kudos-promo'
import AwardsKeyvisual from '@/components/awards/awards-keyvisual'
import AwardsPageTitle from '@/components/awards/awards-page-title'
import AwardsList from '@/components/awards/awards-list'
import AwardsSideNav from '@/components/awards/awards-side-nav'
import PostAuthScroll from '@/components/awards/post-auth-scroll'
import { AWARDS } from '@/lib/awards'

export const metadata: Metadata = {
  title: 'Hệ thống giải thưởng SAA 2025 — Sun* Annual Awards',
  description: 'Tìm hiểu chi tiết hệ thống giải thưởng Sun* Annual Awards 2025',
}

export default async function AwardsPage() {
  const role = await getUserRole()
  const isAdmin = role === 'admin'

  let userEmail: string | undefined
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    userEmail = data?.user?.email
  } catch {
    userEmail = undefined
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-dark)] overflow-x-clip">
      <Header
        navSlot={<HeaderNav />}
        rightSlot={
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <HeaderControls isAdmin={isAdmin} userEmail={userEmail} />
            </div>
            <HomepageMobileNav isAdmin={isAdmin} />
          </div>
        }
      />

      <PostAuthScroll pathname="/awards" />
      <AwardsKeyvisual />

      <main className="relative z-[var(--z-main-content)]">
        {/* The keyvisual's `pb-16` already provides the breathing room above
            the title section, so the main container starts flush (no extra
            top padding) — matches the tighter gap shown in the Figma frame. */}
        <div className="px-4 md:px-12 xl:px-36 pb-24 flex flex-col gap-[120px]">
          <AwardsPageTitle />

          <div className="flex flex-col xl:flex-row gap-20">
            <AwardsSideNav awards={AWARDS} />
            <AwardsList awards={AWARDS} />
          </div>

          <KudosPromo />
        </div>
      </main>

      <Footer navSlot={<FooterNav />} />
    </div>
  )
}
