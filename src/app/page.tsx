import { Metadata } from 'next'
import { getAllAlbums } from '@/lib/getArtistBySlug'
import HomeClient from './HomeClient'

// Revalide toutes les 5 minutes pour capter le changement d'album du jour
export const revalidate = 300

// ── Helper : charger l'artiste du jour côté serveur ──────────
function getArtistForDate(date?: string) {
  const today = new Date().toISOString().split('T')[0]

  const candidates = getAllAlbums()
    .filter(a => a.date <= today)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date)) // plus récent d'abord

  if (!candidates.length) return null

  if (date) {
    const match = candidates.find(a => a.date === date)
    if (match) return match.data
  }

  return candidates[0].data
}

// ── generateMetadata — dynamique par album ────────────────────
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ date?: string }> }
): Promise<Metadata> {
  const { date } = await searchParams
  const raw = getArtistForDate(date) as any
  if (!raw) return { title: 'DigCover — Album du jour' }

  const artistName = raw.artist?.name ?? raw.name ?? 'Artiste'
  const albumTitle = raw.featuredAlbum?.title ?? ''
  const albumYear  = raw.featuredAlbum?.year ?? ''
  const genres     = (raw.featuredAlbum?.genres ?? []).slice(0, 2).join(', ')
  const editorial  = (raw.editorial ?? [])[0] ?? ''
  const description = editorial.slice(0, 155) + (editorial.length > 155 ? '…' : '')
  const coverUrl   = raw.featuredAlbum?.coverUrl ?? ''

  const ogImage = coverUrl.startsWith('/')
    ? `https://digcover.fr${coverUrl}`
    : coverUrl

  const title = `${artistName} — ${albumTitle} (${albumYear})`

  return {
    title,
    description,
    openGraph: {
      title: `${artistName} — ${albumTitle}`,
      description,
      type: 'article',
      locale: 'fr_FR',
      siteName: 'DigCover',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 1200, alt: `Pochette de ${albumTitle} par ${artistName}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artistName} — ${albumTitle}`,
      description,
      images: ogImage ? [ogImage] : [],
    },
    other: {
      'music:musician': artistName,
      'music:release_date': String(albumYear),
      'music:genre': genres,
    },
  }
}

// ── Page — wrapper serveur ────────────────────────────────────
export default function Home() {
  return <HomeClient />
}