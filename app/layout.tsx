import type { Metadata } from 'next'
import { Montserrat, Montserrat_Alternates } from 'next/font/google'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import QueryProvider from '@/components/providers/query-provider'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700'],
})

const montserratAlternates = Montserrat_Alternates({
  variable: '--font-montserrat-alt',
  subsets: ['latin', 'vietnamese'],
  weight: ['700'],
})

// DSEG7-Classic Bold — open-source LCD/7-segment display font (OFL license).
// Stand-in for the Figma "Digital Numbers" font (proprietary Style-7 family).
// Used by the Homepage hero countdown digits via var(--font-digital).
const digitalNumbers = localFont({
  src: '../public/fonts/DSEG7Classic-Bold.woff2',
  variable: '--font-digital',
  display: 'swap',
  weight: '700',
})

// TODO(T004): When SVN-Gotham.woff2 is delivered by brand/design, place it at
// public/fonts/svn-gotham/SVNGotham-Regular.woff2 and re-add the loader below:
//   const svnGotham = localFont({
//     src: '../public/fonts/svn-gotham/SVNGotham-Regular.woff2',
//     variable: '--font-svn-gotham',
//     display: 'swap',
//     weight: '400',
//   })
// Until then, KudosBoardHero falls back to `system-ui` via the CSS var() fallback.

export const metadata: Metadata = {
  title: 'SAA 2025 — Sun* Asia Awards',
  description: 'Root Further — Sun* Asia Awards 2025',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()

  const fontClasses = [
    montserrat.variable,
    montserratAlternates.variable,
    digitalNumbers.variable,
  ].join(' ')

  return (
    <html lang="vi" className={`${fontClasses} h-full`}>
      <body className="min-h-full">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
