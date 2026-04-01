import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import HomeClient from './HomeClient'

// ── Helper : charger l'artiste du jour côté serveur ──────────
function getArtistForDate(date?: string) {
  try {
    const dir = path.join(process.cwd(), 'data', 'artists')
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json').sort().reverse()
    if (!files.length) return null
    const target = date && files.includes(`${date}.json`) ? `${date}.json` : files[0]
    return JSON.parse(fs.readFileSync(path.join(dir, target), 'utf-8'))
  } catch { return null }
}

// ── generateMetadata — dynamique par album ────────────────────
export async function generateMetadata(
  { searchParams }: { searchParams: { date?: string } }
): Promise<Metadata> {
  const raw = getArtistForDate(searchParams.date)
  if (!raw) return { title: 'DiscCover — Album du jour' }

  const artistName = raw.artist?.name ?? raw.name ?? 'Artiste'
  const albumTitle = raw.featuredAlbum?.title ?? ''
  const albumYear  = raw.featuredAlbum?.year ?? ''
  const genres     = (raw.featuredAlbum?.genres ?? []).slice(0, 2).join(', ')
  const editorial  = (raw.editorial ?? [])[0] ?? ''
  const description = editorial.slice(0, 155) + (editorial.length > 155 ? '…' : '')
  const coverUrl   = raw.featuredAlbum?.coverUrl ?? ''

  // OG image : pochette locale → URL absolue | Cover Art Archive → directement
  const ogImage = coverUrl.startsWith('/')
    ? `https://disccover.fr${coverUrl}`
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
      siteName: 'DiscCover',
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