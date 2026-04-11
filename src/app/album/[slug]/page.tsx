import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getAllSlugs } from '@/lib/getArtistBySlug';
import AlbumClient from './AlbumClient';

// Force le rendu 100 % statique au build, pas de fallback runtime.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllSlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = getArtistBySlug(slug);
  if (!album) return {};

  const data = album.data as Record<string, unknown>;
  const title = (data.title as string) ?? (data.album as string) ?? slug;
  const artist = (data.artist as string) ?? '';
  const description =
    (data.description as string) ??
    `${title}${artist ? ` — ${artist}` : ''}. Découverte musicale du ${album.date} sur DigCover.`;
  const cover = (data.cover as string) ?? (data.image as string) ?? undefined;

  const url = `https://digcover.fr/album/${slug}`;
  const fullTitle = artist ? `${title} — ${artist} | DigCover` : `${title} | DigCover`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'music.album',
      images: cover ? [{ url: cover }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = getArtistBySlug(slug);
  if (!album) notFound();

  const data = album.data as Record<string, unknown>;
  const title = (data.title as string) ?? (data.album as string) ?? slug;
  const artist = (data.artist as string) ?? '';
  const cover = (data.cover as string) ?? (data.image as string) ?? undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: title,
    byArtist: artist ? { '@type': 'MusicGroup', name: artist } : undefined,
    image: cover,
    url: `https://digcover.fr/album/${slug}`,
    datePublished: album.date,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlbumClient date={album.date} slug={slug} />
    </>
  );
}