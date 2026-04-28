'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDarkColorTheme } from '@/hooks/useColorTheme'
import { useIsMobile } from '@/hooks/useIsMobile'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
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
  const isMobile = useIsMobile(768)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [pageUrl, setPageUrl] = useState('')
  const [copied, setCopied] = useState(false)
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
    setPageUrl(window.location.href)
  }, [])

  const coverUrl = artist?.featuredAlbum?.coverUrl ?? null
  useDarkColorTheme(coverUrl)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!artist || !artist.featuredAlbum) return <Loading />

  const { featuredAlbum, discography, streaming, vinylPartners, editorial } = artist

  const formattedDate = new Date(artist.publishedAt + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <main>
      <Nav activePage="home" />

      {/* HERO */}
      <section className="dc-hero">
        <div className="dc-hero-text">
          {isFromArchive && (
            <Link href="/archive" className="dc-hero-back-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"/>
              </svg>
              <span>Retour à l&apos;archive</span>
            </Link>
          )}
          <span className="dc-kicker">
            Album du jour
            <span className="dc-sep" />
            No. {artist.number}
          </span>
          <h1 className="dc-hero-title">{artist.name}</h1>
          <p className="dc-hero-album">{featuredAlbum.title}</p>
          <p className="dc-hero-meta">{artist.meta}</p>
        </div>
        <img
          src={featuredAlbum.coverUrl}
          alt={`Pochette de ${featuredAlbum.title}`}
          className="dc-hero-cover"
          crossOrigin="anonymous"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </section>

      {/* VIDEO */}
      <div className="dc-section">
        <div className="dc-video-card">
          <p className="dc-video-label">Un avant-goût de l&apos;album…</p>
          <iframe
            className="dc-video-frame"
            src={`https://www.youtube-nocookie.com/embed/${artist.youtubeVideoId}?rel=0&modestbranding=1`}
            title={artist.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <p className="dc-video-caption">{artist.videoTitle}</p>
        </div>
      </div>

      {/* STREAMING */}
      <section className="dc-stream-section">
        <p className="dc-stream-label">Écouter l&apos;album</p>
        <div className="dc-stream-buttons">
          {streaming.map(s => (
            <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="dc-stream-btn">
              <img
                src={s.logoSrc}
                alt={s.label}
                width={20}
                height={20}
                style={{ flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* EDITORIAL */}
      <div className="dc-section">
        <p className="dc-section-kicker">À propos</p>
        <div className="dc-editorial">
          {editorial.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* SHOPS */}
      {vinylPartners.length > 0 && (
        <section className="dc-shops">
          <p className="dc-section-kicker">Où acheter</p>
          {vinylPartners.map((shop, i) => (
            <div key={`${shop.name}-${i}`} className="dc-shop-row">
              <div className="dc-shop-info">
                <div className="dc-shop-logo-box">
                  {shop.logo ? (
                    <img src={shop.logo} alt={shop.name} />
                  ) : (
                    <span className="dc-shop-logo-fallback">{shop.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="dc-shop-name">{shop.name}</p>
                  {shop.format && <p className="dc-shop-format">{shop.format}</p>}
                </div>
              </div>
              <a href={shop.url} target="_blank" rel="noopener noreferrer" className="dc-shop-cta">
                Voir l&apos;offre
              </a>
            </div>
          ))}
        </section>
      )}

      {/* DISCOGRAPHIE */}
      <section className="dc-discography">
        <p className="dc-section-kicker">Discographie</p>
        {discography.map((album, i) => (
          <div key={album.id ?? i} className="dc-disco-row">
            <div className="dc-disco-info">
              <img
                src={album.coverUrl}
                alt={album.title ?? ''}
                className="dc-disco-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.background = 'rgba(241, 239, 232, 0.08)'
                  t.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                }}
              />
              <div>
                <div className="dc-disco-title">{album.title}</div>
                <div className="dc-disco-meta">{album.type} · {album.trackCount} titres</div>
              </div>
            </div>
            <span className="dc-disco-year">{album.year}</span>
          </div>
        ))}
      </section>

      {/* SHARE */}
      <section className="dc-share">
        <span className="dc-share-label">Partager :</span>
        <button onClick={handleCopyLink} className="dc-share-btn">
          🔗 {copied ? 'Lien copié !' : 'Copier le lien'}
        </button>
      </section>

      <Footer />
    </main>
  )
}
