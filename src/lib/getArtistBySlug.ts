import fs from 'fs'
import path from 'path'

// Essaie plusieurs chemins selon l'environnement (local vs Vercel)
function getArtistsDir(): string {
  const candidates = [
    path.join(process.cwd(), 'data', 'artists'),
    path.resolve('./data/artists'),
    path.join(__dirname, '../../../../data/artists'),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir
  }
  return path.join(process.cwd(), 'data', 'artists')
}

export function getAllArtistsData(): Array<{ slug: string; raw: Record<string, unknown>; date: string }> {
  try {
    const dir = getArtistsDir()
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json')
      .map(file => {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
          if (!raw.id) return null
          return { slug: raw.id as string, raw, date: file.replace('.json', '') }
        } catch { return null }
      })
      .filter(Boolean) as Array<{ slug: string; raw: Record<string, unknown>; date: string }>
  } catch { return [] }
}

export function getAllSlugs(): string[] {
  return getAllArtistsData().map(a => a.slug)
}

export function getArtistBySlug(slug: string) {
  const all = getAllArtistsData()
  return all.find(a => a.slug === slug) ?? null
}