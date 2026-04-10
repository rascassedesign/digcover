import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSlugs, getArtistBySlug } from '@/lib/getArtistBySlug'
import AlbumClient from './AlbumClient'
export const dynamic = 'force-static'
export const dynamicParams = true

// ── Génération statique — une page par album ──────────────────
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

// ── Page serveur — wrapper ────────────────────────────────────
export default function AlbumPage({ params }: { params: { slug: string } }) {
  const result = getArtistBySlug(params.slug)
  if (!result) notFound()

  const { raw, date } = result

  // On passe les données brutes au composant client
  // via les query params de la home existante
  return <AlbumClient slug={params.slug} date={date} raw={raw} />
}
