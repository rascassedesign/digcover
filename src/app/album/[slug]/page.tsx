import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArtistBySlug, getAllSlugs } from '@/lib/getArtistBySlug'
import { buildAlbumJsonLd } from '@/lib/buildAlbumJsonLd'
import './album.css'

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
      canonical: `/album/${slug}`, // résolu en absolu via metadataBase
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

const STREAMING_LABELS: Record<string, string> = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  deezer: 'Deezer',
  youtubeMusic: 'YouTube Music',
}

export default async function AlbumPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const record = getArtistBySlug(slug)
  if (!record) notFound()

  const raw = record.data as any
  const artistName = raw.artist?.name ?? ''
  const origin     = raw.artist?.origin ?? ''
  const album      = raw.featuredAlbum ?? {}
  const editorial: string[] = raw.editorial ?? []
  const streaming: Record<string, string> = raw.streaming ?? {}
  const vinyl: { shop: string; url: string; format: string }[] = raw.vinyl ?? []
  const video = raw.video ?? null
  const number = raw.number ?? ''

  const formattedDate = new Date(record.date + 'T12:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const jsonLd = buildAlbumJsonLd(record)

  return (
    <main className="dc-album">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="dc-album-header">
          <p className="dc-album-kicker">
            {number && <>#{number} · </>}Album du {formattedDate}
          </p>
          <h1 className="dc-album-h1">
            {artistName} — {album.title}
          </h1>
          <p className="dc-album-meta">
            {[album.year, album.label, (album.genres ?? []).join(' · '), origin]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </header>

        {album.coverUrl && (
          <figure className="dc-album-cover">
            <img
              src={album.coverUrl}
              alt={`Pochette de ${album.title} par ${artistName}`}
              width={1200}
              height={1200}
            />
          </figure>
        )}

        <section className="dc-album-editorial">
          {editorial.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        {video?.youtubeId && (
          <section className="dc-album-video">
            <h2>À regarder</h2>
            <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
              {video.title ?? 'Voir le clip sur YouTube'}
            </a>
          </section>
        )}

        {Object.keys(streaming).length > 0 && (
          <section className="dc-album-streaming">
            <h2>Écouter</h2>
            <ul>
              {Object.entries(streaming).map(([key, url]) => (
                <li key={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {STREAMING_LABELS[key] ?? key}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {vinyl.length > 0 && (
          <section className="dc-album-shops">
            <h2>Acheter</h2>
            <ul>
              {vinyl.map((item, i) => (
                <li key={i}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.shop} — {item.format}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="dc-album-footer">
          <Link href={`/?date=${record.date}`}>
            Vivre cet album sur DigCover
          </Link>
          <Link href="/archive">Tous les albums</Link>
        </footer>
      </article>
    </main>
  )
}