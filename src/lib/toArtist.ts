import type { AlbumRecord } from './albums.generated'
import type { Artist } from '@/types'

export function toArtist(record: AlbumRecord): Artist {
  const raw = record.data as any

  return {
    id: raw.id ?? '',
    number: raw.number ?? '001',
    publishedAt: raw.publishedAt ?? '',
    name: raw.artist?.name ?? raw.name ?? 'Artiste inconnu',
    meta: raw.meta ?? '',
    editorial: Array.isArray(raw.editorial) ? raw.editorial : [],

    featuredAlbum: {
      id: raw.featuredAlbum?.id ?? '',
      title: raw.featuredAlbum?.title ?? '',
      year: raw.featuredAlbum?.year ?? 0,
      type: raw.featuredAlbum?.type ?? 'Album',
      trackCount: raw.featuredAlbum?.trackCount ?? 0,
      coverUrl: raw.featuredAlbum?.coverUrl ?? '',
    },

    discography: Array.isArray(raw.discography)
      ? raw.discography.map((d: Record<string, unknown>) => ({
          id: (d.id ?? '') as string,
          title: (d.title ?? '') as string,
          year: (d.year ?? 0) as number,
          type: (d.type ?? 'Album') as 'Album' | 'EP' | 'Single',
          trackCount: (d.trackCount ?? 0) as number,
          coverUrl: (d.coverUrl ?? '') as string,
        }))
      : [],

    videoTitle: raw.video?.title ?? '',
    youtubeVideoId: raw.video?.youtubeId ?? '',

    streaming: [
      raw.streaming?.spotify      ? { platform: 'spotify' as const,  label: 'Spotify',       url: raw.streaming.spotify,      logoSrc: '/logos/spotify.svg' }       : null,
      raw.streaming?.appleMusic   ? { platform: 'apple' as const,    label: 'Apple Music',   url: raw.streaming.appleMusic,   logoSrc: '/logos/apple-music.svg' }   : null,
      raw.streaming?.deezer       ? { platform: 'deezer' as const,   label: 'Deezer',        url: raw.streaming.deezer,       logoSrc: '/logos/deezer.svg' }        : null,
      raw.streaming?.youtubeMusic ? { platform: 'youtube' as const,  label: 'YouTube Music', url: raw.streaming.youtubeMusic, logoSrc: '/logos/youtube-music.svg' } : null,
    ].filter((s): s is NonNullable<typeof s> => s !== null),

    vinylPartners: Array.isArray(raw.vinyl)
      ? raw.vinyl.map((v: Record<string, unknown>) => ({
          name: String(v.shop ?? ''),
          url: String(v.url ?? ''),
          format: v.format ? String(v.format) : undefined,
          logo: v.logo ? String(v.logo) : undefined,
        }))
      : [],
  }
}