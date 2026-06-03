import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@sport-fan/shared-logic', '@sport-fan/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
    ],
  },
}

export default nextConfig
