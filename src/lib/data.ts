import fs from 'fs'
import path from 'path'

export async function getAllArtists() {
  const dir = path.join(process.cwd(), 'data', 'artists')
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json')
    .sort()
    .reverse()

  return files.map(file => {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
    return {
      date: file.replace('.json', ''),
      artist: raw.artist?.name ?? '',
      album: raw.featuredAlbum?.title ?? '',
      coverUrl: raw.featuredAlbum?.coverUrl ?? '',
      number: raw.number ?? '001',
      meta: raw.meta ?? '',
    }
  })
}