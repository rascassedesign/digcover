import { Metadata } from 'next'
import ArchiveClient from './ArchiveClient'

export const metadata: Metadata = {
  title: 'Archive — Tous les albums',
  description: 'Retrouvez tous les albums présentés par DigCover — un album par jour, une immersion dans l\'univers d\'un artiste.',
  openGraph: {
    title: 'Archive — DigCover',
    description: 'Tous les albums présentés par DigCover.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'DigCover',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archive — DigCover',
    description: 'Tous les albums présentés par DigCover.',
  },
}

export default function Archive() {
  return <ArchiveClient />
}
