import { Metadata } from 'next'
import { getAllAlbums } from '@/lib/getArtistBySlug'
import ArchiveClient from './ArchiveClient'

// ISR : capte l'album du jour sans redéploiement (même logique que la home)
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Archive — Tous les albums',
  description: 'Retrouvez tous les albums présentés par DigCover — un album par jour, une immersion dans l\'univers d\'un artiste.',
  alternates: {
    canonical: '/archive',
  },
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

export default function ArchivePage() {
  const today = new Date().toISOString().split('T')[0]

  const entries = getAllAlbums()
    .filter(a => a.date <= today)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(a => {
      const raw = a.data as any
      return {
        date: a.date,
        slug: a.slug,
        number: raw.number ?? '',
        artistName: raw.artist?.name ?? '',
        albumTitle: raw.featuredAlbum?.title ?? '',
        albumYear: raw.featuredAlbum?.year ?? 0,
        coverUrl: raw.featuredAlbum?.coverUrl ?? '',
        meta: raw.meta ?? '',
      }
    })

  return <ArchiveClient entries={entries} />
}