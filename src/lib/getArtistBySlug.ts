import { ALBUMS, ALBUMS_BY_SLUG, type AlbumRecord } from './albums.generated';

export type { AlbumRecord, AlbumData } from './albums.generated';

export function getArtistBySlug(slug: string): AlbumRecord | null {
  return ALBUMS_BY_SLUG[slug] ?? null;
}

export function getAllSlugs(): string[] {
  return ALBUMS.map((a) => a.slug);
}

export function getAllAlbums(): readonly AlbumRecord[] {
  return ALBUMS;
}