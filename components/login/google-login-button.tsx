'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import GoogleIcon from '@/components/icons/google-icon'
import { createClient } from '@/lib/supabase/client'

export default function GoogleLoginButton() {
  const t = useTranslations('login')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleLogin() {
    if (!navigator.cookieEnabled) {
      setErrorMessage(t('error.cookies_required'))
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      setErrorMessage(t('error.oauth_failed'))
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        aria-label="Login with Google"
        className="flex items-center gap-1 w-[305px] h-[60px] px-[var(--spacing-btn-px)] py-[var(--spacing-btn-py)] bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-bg-hover)] active:bg-[var(--color-cta-bg-active)] rounded-[var(--radius-btn)] text-[var(--color-cta-text)] font-bold text-[22px] leading-[28px] cursor-pointer transition-[background-color] duration-150 ease-in-out disabled:opacity-70 disabled:cursor-wait disabled:pointer-events-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA9E]"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        <span className="flex-1 text-left">
          {t('cta')}
        </span>
        <GoogleIcon width={24} height={24} />
      </button>
    </div>
  )
}
