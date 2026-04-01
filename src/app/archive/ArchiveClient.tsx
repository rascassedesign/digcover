'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/useIsMobile'
import Nav from '@/components/Nav'
import { track } from '@vercel/analytics'
import Footer from '@/components/Footer'

interface ArchiveEntry {
  date: string
  number: string
  artistName: string
  albumTitle: string
  albumYear: number
  coverUrl: string
  meta: string
}

function extractDominantColor(imageUrl: string): Promise<[number,number,number] | null> {
  return new Promise(resolve => {
    const img = new Image()
    if (!imageUrl.startsWith('/')) img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const SIZE = 80
        const canvas = document.createElement('canvas')
        canvas.width = SIZE; canvas.height = SIZE
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }
        ctx.drawImage(img, 0, 0, SIZE, SIZE)
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE)
        const buckets = new Map<string, { rgb: [number,number,number], count: number }>()
        for (let i = 0; i < data.length; i += 4) {
          if (data[i+3] < 128) continue
          const r = Math.round(data[i]   / 20) * 20
          const g = Math.round(data[i+1] / 20) * 20
          const b = Math.round(data[i+2] / 20) * 20
          const br = (r+g+b)/3
          if (br < 20 || br > 235) continue
          const key = `${r},${g},${b}`
          const e = buckets.get(key)
          if (e) e.count++
          else buckets.set(key, { rgb:[r,g,b], count:1 })
        }
        const top = Array.from(buckets.values()).sort((a,b) => b.count - a.count)
        resolve(top.length ? top[0].rgb : null)
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = imageUrl
  })
}

function lighten(rgb: [number,number,number], amt: number): [number,number,number] {
  return rgb.map(c => Math.round(c + (255 - c) * amt)) as [number,number,number]
}
function toHex(r: number, g: number, b: number): string {
  return '#' + [r,g,b].map(c => Math.round(c).toString(16).padStart(2,'0')).join('')
}
function rgbToHsl(r: number, g: number, b: number): [number,number,number] {
  r/=255; g/=255; b/=255
  const max=Math.max(r,g,b), min=Math.min(r,g,b)
  let h=0, s=0; const l=(max+min)/2
  if(max!==min){
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min)
    switch(max){
      case r: h=((g-b)/d+(g<b?6:0))/6; break
      case g: h=((b-r)/d+2)/6; break
      case b: h=((r-g)/d+4)/6; break
    }
  }
  return [h*360, s*100, l*100]
}
function pickVibrant(palette: [number,number,number][]): string {
  const scored = palette.map(rgb => {
    const [,s,l] = rgbToHsl(...rgb)
    return { rgb, score: s * (1 - Math.abs(l - 55) / 55) }
  }).sort((a,b) => b.score - a.score)
  return toHex(...scored[0].rgb)
}

function applyArchiveTheme(color: [number,number,number]) {
  const root = document.documentElement
  const [ar,ag,ab] = color
  const [lr,lg,lb] = lighten(color, 0.88)
  const mid = lighten(color, 0.44)
  const contrast = pickVibrant([color, lighten(color, 0.3), lighten(color, 0.6)])
  root.style.setProperty('--theme-accent',     `${ar}, ${ag}, ${ab}`)
  root.style.setProperty('--theme-light',      `${lr}, ${lg}, ${lb}`)
  root.style.setProperty('--theme-mid',        `${mid[0]}, ${mid[1]}, ${mid[2]}`)
  root.style.setProperty('--theme-contrast',    contrast)
  root.style.setProperty('--theme-accent-hex',  toHex(ar, ag, ab))
  root.style.setProperty('--theme-light-hex',   toHex(lr, lg, lb))
}

function resetArchiveTheme() {
  const root = document.documentElement
  root.style.setProperty('--theme-accent',    '44, 44, 42')
  root.style.setProperty('--theme-light',     '241, 239, 232')
  root.style.setProperty('--theme-mid',       '200, 198, 190')
  root.style.setProperty('--theme-contrast',  '#2C2C2A')
  root.style.setProperty('--theme-accent-hex', '#2C2C2A')
  root.style.setProperty('--theme-light-hex',  '#F1EFE8')
}

const Loading = () => (
  <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.14em', color: '#888780', textTransform: 'uppercase' }}>
      Chargement…
    </p>
  </main>
)

interface CardProps {
  entry: ArchiveEntry
  onMouseEnter: () => void
  onMouseLeave: () => void
  isMobile: boolean
}

