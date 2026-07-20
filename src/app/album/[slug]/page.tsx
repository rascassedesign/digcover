import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtistBySlug, getAllSlugs } from '@/lib/getArtistBySlug'
import { buildAlbumJsonLd } from '@/lib/buildAlbumJsonLd'
import { toArtist } from '@/lib/toArtist'
import AlbumExperience from '@/components/AlbumExperience'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const record = getArtistBySlug(slug)
  if (!record) return {}

  const raw = record.data as any
  const artistName = raw.artist?.name ?? ''
  const albumTitle = raw.featuredAlbum?.title ?? ''
  const albumYear  = raw.featuredAlbum?.year ?? ''
  const editorial  = (raw.editorial ?? [])[0] ?? ''
  const description = editorial.slice(0, 155) + (editorial.length > 155 ? '…' : '')
  const coverUrl   = raw.featuredAlbum?.coverUrl ?? ''

  return {
    title: `${artistName} — ${albumTitle} (${albumYear})`,
    description,
    alternates: {
      canonical: `/album/${slug}`,
    },
    openGraph: {
      title: `${artistName} — ${albumTitle}`,
      description,
      type: 'article',
      locale: 'fr_FR',
      siteName: 'DigCover',
      url: `/album/${slug}`,
      images: coverUrl
        ? [{ url: coverUrl, width: 1200, height: 1200, alt: `Pochette de ${albumTitle} par ${artistName}` }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artistName} — ${albumTitle}`,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  }
}

export default async function AlbumPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const record = getArtistBySlug(slug)
  if (!record) notFound()

  const artist = toArtist(record)
  const jsonLd = buildAlbumJsonLd(record)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlbumExperience artist={artist} showBackLink />
    </>
  )
}