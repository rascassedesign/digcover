import fs from 'fs'
import path from 'path'

const ARTISTS_DIR = path.resolve('./data/artists')

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTISTS_DIR)) return []
  return fs.readdirSync(ARTISTS_DIR)
    .filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json')
    .map(f => {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(ARTISTS_DIR, f), 'utf-8'))
        return raw.id ?? null
      } catch { return null }
    })
    .filter(Boolean) as string[]
}

export function getArtistBySlug(slug: string) {
  if (!fs.existsSync(ARTISTS_DIR)) return null
  const files = fs.readdirSync(ARTISTS_DIR)
    .filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json')

  for (const file of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(ARTISTS_DIR, file), 'utf-8'))
      if (raw.id === slug) return { raw, date: file.replace('.json', '') }
    } catch { continue }
  }
  return null
}
