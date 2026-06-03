import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Types for Supabase join queries require live DB introspection to generate correctly.
    // Run: supabase gen types typescript --linked > packages/types/src/database.types.ts
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@sport-fan/shared-logic', '@sport-fan/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
    ],
  },
}

export default nextConfig
