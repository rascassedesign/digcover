import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    const dir = path.join(process.cwd(), 'data', 'artists')

    if (!fs.existsSync(dir)) {
      return NextResponse.json({ error: `Dossier introuvable : ${dir}` }, { status: 404 })
    }

    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json')
      .sort()
      .reverse()

    if (files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier JSON dans data/artists/' }, { status: 404 })
    }

    let targetFile = files[0]
    if (date) {
      const dateFile = `${date}.json`
      if (files.includes(dateFile)) targetFile = dateFile
    }

    const filePath = path.join(dir, targetFile)
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    const artist = {
      id:       raw.id       ?? '',
      number:   raw.number   ?? '001',
      name:     raw.artist?.name ?? raw.name ?? 'Artiste inconnu',
      meta:     raw.meta     ?? '',
      editorial: Array.isArray(raw.editorial) ? raw.editorial : [],

      featuredAlbum: {
        id:         raw.featuredAlbum?.id         ?? '',
        title:      raw.featuredAlbum?.title       ?? '',
        year:       raw.featuredAlbum?.year        ?? 0,
        type:       raw.featuredAlbum?.type        ?? 'Album',
        trackCount: raw.featuredAlbum?.trackCount  ?? 0,
        coverUrl:   raw.featuredAlbum?.coverUrl    ?? '',
      },

      discography: Array.isArray(raw.discography)
        ? raw.discography.map((d: Record<string, unknown>) => ({
            id:         d.id         ?? '',
            title:      d.title      ?? '',
            year:       d.year       ?? 0,
            type:       d.type       ?? 'Album',
            trackCount: d.trackCount ?? 0,
            coverUrl:   d.coverUrl   ?? '',
          }))
        : [],

      videoTitle:     raw.video?.title    ?? '',
      youtubeVideoId: raw.video?.youtubeId ?? '',

      streaming: [
        raw.streaming?.spotify      ? { platform: 'spotify',  label: 'Spotify',       url: raw.streaming.spotify,      logoSrc: '/logos/spotify.svg'       } : null,
        raw.streaming?.appleMusic   ? { platform: 'apple',    label: 'Apple Music',   url: raw.streaming.appleMusic,   logoSrc: '/logos/apple-music.svg'   } : null,
        raw.streaming?.deezer       ? { platform: 'deezer',   label: 'Deezer',        url: raw.streaming.deezer,       logoSrc: '/logos/deezer.svg'        } : null,
        raw.streaming?.youtubeMusic ? { platform: 'youtube',  label: 'YouTube Music', url: raw.streaming.youtubeMusic, logoSrc: '/logos/youtube-music.svg' } : null,
      ].filter(Boolean),

      vinylPartners: Array.isArray(raw.vinyl)
        ? raw.vinyl.map((v: Record<string, unknown>) => ({
            name:   String(v.shop   ?? ''),
            url:    String(v.url    ?? ''),
            format: v.format ? String(v.format) : undefined,
            logo:   v.logo   ? String(v.logo)   : undefined,
            color:  v.color  ? String(v.color)  : undefined,
          }))
        : [],
    }

    return NextResponse.json(artist)

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Erreur serveur', detail: message }, { status: 500 })
  }
}