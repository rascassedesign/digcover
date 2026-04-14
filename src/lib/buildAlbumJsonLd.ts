import type { AlbumRecord } from './getArtistBySlug';

const SITE = 'https://digcover.fr';

type Artist = { name: string; origin?: string };
type FeaturedAlbum = {
  title: string;
  year?: number;
  label?: string;
  genres?: string[];
  trackCount?: number;
  coverUrl?: string;
};
type AlbumJson = {
  id: string;
  artist: Artist;
  featuredAlbum: FeaturedAlbum;
  editorial?: string[];
  publishedAt?: string;
};

function absUrl(p?: string): string | undefined {
  if (!p) return undefined;
  return p.startsWith('http') ? p : `${SITE}${p.startsWith('/') ? '' : '/'}${p}`;
}

export function getAlbumFields(album: AlbumRecord) {
  const d = album.data as unknown as AlbumJson;
  const url = `${SITE}/album/${album.slug}`;
  const description = d.editorial?.[0] ?? `${d.featuredAlbum.title} — ${d.artist.name}.`;
  return {
    url,
    title: d.featuredAlbum.title,
    artistName: d.artist.name,
    artistOrigin: d.artist.origin,
    year: d.featuredAlbum.year,
    label: d.featuredAlbum.label,
    genres: d.featuredAlbum.genres ?? [],
    trackCount: d.featuredAlbum.trackCount,
    cover: absUrl(d.featuredAlbum.coverUrl),
    editorial: d.editorial ?? [],
    publishedAt: d.publishedAt ?? album.date,
    description,
  };
}

export function buildAlbumJsonLd(album: AlbumRecord) {
  const f = getAlbumFields(album);

  const editorialBody = f.editorial.join('\n\n');

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    '@id': f.url,
    name: f.title,
    url: f.url,
    image: f.cover,
    description: f.description,
    datePublished: f.year ? String(f.year) : undefined,
    genre: f.genres.length ? f.genres : undefined,
    numTracks: f.trackCount,
    recordLabel: f.label ? { '@type': 'Organization', name: f.label } : undefined,
    byArtist: {
      '@type': 'MusicGroup',
      name: f.artistName,
      ...(f.artistOrigin ? { foundingLocation: f.artistOrigin } : {}),
    },
    review: editorialBody
      ? {
          '@type': 'Review',
          reviewBody: editorialBody,
          datePublished: f.publishedAt,
          author: { '@type': 'Organization', name: 'DigCover', url: SITE },
          itemReviewed: { '@type': 'MusicAlbum', name: f.title },
        }
      : undefined,
  };

  // Nettoie les clés undefined pour un JSON propre
  return JSON.parse(JSON.stringify(jsonLd));
}