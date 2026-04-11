import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/album/[slug]': ['./data/artists/**/*.json'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'coverartarchive.org' },
      { protocol: 'https', hostname: '*.coverartarchive.org' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'is1-ssl.mzstatic.com' },
      { protocol: 'https', hostname: 'e-cdns-images.dzcdn.net' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig