import type { Metadata } from 'next'
import { getUserRole } from '@/lib/auth/get-user-role'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import HeaderNav from '@/components/ui/header-nav'
import HeaderControls from '@/components/ui/header-controls'
import FooterNav from '@/components/ui/footer-nav'
import HomepageMobileNav from '@/components/home/homepage-mobile-nav'
import HeroSection from '@/components/home/hero-section'
import AboutBody from '@/components/home/about-body'
import AwardsSection from '@/components/home/awards-section'
import KudosPromo from '@/components/home/kudos-promo'
import WidgetButton from '@/components/home/widget-button'

export const metadata: Metadata = {
  title: 'About SAA 2025 — Sun* Annual Awards',
  description: 'Root Further — Sun* Annual Awards 2025',
}

export default async function HomepageSAA() {
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
    <div className="relative min-h-screen bg-[var(--color-bg-dark)] overflow-x-hidden">
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

      {/* Page-level decorative hero BG: 1100px tall, behind everything.
          Decoupled from hero-content sizing so it can show the FULL artwork (per Figma's 1392px keyvisual)
          without forcing the hero <section> tall and creating an empty gap before AboutBody. */}
      <div className="absolute inset-x-0 top-0 h-[1100px] z-[var(--z-hero-bg)] home-hero-bg pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-[1100px] z-[var(--z-hero-overlay)] hero-overlay-h pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-[1100px] z-[var(--z-hero-overlay)] hero-overlay-v pointer-events-none" aria-hidden="true" />

      <main className="relative z-[var(--z-main-content)] flex flex-col">
        <HeroSection eventStartISO={process.env.NEXT_PUBLIC_SAA_EVENT_START} />

        {/* Body sections — padded container */}
        <div className="px-4 md:px-12 xl:px-36 flex flex-col gap-[80px] md:gap-[120px] pt-[40px] md:pt-[60px] pb-24">
          <AboutBody />
          <AwardsSection />
          <KudosPromo />
        </div>
      </main>

      <WidgetButton />

      <Footer navSlot={<FooterNav />} />
    </div>
  )
}