function ArchiveCard({ entry, onMouseEnter, onMouseLeave, isMobile }: CardProps) {
  const [hovered, setHovered] = useState(false)

  const formattedDate = new Date(entry.date + 'T12:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const parts = entry.meta.split(' · ')
  const genres = parts.slice(2, 4).join(' · ')

  return (
    <Link href={`/?date=${entry.date}`} onClick={() => track('archive_album_click', { artist: entry.artistName, album: entry.albumTitle, date: entry.date })} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => { setHovered(true); onMouseEnter() }}
        onMouseLeave={() => { setHovered(false); onMouseLeave() }}
        style={{
          border: hovered ? '1px solid rgba(var(--theme-accent), 0.5)' : '0.5px solid #D3D1C7',
          borderRadius: 16,
          background: hovered ? 'rgba(var(--theme-light), 0.6)' : '#FFFFFF',
          overflow: 'hidden', cursor: 'pointer',
          transition: 'background 0.3s, border-color 0.3s, transform 0.2s, box-shadow 0.2s',
          transform: hovered ? 'translateY(-3px)' : 'none',
          boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {/* Thumbnail */}
        <div style={{ height: 180, overflow: 'hidden', background: '#F0EDE8', position: 'relative' }}>
          <img
            src={entry.coverUrl}
            alt={entry.albumTitle}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          {entry.number && (
            <span style={{
              position: 'absolute', top: 10, left: 10,
              fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#fff', background: 'rgba(0,0,0,0.45)',
              padding: '3px 8px', borderRadius: 99, backdropFilter: 'blur(4px)',
            }}>
              #{entry.number}
            </span>
          )}
        </div>

        {/* Texte */}
        <div style={{ padding: '14px 20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Nom artiste : 20 → 24px */}
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: isMobile ? 18 : 24, fontWeight: 800,
            lineHeight: 1, color: '#2C2C2A', letterSpacing: '-0.005em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {entry.artistName}
          </p>
          {/* Titre album : 13 → 16px */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: isMobile ? 14 : 16, color: '#444441', lineHeight: 1.4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {entry.albumTitle}
          </p>
          {/* Genres + date : 11 → 12 → 16px */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#888780', lineHeight: 1.4 }}>
            {genres && `${genres} · `}{formattedDate}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function ArchiveClient() {
  const isMobile = useIsMobile(768)
  const [entries, setEntries] = useState<ArchiveEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [pageBg, setPageBg] = useState('#ffffff')
  const colorCache = useRef<Map<string, [number,number,number] | null>>(new Map())
  const px = isMobile ? 20 : 64

  useEffect(() => {
    resetArchiveTheme()
    return () => { resetArchiveTheme() }
  }, [])

  useEffect(() => {
    fetch('/api/archive')
      .then(r => r.json())
      .then(async (data: ArchiveEntry[]) => {
        setEntries(data)
        setLoading(false)
        for (const entry of data) {
          if (entry.coverUrl && !colorCache.current.has(entry.coverUrl)) {
            const color = await extractDominantColor(entry.coverUrl)
            colorCache.current.set(entry.coverUrl, color)
          }
        }
      })
      .catch(() => setLoading(false))
  }, [])

  const handleEnter = useCallback((coverUrl: string) => {
    const color = colorCache.current.get(coverUrl)
    if (color) {
      const [lr,lg,lb] = lighten(color, 0.88)
      setPageBg(`rgb(${lr},${lg},${lb})`)
      applyArchiveTheme(color)
    }
  }, [])

  const handleLeave = useCallback(() => {
    setPageBg('#ffffff')
    resetArchiveTheme()
  }, [])

  if (loading) return <Loading />

  return (
    <main style={{
      minHeight: '100vh',
      background: pageBg,
      transition: 'background 0.6s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <Nav activePage="archive" />

      {/* Header */}
      <section style={{ padding: isMobile ? '32px 20px 24px' : '48px 64px 32px' }}>
        {/* Kicker : 11 → 16px */}
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888780', marginBottom: 12,
        }}>
          Archive
        </p>
        {/* Titre : fixe à 84px desktop, 52px mobile */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 52 : 84,
          fontWeight: 900, lineHeight: 0.9, color: '#2C2C2A',
          letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          TOUS LES ALBUMS
        </h1>
        {/* Compteur : 14 → 20px */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: '#888780' }}>
          {entries.length} album{entries.length > 1 ? 's' : ''} présenté{entries.length > 1 ? 's' : ''}
        </p>
      </section>

      <div style={{ height: 1, background: 'rgba(var(--theme-accent), 0.6)', margin: `0 ${px}px`, transition: 'background 0.65s cubic-bezier(0.4,0,0.2,1)' }} />

      {/* Grille */}
      <section style={{ padding: `32px ${px}px 64px`, overflow: 'hidden' }}>
        {entries.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: '#888780', padding: '32px 0' }}>
            Aucun album dans l&apos;archive pour le moment.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: isMobile ? 12 : 20,
            width: '100%',
          }}>
            {entries.map(entry => (
              <ArchiveCard
                key={entry.date}
                entry={entry}
                onMouseEnter={() => handleEnter(entry.coverUrl)}
                onMouseLeave={handleLeave}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}