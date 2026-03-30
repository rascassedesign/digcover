import { Metadata } from 'next'
import ArchiveClient from './ArchiveClient'

export const metadata: Metadata = {
  title: 'Archive — Tous les albums',
  description: 'Retrouvez tous les albums présentés par DiscCover — un album par jour, une immersion dans l\'univers d\'un artiste.',
  openGraph: {
    title: 'Archive — DiscCover',
    description: 'Tous les albums présentés par DiscCover.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'DiscCover',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archive — DiscCover',
    description: 'Tous les albums présentés par DiscCover.',
  },
}

export default function Archive() {
  return <ArchiveClient />
}