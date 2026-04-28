'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { applyDarkTheme, resetDarkTheme } from '@/hooks/useColorTheme'
import './archive.css'

interface ArchiveEntry {
  date: string
  number: string
  artistName: string
  albumTitle: string
  albumYear: number
  coverUrl: string
  meta: string
}

// Couleur d'accent par défaut Archives (saumon doux)
const ARCHIVE_DEFAULT_ACCENT: [number, number, number] = [232, 168, 124]

// Extraction couleur — version simplifiée, retourne le RGB dominant
function extractDominantColor(imageUrl: string): Promise<[number, number, number] | null> {
  return new Promise(resolve => {
    const img = new Image()
    if (!imageUrl.startsWith('/')) img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const SIZE = 80
        const canvas = document.createElement('canvas')
        canvas.width = SIZE
        canvas.height = SIZE
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }
        ctx.drawImage(img, 0, 0, SIZE, SIZE)
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE)
        const buckets = new Map<string, { rgb: [number, number, number]; count: number }>()
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue
          const r = Math.round(data[i] / 20) * 20
          const g = Math.round(data[i + 1] / 20) * 20
          const b = Math.round(data[i + 2] / 20) * 20
          const br = (r + g + b) / 3
          if (br < 20 || br > 235) continue
          const key = `${r},${g},${b}`
          const e = buckets.get(key)
          if (e) e.count++
          else buckets.set(key, { rgb: [r, g, b], count: 1 })
        }
        const top = Array.from(buckets.values()).sort((a, b) => b.count - a.count)
        resolve(top.length ? top[0].rgb : null)
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = imageUrl
  })
}

interface CardProps {
  entry: ArchiveEntry
  onMouseEnter: () => void
  onMouseLeave: () => void
  index: number
}

function ArchiveCard({ entry, onMouseEnter, onMouseLeave, index }: CardProps) {
  const [hovered, setHovered] = useState(false)

  const formattedDate = new Date(entry.date + 'T12:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const parts = entry.meta.split(' · ')
  const genres = parts.slice(2, 4).join(' · ')

  return (
    <Link
      href={`/?date=${entry.date}`}
      className="dc-archive-card-link"
      style={{ ['--card-index' as string]: index }}
    >
      <div
        className={`dc-archive-card ${hovered ? 'is-hovered' : ''}`}
        onMouseEnter={() => {
          setHovered(true)
          onMouseEnter()
        }}
        onMouseLeave={() => {
          setHovered(false)
          onMouseLeave()
        }}
      >
        <div className="dc-archive-thumb">
          <img
            src={entry.coverUrl}
            alt={entry.albumTitle}
            onError={e => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          {entry.number && <span className="dc-archive-number">#{entry.number}</span>}
        </div>

        <div className="dc-archive-meta">
          <p className="dc-archive-artist">{entry.artistName}</p>
          <p className="dc-archive-title">{entry.albumTitle}</p>
          <p className="dc-archive-genres">
            {genres && `${genres} · `}
            {formattedDate}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function ArchiveClient() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([])
  const [loading, setLoading] = useState(true)
  const colorCache = useRef<Map<string, [number, number, number] | null>>(new Map())

  // Init thème dark par défaut + cleanup au démontage
  useEffect(() => {
    requestAnimationFrame(() => applyDarkTheme(ARCHIVE_DEFAULT_ACCENT))
    return () => {
      resetDarkTheme()
    }
  }, [])

  // Chargement des entrées + précalcul des couleurs en arrière-plan
  useEffect(() => {
    fetch('/api/archive')
      .then(r => r.json())
      .then(async (data: ArchiveEntry[]) => {
        setEntries(data)
        setLoading(false)
        // Précalcul async des couleurs dominantes
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
      applyDarkTheme(color)
    }
  }, [])

  const handleLeave = useCallback(() => {
    applyDarkTheme(ARCHIVE_DEFAULT_ACCENT)
  }, [])

  if (loading) {
    return (
      <main>
        <Nav activePage="archive" />
        <div className="dc-archive-loading">
          <p>Chargement…</p>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Nav activePage="archive" />

      {/* Header */}
      <section className="dc-archive-header">
        <p className="dc-archive-kicker">Archive</p>
        <h1 className="dc-archive-h1">Tous les albums</h1>
      </section>

      {/* Compteur en pill bordered */}
      <section className="dc-archive-counter-wrapper">
        <span className="dc-archive-counter">
          {entries.length} album{entries.length > 1 ? 's' : ''} présenté{entries.length > 1 ? 's' : ''}
        </span>
      </section>

      {/* Grille */}
      <section className="dc-archive-grid-wrapper">
        {entries.length === 0 ? (
          <p className="dc-archive-empty">Aucun album dans l&apos;archive pour le moment.</p>
        ) : (
          <div className="dc-archive-grid">
            {entries.map((entry, index) => (
              <ArchiveCard
                key={entry.date}
                entry={entry}
                index={index}
                onMouseEnter={() => handleEnter(entry.coverUrl)}
                onMouseLeave={handleLeave}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
