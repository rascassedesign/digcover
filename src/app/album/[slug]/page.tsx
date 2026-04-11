import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs, getArtistBySlug } from '@/lib/getArtistBySlug'
import AlbumClient from './AlbumClient'

// ── Génération statique + pages futures à la volée ────────────
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

// ── Métadonnées dynamiques par album ──────────────────────────
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const result = getArtistBySlug(params.slug)
  if (!result) return { title: 'Album — DigCover' }

  const { raw } = result
  const artistName = raw.artist?.name ?? ''
  const albumTitle = raw.featuredAlbum?.title ?? ''
  const albumYear  = raw.featuredAlbum?.year ?? ''
  const editorial  = (raw.editorial ?? [])[0] ?? ''
  const description = editorial.slice(0, 155) + (editorial.length > 155 ? '…' : '')
  const coverUrl   = raw.featuredAlbum?.coverUrl ?? ''
  const ogImage    = coverUrl.startsWith('/') ? `https://digcover.fr${coverUrl}` : coverUrl

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

// ── Page serveur ──────────────────────────────────────────────
export default function AlbumPage({ params }: { params: { slug: string } }) {
  const result = getArtistBySlug(params.slug)
  if (!result) notFound()

  const { raw, date } = result

  const coverUrl = raw.featuredAlbum?.coverUrl ?? ''
  const ogImage  = coverUrl.startsWith('/') ? `https://digcover.fr${coverUrl}` : coverUrl
  const editorial = (raw.editorial ?? []) as string[]

  // ── JSON-LD — données structurées pour Google et les IA ──────
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
      'genre': Array.isArray(raw.featuredAlbum?.genres)
        ? (raw.featuredAlbum.genres as string[]).join(', ')
        : '',
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
      <AlbumClient slug={params.slug} date={date} raw={raw} />
    </>
  )
}