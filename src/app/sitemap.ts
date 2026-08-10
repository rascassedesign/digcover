import { MetadataRoute } from 'next'
import { getAllAlbums } from '@/lib/getArtistBySlug'
import { SITE_URL } from '@/lib/site'

/**
 * ⚠️ Exclusion volontaire — /confidentialite et /support ne sont PAS listées ici.
 *
 * Ce sont les deux URL exigées par App Store Connect pour l'app iOS. Elles doivent
 * résoudre publiquement (le testeur Apple les ouvre pendant la revue) mais ne sont
 * communiquées que depuis l'App Store : aucune entrée de navigation, aucun lien
 * interne entrant, et donc aucune raison de les pousser à l'indexation — le profil
 * d'indexation du site est déjà fragile, deux pages fines n'y aideraient pas.
 *
 * Ce n'est pas un oubli de la checklist « nouvelle route → sitemap » : c'est le cas
 * d'exclusion que cette checklist prévoit. Ne pas les ajouter sans décision explicite.
 */
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