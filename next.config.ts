/** next.config.ts */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'i.scdn.co',
      'is1-ssl.mzstatic.com',
      'e-cdns-images.dzcdn.net',
      'lh3.googleusercontent.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;",
          },
        ],
      },
    ]
  },
}

export default nextConfig