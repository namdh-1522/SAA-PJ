import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getUserLocale } from '@/lib/user-preferences'

export const SUPPORTED_LOCALES = ['vi', 'en']

/** First-time visitors (no cookie, no DB preference) ALWAYS land on Vietnamese
 *  — the project is Vietnamese-first, so a US/EN browser shouldn't auto-flip
 *  the UI before the user has a chance to pick. The `acceptLanguage` arg is
 *  intentionally NOT consulted; users opt into `en` via the language selector,
 *  which writes the `NEXT_LOCALE` cookie. */
export function resolveLocale(fromCookie: string | undefined): string {
  if (SUPPORTED_LOCALES.includes(fromCookie ?? '')) return fromCookie!
  return 'vi'
}

// Bundle both message catalogues at build time so locale switches are synchronous
// (FR-014). Both modules ship in the initial JS payload — verified by bundle audit.
const messagesByLocale = {
  vi: () => import('../messages/vi.json'),
  en: () => import('../messages/en.json'),
} as const

export default getRequestConfig(async () => {
  // Priority chain:
  //   1. user_preferences.locale  (DB-persisted, authenticated users only)
  //   2. NEXT_LOCALE cookie       (set by language selector after user picks)
  //   3. 'vi' default             (Vietnamese-first; Accept-Language is NOT consulted —
  //                                see resolveLocale for rationale)
  let locale: string | null = null

  try {
    const supabase = await createClient()
    locale = await getUserLocale(supabase)
  } catch {
    // No session / Supabase unreachable → fall through to cookie + default.
  }

  if (!locale) {
    const cookieStore = await cookies()
    const fromCookie = cookieStore.get('NEXT_LOCALE')?.value
    locale = resolveLocale(fromCookie)
  }

  const loader = messagesByLocale[locale as keyof typeof messagesByLocale] ?? messagesByLocale.vi
  return {
    locale,
    messages: (await loader()).default,
  }
})
