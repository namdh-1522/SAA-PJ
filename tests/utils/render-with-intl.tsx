import { render, type RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactElement } from 'react'
import viMessages from '@/messages/vi.json'
import enMessages from '@/messages/en.json'

type Locale = 'vi' | 'en'

const messagesByLocale: Record<Locale, Record<string, unknown>> = {
  vi: viMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
}

interface RenderWithIntlOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: Locale
  messages?: Record<string, unknown>
}

export function renderWithIntl(
  ui: ReactElement,
  { locale = 'vi', messages, ...options }: RenderWithIntlOptions = {},
) {
  return render(ui, {
    ...options,
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale={locale} messages={messages ?? messagesByLocale[locale]}>
        {children}
      </NextIntlClientProvider>
    ),
  })
}
