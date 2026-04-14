import { MetadataRoute } from 'next'
import { getAllAlbums } from '@/lib/getArtistBySlug'

export default function sitemap(): MetadataRoute.Sitemap {
  const albumPages = getAllAlbums().map(album => ({
    url: `https://digcover.fr/album/${album.slug}`,
    lastModified: new Date(album.date),
    changeFrequency: 'never' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://digcover.fr',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://digcover.fr/archive',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...albumPages,
    {
      url: 'https://digcover.fr/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}