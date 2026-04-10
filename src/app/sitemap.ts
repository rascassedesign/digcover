import { MetadataRoute } from 'next'
import { getAllSlugs, getArtistBySlug } from '@/lib/getArtistBySlug'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs()

  const albumPages = slugs.map(slug => {
    const result = getArtistBySlug(slug)
    const date = result?.date ?? '2026-01-01'
    return {
      url: `https://digcover.fr/album/${slug}`,
      lastModified: new Date(date),
      changeFrequency: 'never' as const,
      priority: 0.7,
    }
  })

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
  ]
}
