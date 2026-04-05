'use client'

import { useState, useEffect } from 'react'
import { useColorTheme } from '@/hooks/useColorTheme'
import { useIsMobile } from '@/hooks/useIsMobile'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { Artist } from '@/types'

const IconLinkLine = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.0607 8.11097L14.4749 9.52518C17.2086 12.2589 17.2086 16.691 14.4749 19.4247L14.1214 19.7782C11.3877 22.5119 6.95555 22.5119 4.22188 19.7782C1.48821 17.0446 1.48821 12.6124 4.22188 9.87874L5.6361 11.293C3.68348 13.2456 3.68348 16.4114 5.6361 18.364C7.58872 20.3166 10.7545 20.3166 12.7072 18.364L13.0607 18.0105C15.0133 16.0578 15.0133 12.892 13.0607 10.9394L11.6465 9.52518L13.0607 8.11097ZM19.7782 14.1214L18.364 12.7072C20.3166 10.7545 20.3166 7.58872 18.364 5.6361C16.4114 3.68348 13.2456 3.68348 11.293 5.6361L10.9394 5.98965C8.98678 7.94227 8.98678 11.1081 10.9394 13.0607L12.3536 14.4749L10.9394 15.8891L9.52518 14.4749C6.79151 11.7413 6.79151 7.30911 9.52518 4.57544L9.87874 4.22188C12.6124 1.48821 17.0446 1.48821 19.7782 4.22188C22.5119 6.95555 22.5119 11.3877 19.7782 14.1214Z"/>
  </svg>
)
const IconLinkFill = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.0607 8.11097L14.4749 9.52518C17.2086 12.2589 17.2086 16.691 14.4749 19.4247L14.1214 19.7782C11.3877 22.5119 6.95555 22.5119 4.22188 19.7782C1.48821 17.0446 1.48821 12.6124 4.22188 9.87874L5.6361 11.293C3.68348 13.2456 3.68348 16.4114 5.6361 18.364C7.58872 20.3166 10.7545 20.3166 12.7072 18.364L13.0607 18.0105C15.0133 16.0578 15.0133 12.892 13.0607 10.9394L11.6465 9.52518L13.0607 8.11097ZM19.7782 14.1214L18.364 12.7072C20.3166 10.7545 20.3166 7.58872 18.364 5.6361C16.4114 3.68348 13.2456 3.68348 11.293 5.6361L10.9394 5.98965C8.98678 7.94227 8.98678 11.1081 10.9394 13.0607L12.3536 14.4749L10.9394 15.8891L9.52518 14.4749C6.79151 11.7413 6.79151 7.30911 9.52518 4.57544L9.87874 4.22188C12.6124 1.48821 17.0446 1.48821 19.7782 4.22188C22.5119 6.95555 22.5119 11.3877 19.7782 14.1214Z"/>
  </svg>
)

const Loading = () => (
  <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.14em', color: '#888780', textTransform: 'uppercase' }}>
      Chargement…
    </p>
  </main>
)

interface ShopPartner { name: string; url: string; format?: string; logo?: string; color?: string }

function ShopRow({ shop, isFirst }: { shop: ShopPartner; isFirst: boolean }) {
  const [rowHovered, setRowHovered] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  return (
    <div>
      <div style={{ height: 1, background: isFirst ? 'rgba(var(--theme-accent), 0.4)' : 'rgba(var(--theme-accent), 0.12)', transition: 'background 0.45s' }} />
      <div onMouseEnter={() => setRowHovered(true)} onMouseLeave={() => setRowHovered(false)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 8px', minHeight: 60, borderRadius: 8, background: rowHovered ? 'rgba(var(--theme-accent), 0.07)' : 'transparent', transition: 'background 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
          <div style={{ width: 48, height: 48, minWidth: 48, borderRadius: 8, background: rowHovered ? 'rgba(var(--theme-accent), 0.18)' : 'rgba(var(--theme-accent), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', transition: 'background 0.2s' }}>
            {shop.logo ? <img src={shop.logo} alt={shop.name} style={{ width: 32, height: 32, objectFit: 'contain' }} /> : <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: 'rgb(var(--theme-accent))' }}>{shop.name.slice(0, 2).toUpperCase()}</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 500, color: 'rgb(var(--theme-accent))', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.45s' }}>{shop.name}</p>
            {shop.format && <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(var(--theme-accent), 0.6)', transition: 'color 0.45s' }}>{shop.format}</p>}
          </div>
        </div>
        <a href={shop.url} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setBtnHovered(true)} onMouseLeave={() => setBtnHovered(false)}
          style={{ padding: '8px 20px', background: btnHovered ? 'rgba(var(--theme-accent), 0.75)' : 'rgb(var(--theme-accent))', color: '#fff', borderRadius: 8, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transform: btnHovered ? 'scale(1.04)' : 'scale(1)', transition: 'background 0.2s, transform 0.15s, background-color 0.45s' }}>
          Voir le produit
        </a>
      </div>
    </div>
  )
}

