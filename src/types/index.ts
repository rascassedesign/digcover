// ─────────────────────────────────────────────
// types/index.ts — Discover
// ─────────────────────────────────────────────

export interface ColorTheme {
  /** Couleur dominante extraite de la pochette */
  accent: [number, number, number]
  /** Version très claire pour les fonds teintés */
  accentLight: [number, number, number]
  /** Version très sombre pour le texte sur fonds clairs */
  accentDark: [number, number, number]
  /** Couleur contrastante vive (remplace le #FFDE42 fixe) */
  contrast: string
}

export interface Album {
  id: string
  title: string
  year: number
  type: 'Album' | 'EP' | 'Single'
  trackCount: number
  coverUrl: string
}

export interface StreamingLink {
  platform: 'spotify' | 'apple' | 'deezer' | 'youtube'
  label: string
  url: string
  logoSrc: string
}

export interface VinylPartner {
  name: string
  url: string
}

export interface Artist {
  id: string
  /** Numéro du jour (ex: "001") */
  number: string
  publishedAt: string
  name: string
  /** Album mis en avant */
  featuredAlbum: Album
  /** Discographie complète */
  discography: Album[]
  /** Métadonnées de l'album en avant */
  meta: string            // ex: "2024 · Verve Records · Jazz · Folk · Pakistan"
  /** Texte éditorial — paragraphes */
  editorial: string[]
  /** Titre du dernier single pour la vidéo */
  videoTitle: string
  youtubeVideoId: string
  streaming: StreamingLink[]
  vinylPartners: VinylPartner[]
}
