// ─────────────────────────────────────────────
// lib/data.ts — Discover
// Chargement des données artiste du jour
// ─────────────────────────────────────────────
//
// Next.js lit les fichiers JSON au build time (generateStaticParams)
// OU à la demande (fetch + revalidate).
// Tu n'as pas besoin de base de données.

import type { Artist } from '@/types'

// ── Chargement de l'artiste du jour ──────────
//
// Next.js App Router : cette fonction tourne côté SERVEUR.
// Elle lit simplement le JSON du jour dans /data/artists/
//
export async function getArtistOfTheDay(): Promise<Artist> {
  const today = getTodayDate()

  try {
    // Charge le JSON du jour
    const data = await import(`../../data/artists/${today}.json`)
    return transformJson(data.default ?? data)
  } catch {
    // Si pas de fichier aujourd'hui → charge le dernier disponible
    console.warn(`Pas de fichier pour ${today}, chargement du dernier disponible`)
    return getLatestArtist()
  }
}

// ── Chargement de l'artiste par date ─────────
export async function getArtistByDate(date: string): Promise<Artist | null> {
  try {
    const data = await import(`../../data/artists/${date}.json`)
    return transformJson(data.default ?? data)
  } catch {
    return null
  }
}

// ── Liste de tous les artistes (archive) ─────
export async function getAllArtists(): Promise<{ date: string; artist: string; album: string }[]> {
  const index = await import('../../data/index.json')
  return (index.default ?? index) as { date: string; artist: string; album: string }[]
}

// ── Dernier artiste disponible ───────────────
async function getLatestArtist(): Promise<Artist> {
  const index = await getAllArtists()
  const latest = index[0] // index.json est trié du plus récent au plus vieux
  const data = await import(`../../data/artists/${latest.date}.json`)
  return transformJson(data.default ?? data)
}

// ── Date du jour au format YYYY-MM-DD ────────
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

// ── Transforme le JSON brut en type Artist ───
// (Le JSON est volontairement simple à écrire,
//  la transformation le "complète" pour le code)
function transformJson(raw: Record<string, unknown>): Artist {
  const album = raw.featuredAlbum as Record<string, unknown>
  const video = raw.video as Record<string, unknown>
  const streaming = raw.streaming as Record<string, string>
  const vinyl = (raw.vinyl as Array<Record<string, string>>) ?? []

  return {
    id: raw.id as string,
    number: raw.number as string,
    name: (raw.artist as Record<string, string>).name,
    meta: raw.meta as string,
    editorial: raw.editorial as string[],

    featuredAlbum: {
      id: album.id as string,
      title: album.title as string,
      year: album.year as number,
      type: album.type as 'Album' | 'EP' | 'Single',
      trackCount: album.trackCount as number,
      coverUrl: album.coverUrl as string,
    },

    discography: ((raw.discography as Array<Record<string, unknown>>) ?? []).map((d) => ({
      id: d.id as string,
      title: d.title as string,
      year: d.year as number,
      type: d.type as 'Album' | 'EP' | 'Single',
      trackCount: d.trackCount as number,
      coverUrl: d.coverUrl as string,
    })),

    videoTitle: video.title as string,
    youtubeVideoId: video.youtubeId as string,

    streaming: [
      streaming.spotify      && { platform: 'spotify'  as const, label: 'Spotify',       url: streaming.spotify,      logoSrc: '/logos/spotify.svg'       },
      streaming.appleMusic   && { platform: 'apple'    as const, label: 'Apple Music',   url: streaming.appleMusic,   logoSrc: '/logos/apple-music.svg'   },
      streaming.deezer       && { platform: 'deezer'   as const, label: 'Deezer',        url: streaming.deezer,       logoSrc: '/logos/deezer.svg'        },
      streaming.youtubeMusic && { platform: 'youtube'  as const, label: 'YouTube Music', url: streaming.youtubeMusic, logoSrc: '/logos/youtube-music.svg' },
    ].filter(Boolean) as Artist['streaming'],

    vinylPartners: vinyl.map((v) => ({
      name: v.shop,
      url: v.url,
    })),
  }
}