function ShareButton({ href, onClick, lineIcon, fillIcon, label }: { href?: string; onClick?: () => void; lineIcon: React.ReactNode; fillIcon: React.ReactNode; label: string }) {
  const [hovered, setHovered] = useState(false)
  const content = <>{hovered ? fillIcon : lineIcon}{label}</>
  if (onClick) return <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="share-btn">{content}</button>
  return <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="share-btn">{content}</a>
}

export default function HomeClient() {
  const isMobile = useIsMobile(768)
  const isTabletOrSmaller = useIsMobile(1024)
  const isTablet = isTabletOrSmaller && !isMobile
  const [artist, setArtist] = useState<Artist | null>(null)
  const [pageUrl, setPageUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isFromArchive, setIsFromArchive] = useState(false)
  const [backHovered, setBackHovered] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dateParam = params.get('date')
    const today = dateParam ?? new Date().toISOString().split('T')[0]
    setIsFromArchive(!!dateParam)
    fetch(`/api/artist?date=${today}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => setArtist(d))
      .catch(() => fetch('/api/artist').then(r => r.json()).then(d => setArtist(d)))
    setPageUrl(window.location.href)
  }, [])

  const coverUrl = (artist && artist.featuredAlbum) ? artist.featuredAlbum.coverUrl : null
  const { isExtracting } = useColorTheme(coverUrl)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!artist || !artist.featuredAlbum) return <Loading />

  const { featuredAlbum, discography, streaming, vinylPartners, editorial } = artist
  const px = isMobile ? 20 : 64
  const videoX = isMobile ? 20 : 160
  const heroGap = isMobile ? 24 : isTablet ? 40 : 228
  const heroPadBottom = isMobile ? 56 : 96
  const isNarrow = isMobile || isTablet

  return (
    <main style={{ minHeight: '100vh', background: '#fff', opacity: isExtracting ? 0.95 : 1, transition: 'opacity 0.4s' }}>
      <div className="hero-zone">
        <Nav activePage="home" />
        {isFromArchive && (
          <div style={{ padding: `12px ${px}px 0`, position: 'relative', zIndex: 2 }}>
            <a href="/archive" onMouseEnter={() => setBackHovered(true)} onMouseLeave={() => setBackHovered(false)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: 'rgb(var(--theme-accent))', textDecoration: 'none', padding: '6px 14px', background: backHovered ? 'rgba(var(--theme-accent), 0.12)' : 'rgba(var(--theme-light), 0.6)', borderRadius: 99, border: backHovered ? '0.5px solid rgba(var(--theme-accent), 0.4)' : '0.5px solid rgba(var(--theme-accent), 0.2)', backdropFilter: 'blur(4px)', transform: backHovered ? 'translateX(-2px)' : 'translateX(0)', transition: 'background 0.2s, border-color 0.2s, transform 0.15s' }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              Retour à l&apos;archive
            </a>
          </div>
        )}
        <section style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', gap: heroGap, alignItems: isMobile ? 'stretch' : 'flex-end', justifyContent: (!isMobile && !isTablet) ? 'center' : 'flex-start', padding: `${isMobile ? 24 : 56}px ${px}px ${heroPadBottom}px`, width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 8 : 12, width: isMobile ? '100%' : isTablet ? 'auto' : 520, flexGrow: isTablet ? 1 : 0, flexShrink: 0, flexBasis: 'auto' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(var(--theme-accent), 0.6)', margin: 0, padding : 0, lineHeight : 1, transition: 'color 0.45s' }}>
              No. {artist.number} · {new Date(artist.publishedAt + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-hero" style={{ color: '#2C2C2A', margin: 0, paddingTop: '0.1em' }}>{artist.name}</h1>
            <p className="text-display-subtitle" style={{ color: '#444441', margin: 0 }}>{featuredAlbum.title}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: '#5F5E5A', lineHeight: 1.5, margin: 0 }}>{artist.meta}</p>
          </div>
          <div style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
            <img src={featuredAlbum.coverUrl} alt={`Pochette de ${featuredAlbum.title}`} className="album-cover-hero" crossOrigin="anonymous" style={!isMobile ? { width: 428, height: 428 } : undefined} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        </section>
      </div>

      <section style={{ padding: `16px ${isMobile ? '0' : isTablet ? `${videoX}px` : '0'} 40px`, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: isNarrow ? '100%' : 962, flexShrink: 0 }}>
          <div className="section-video-inner">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 500, color: 'rgba(var(--theme-accent), 0.6)' }}>Un avant-goût de l'album...</p>
            <iframe className="youtube-embed" src={`https://www.youtube-nocookie.com/embed/${artist.youtubeVideoId}?rel=0&modestbranding=1`} title={artist.videoTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: 'rgba(var(--theme-accent), 0.7)', letterSpacing: '0.06em' }}>{artist.videoTitle}</p>
          </div>
        </div>
      </section>

      <section style={{ padding: `0 ${isMobile ? '20px' : `${videoX}px`} 48px`, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p className="text-kicker" style={{ textAlign: 'center' }}>Écouter l&apos;album</p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: isMobile ? 'flex-start' : 'center',
        }}>
          {streaming.map(s => (
            <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="stream-btn"
              style={isMobile ? { flex: '1 1 calc(50% - 5px)', minWidth: 0, justifyContent: 'center' } : undefined}>
              <img
                src={s.logoSrc}
                alt={s.label}
                width={20} height={20}
                style={{ flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <section style={{ padding: `40px ${isNarrow ? `${px}px` : '0'}`, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: isNarrow ? '100%' : 962, flexShrink: 0 }}>
          <p className="text-kicker">À propos</p>
          <div style={{ height: 1, background: 'rgba(var(--theme-accent), 0.6)', marginBottom: 24, transition: 'background 0.45s' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            {editorial.map((para, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: '#2C2C2A', lineHeight: 1.75 }}>
              {para}
              </p>
          ))}
          </div>
        </div>
      </section>

      {vinylPartners.length > 0 && (
        <section style={{ padding: `0 ${px}px 48px` }}>
          <div style={{ background: 'rgb(var(--theme-light))', borderRadius: 16, padding: '24px', transition: 'background 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
            <p className="text-kicker" style={{ color: 'rgba(var(--theme-accent), 0.7)' }}>Où acheter</p>
            {vinylPartners.map((shop, i) => <ShopRow key={`${shop.name}-${i}`} shop={shop} isFirst={i === 0} />)}
            <div style={{ height: 1, background: 'rgba(var(--theme-accent), 0.12)', transition: 'background 0.45s' }} />
          </div>
        </section>
      )}

      <section style={{ padding: `0 ${px}px 48px` }}>
        <p className="text-kicker">Discographie</p>
        <div>
          {discography.map((album, i) => (
            <div key={album.id ?? i}>
              <div style={{ height: 1, background: i === 0 ? 'rgba(var(--theme-accent), 0.7)' : 'rgba(var(--theme-mid), 0.3)', transition: 'background 0.45s' }} />
              <div className="disco-row" style={{ padding: '10px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                  <img src={album.coverUrl} alt={album.title ?? ''} className="album-cover-disco" onError={e => { const t = e.target as HTMLImageElement; t.style.background = 'rgba(200,198,190,0.4)'; t.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, lineHeight: 1.3, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#2C2C2A' : '#5F5E5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.title}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#888780' }}>{album.type} · {album.trackCount} titres</p>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#888780', whiteSpace: 'nowrap', marginLeft: 12 }}>{album.year}</span>
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(var(--theme-mid), 0.3)', transition: 'background 0.45s' }} />
        </div>
      </section>

      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center', padding: `32px ${px}px 48px` }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 16, color: 'rgba(var(--theme-accent), 0.5)', width: isMobile ? '100%' : 'auto' }}>Partager :</span>
        <ShareButton onClick={handleCopyLink} lineIcon={<IconLinkLine />} fillIcon={<IconLinkFill />} label={copied ? 'Lien copié !' : 'Copier le lien'} />
      </section>

      <Footer />
    </main>
  )
}