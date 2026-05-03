import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/user-preferences'

export const SUPPORTED_LOCALES = ['vi', 'en']

export function resolveLocale(
  fromCookie: string | undefined,
  acceptLanguage: string | null,
): string {
  if (SUPPORTED_LOCALES.includes(fromCookie ?? '')) return fromCookie!
  const fromHeader = acceptLanguage?.split(',')[0]?.split('-')[0]
  if (SUPPORTED_LOCALES.includes(fromHeader ?? '')) return fromHeader!
  return 'vi'
}

// Bundle both message catalogues at build time so locale switches are synchronous
// (FR-014). Both modules ship in the initial JS payload — verified by bundle audit.
const messagesByLocale = {
  vi: () => import('../messages/vi.json'),
  en: () => import('../messages/en.json'),
} as const

export default getRequestConfig(async () => {
  // Priority chain (resolved 2026-04-27 / Q9 — see Language Dropdown spec):
  //   1. user_preferences.locale (DB-persisted, authenticated users only)
  //   2. NEXT_LOCALE cookie         (fast-path SSR mirror)
  //   3. Accept-Language header
  //   4. 'vi' default
  let locale: string | null = null

  try {
    const supabase = await createClient()
    locale = await getUserLocale(supabase)
  } catch {
    // No session / Supabase unreachable → fall through to cookie + header.
  }

  if (!locale) {
    const cookieStore = await cookies()
    const fromCookie = cookieStore.get('NEXT_LOCALE')?.value
    const acceptLang = (await headers()).get('accept-language')
    locale = resolveLocale(fromCookie, acceptLang)
  }

  const loader = messagesByLocale[locale as keyof typeof messagesByLocale] ?? messagesByLocale.vi
  return {
    locale,
    messages: (await loader()).default,
  }
})
