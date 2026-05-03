import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import AuthErrorBanner from '@/components/login/auth-error-banner'
import GoogleLoginButton from '@/components/login/google-login-button'
import LanguageSelector from '@/components/ui/language-selector'
import PostAuthRedirectStash from '@/components/login/post-auth-redirect-stash'

const postAuthUrl = process.env.NEXT_PUBLIC_POST_AUTH_URL ?? '/dashboard'

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  try {
    if (!url || !key) return false
    new URL(url)
    return true
  } catch {
    return false
  }
}

export default async function LoginPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect(postAuthUrl)
  }

  const t = await getTranslations('login')

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-dark)] overflow-hidden">
      <PostAuthRedirectStash />
      {/* Hero background image — exact Figma offset on desktop; cover+right on tablet/mobile */}
      <div className="absolute inset-0 z-0 login-hero-bg" />

      {/* Horizontal gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(90deg, #00101A 0%, #00101A 25.41%, transparent 100%)',
        }}
      />

      {/* Vertical gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(0deg, #00101A 22.48%, transparent 51.74%)',
        }}
      />

      {/* Header */}
      <Header>
        <LanguageSelector />
      </Header>

      {/* Main content — mobile-first: base px-4 (16px), md px-12 (48px), xl px-36 (144px) — aligns ROOT FURTHER + CTA with header logo per Figma */}
      <div className="absolute w-full z-[2] top-[88px] px-4 pt-20 pb-24 md:px-12 md:pt-24 xl:px-36">
        {/* Frame 487: brand logo + tagline/CTA block */}
        <div className="flex flex-col gap-[80px]">
          {/* Brand logo */}
          <div className="w-full h-[200px] sm:h-auto">
            <Image
              src="/assets/login/logos/root-further-logo.png"
              alt="Root Further — SAA 2025"
              width={451}
              height={200}
              priority
              className="object-contain max-w-[451px] md:max-w-[360px] sm:max-w-[280px] sm:w-full sm:h-auto"
            />
          </div>

          {/* Frame 550 — tagline + CTA */}
          <div className="flex flex-col gap-6 pl-4 sm:pl-0">
            <p
              className="text-[var(--color-text-primary)] w-[480px] font-bold text-[20px] leading-[40px] tracking-[0.5px] sm:w-full sm:text-base sm:leading-7 md:text-lg md:leading-9"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {t('tagline')}
            </p>

            <AuthErrorBanner />

            <div className="sm:w-full sm:max-w-[320px]">
              <GoogleLoginButton />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
