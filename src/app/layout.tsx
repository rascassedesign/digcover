import type { Metadata } from 'next'
import { Barlow_Condensed, Hanken_Grotesk } from 'next/font/google'
import './globals.css'

// ── Fonts chargées côté serveur ─────────────────────────────
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display-loaded',
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body-loaded',
  display: 'swap',
})

// ── Métadonnées par défaut ──────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'DiscCover — Album du jour',
    template: '%s | DiscCover',
  },
  description: 'Un album par jour. Une immersion visuelle et sonore dans l\'univers d\'un artiste.',
  metadataBase: new URL('https://disccover.fr'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'DiscCover',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${barlowCondensed.variable} ${hankenGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}