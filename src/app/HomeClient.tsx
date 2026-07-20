'use client'

import { useState, useEffect } from 'react'
import AlbumExperience from '@/components/AlbumExperience'
import type { Artist } from '@/types'

const Loading = () => (
  <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <p style={{
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.16em',
      color: 'rgba(241, 239, 232, 0.48)',
      textTransform: 'uppercase',
    }}>
      Chargement…
    </p>
  </main>
)

export default function HomeClient() {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [isFromArchive, setIsFromArchive] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dateParam = params.get('date')
    setIsFromArchive(!!dateParam)
    const today = dateParam ?? new Date().toISOString().split('T')[0]
    fetch(`/api/artist?date=${today}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => setArtist(d))
      .catch(() => fetch('/api/artist').then(r => r.json()).then(d => setArtist(d)))
  }, [])

  if (!artist || !artist.featuredAlbum) return <Loading />

  return <AlbumExperience artist={artist} showBackLink={isFromArchive} />
}