import { MetadataRoute } from 'next'
import { getAllAlbums } from '@/lib/getArtistBySlug'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const albumPages = getAllAlbums().map(album => ({
    url: `${SITE_URL}/album/${album.slug}`,
    lastModified: new Date(album.date),
    changeFrequency: 'never' as const,
    priority: 0.7,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...albumPages,
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}