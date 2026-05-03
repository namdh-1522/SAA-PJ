import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      // Google OAuth profile pictures (Sun* uses Google login)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Dicebear avatars used as seed/placeholder data in dev
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
