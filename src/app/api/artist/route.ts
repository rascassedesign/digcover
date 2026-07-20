import { NextRequest, NextResponse } from 'next/server'
import { getAllAlbums } from '@/lib/getArtistBySlug'
import { toArtist } from '@/lib/toArtist'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    const today = new Date().toISOString().split('T')[0]

    const candidates = getAllAlbums()
      .filter(a => a.date <= today)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    if (!candidates.length) {
      return NextResponse.json({ error: 'Aucun album disponible' }, { status: 404 })
    }

    const record = (date && candidates.find(a => a.date === date)) || candidates[0]

    return NextResponse.json(toArtist(record))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Erreur serveur', detail: message }, { status: 500 })
  }
}