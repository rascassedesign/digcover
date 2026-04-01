// src/app/api/archive/route.ts
// Lit tous les JSON dans data/artists/ et retourne la liste triée

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'data', 'artists')

    if (!fs.existsSync(dir)) {
      return NextResponse.json([])
    }

    const today = new Date().toISOString().split('T')[0]

    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json')
      .filter(f => f.replace('.json', '') <= today) // uniquement les dates passées ou aujourd'hui
      .sort()
      .reverse() // plus récent en premier

    const entries = files.map(file => {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
        const date = file.replace('.json', '')

        return {
          date,
          number:     raw.number          ?? '',
          artistName: raw.artist?.name    ?? raw.name ?? '',
          albumTitle: raw.featuredAlbum?.title ?? '',
          albumYear:  raw.featuredAlbum?.year  ?? 0,
          coverUrl:   raw.featuredAlbum?.coverUrl ?? '',
          meta:       raw.meta ?? '',
        }
      } catch {
        return null
      }
    }).filter(Boolean)

    return NextResponse.json(entries)

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}