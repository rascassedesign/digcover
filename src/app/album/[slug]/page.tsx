import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArtistsData, getArtistBySlug } from '@/lib/getArtistBySlug'
import AlbumClient from './AlbumClient'

// ── Typage local pour éviter les erreurs TypeScript ───────────
interface RawArtist {
  id: string
  number?: string
  publishedAt?: string
  artist?: { name?: string; origin?: string }
  featuredAlbum?: {
    id?: string
    title?: string
    year?: number
    label?: string
    genres?: string[]
    trackCount?: number
    type?: string
    coverUrl?: string
  }
  meta?: string
  editorial?: string[]
  video?: { title?: string; youtubeId?: string }
  streaming?: {
    spotify?: string
    appleMusic?: string
    deezer?: string
    youtubeMusic?: string
  }
  vinyl?: unknown[]
  discography?: unknown[]
}

// ── Génération statique au build ──────────────────────────────
export async function generateStaticParams() {
  const allArtists = getAllArtistsData()
  return allArtists.map(({ slug }) => ({ slug }))
}

// ── Métadonnées par album ─────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const result = getArtistBySlug(params.slug)
  if (!result) return { title: 'Album — DigCover' }

  const raw = result.raw as RawArtist
  const artistName  = raw.artist?.name ?? ''
  const albumTitle  = raw.featuredAlbum?.title ?? ''
  const albumYear   = raw.featuredAlbum?.year ?? ''
  const editorial   = raw.editorial ?? []
  const description = (editorial[0] ?? '').slice(0, 155) + ((editorial[0]?.length ?? 0) > 155 ? '…' : '')
  const coverUrl    = raw.featuredAlbum?.coverUrl ?? ''
  const ogImage     = coverUrl.startsWith('/') ? `https://digcover.fr${coverUrl}` : coverUrl

  return {
    title: `${artistName} — ${albumTitle} (${albumYear})`,
    description,
    openGraph: {
      title: `${artistName} — ${albumTitle}`,
      description,
      type: 'article',
      locale: 'fr_FR',
      siteName: 'DigCover',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 1200, alt: `Pochette de ${albumTitle}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artistName} — ${albumTitle}`,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

// ── Page statique ─────────────────────────────────────────────
export default function AlbumPage({ params }: { params: { slug: string } }) {
  const result = getArtistBySlug(params.slug)
  if (!result) notFound()

  const raw      = result.raw as RawArtist
  const { date } = result

  const coverUrl    = raw.featuredAlbum?.coverUrl ?? ''
  const ogImage     = coverUrl.startsWith('/') ? `https://digcover.fr${coverUrl}` : coverUrl
  const editorial   = raw.editorial ?? []

  // ── JSON-LD ──────────────────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    'name': `${raw.artist?.name} — ${raw.featuredAlbum?.title}`,
    'reviewBody': editorial.join(' '),
    'datePublished': date,
    'url': `https://digcover.fr/album/${params.slug}`,
    'author': {
      '@type': 'Organization',
      'name': 'DigCover',
      'url': 'https://digcover.fr',
    },
    'itemReviewed': {
      '@type': 'MusicAlbum',
      'name': raw.featuredAlbum?.title,
      'byArtist': {
        '@type': 'MusicGroup',
        'name': raw.artist?.name,
        'foundingLocation': raw.artist?.origin,
      },
      'datePublished': String(raw.featuredAlbum?.year ?? ''),
      'genre': (raw.featuredAlbum?.genres ?? []).join(', '),
      'numTracks': raw.featuredAlbum?.trackCount,
      'recordLabel': raw.featuredAlbum?.label,
      'image': ogImage,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlbumClient slug={params.slug} date={date} raw={result.raw} />
    </>
  )
}