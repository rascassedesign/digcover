import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlug, getAllSlugs } from '@/lib/getArtistBySlug';
import { buildAlbumJsonLd, getAlbumFields } from '@/lib/buildAlbumJsonLd';
import AlbumClient from './AlbumClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = getArtistBySlug(slug);
  if (!album) return {};

  const f = getAlbumFields(album);
  const fullTitle = `${f.title} — ${f.artistName} | DigCover`;

  return {
    title: fullTitle,
    description: f.description,
    alternates: { canonical: f.url },
    openGraph: {
      title: fullTitle,
      description: f.description,
      url: f.url,
      type: 'music.album',
      images: f.cover ? [{ url: f.cover }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: f.description,
      images: f.cover ? [f.cover] : undefined,
    },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = getArtistBySlug(slug);
  if (!album) notFound();

  const jsonLd = buildAlbumJsonLd(album);

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