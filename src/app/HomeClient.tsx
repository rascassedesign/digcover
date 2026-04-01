'use client'

import { useState, useEffect } from 'react'
import { useColorTheme } from '@/hooks/useColorTheme'
import { useIsMobile } from '@/hooks/useIsMobile'
import Nav from '@/components/Nav'
import { track } from '@vercel/analytics'
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
const IconInstagramLine = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"/>
  </svg>
)
const IconInstagramFill = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.0281 2.00073C14.1535 2.00259 14.7238 2.00855 15.2166 2.02322L15.4107 2.02956C15.6349 2.03753 15.8561 2.04753 16.1228 2.06003C17.1869 2.1092 17.9128 2.27753 18.5503 2.52503C19.2094 2.7792 19.7661 3.12253 20.3219 3.67837C20.8769 4.2342 21.2203 4.79253 21.4753 5.45003C21.7219 6.0867 21.8903 6.81337 21.9403 7.87753C21.9522 8.1442 21.9618 8.3654 21.9697 8.58964L21.976 8.78373C21.9906 9.27647 21.9973 9.84686 21.9994 10.9723L22.0002 11.7179C22.0003 11.809 22.0003 11.903 22.0003 12L22.0002 12.2821L21.9996 13.0278C21.9977 14.1532 21.9918 14.7236 21.9771 15.2163L21.9707 15.4104C21.9628 15.6347 21.9528 15.8559 21.9403 16.1225C21.8911 17.1867 21.7219 17.9125 21.4753 18.55C21.2211 19.2092 20.8769 19.7659 20.3219 20.3217C19.7661 20.8767 19.2069 21.22 18.5503 21.475C17.9128 21.7217 17.1869 21.89 16.1228 21.94C15.8561 21.9519 15.6349 21.9616 15.4107 21.9694L15.2166 21.9757C14.7238 21.9904 14.1535 21.997 13.0281 21.9992L12.2824 22C12.1913 22 12.0973 22 12.0003 22L11.7182 22L10.9725 21.9993C9.8471 21.9975 9.27672 21.9915 8.78397 21.9768L8.58989 21.9705C8.36564 21.9625 8.14444 21.9525 7.87778 21.94C6.81361 21.8909 6.08861 21.7217 5.45028 21.475C4.79194 21.2209 4.23444 20.8767 3.67861 20.3217C3.12278 19.7659 2.78028 19.2067 2.52528 18.55C2.27778 17.9125 2.11028 17.1867 2.06028 16.1225C2.0484 15.8559 2.03871 15.6347 2.03086 15.4104L2.02457 15.2163C2.00994 14.7236 2.00327 14.1532 2.00111 13.0278L2.00098 10.9723C2.00284 9.84686 2.00879 9.27647 2.02346 8.78373L2.02981 8.58964C2.03778 8.3654 2.04778 8.1442 2.06028 7.87753C2.10944 6.81253 2.27778 6.08753 2.52528 5.45003C2.77944 4.7917 3.12278 4.2342 3.67861 3.67837C4.23444 3.12253 4.79278 2.78003 5.45028 2.52503C6.08778 2.27753 6.81278 2.11003 7.87778 2.06003C8.14444 2.04816 8.36564 2.03847 8.58989 2.03062L8.78397 2.02433C9.27672 2.00969 9.8471 2.00302 10.9725 2.00086L13.0281 2.00073ZM12.0003 7.00003C9.23738 7.00003 7.00028 9.23956 7.00028 12C7.00028 14.7629 9.23981 17 12.0003 17C14.7632 17 17.0003 14.7605 17.0003 12C17.0003 9.23713 14.7607 7.00003 12.0003 7.00003ZM12.0003 9.00003C13.6572 9.00003 15.0003 10.3427 15.0003 12C15.0003 13.6569 13.6576 15 12.0003 15C10.3434 15 9.00028 13.6574 9.00028 12C9.00028 10.3431 10.3429 9.00003 12.0003 9.00003ZM17.2503 5.50003C16.561 5.50003 16.0003 6.05994 16.0003 6.74918C16.0003 7.43843 16.5602 7.9992 17.2503 7.9992C17.9395 7.9992 18.5003 7.4393 18.5003 6.74918C18.5003 6.05994 17.9386 5.49917 17.2503 5.50003Z"/>
  </svg>
)
const IconXLine = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"/>
  </svg>
)
const IconXFill = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z"/>
  </svg>
)
const IconFacebookLine = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.001 19.9381C16.9473 19.446 20.001 16.0796 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 16.0796 7.05467 19.446 11.001 19.9381V14H9.00098V12H11.001V10.3458C11.001 9.00855 11.1402 8.52362 11.4017 8.03473C11.6631 7.54584 12.0468 7.16216 12.5357 6.9007C12.9184 6.69604 13.3931 6.57252 14.2227 6.51954C14.5519 6.49851 14.9781 6.52533 15.501 6.6V8.5H15.001C14.0837 8.5 13.7052 8.54332 13.4789 8.66433C13.3386 8.73939 13.2404 8.83758 13.1653 8.97793C13.0443 9.20418 13.001 9.42853 13.001 10.3458V12H15.501L15.001 14H13.001V19.9381ZM12.001 22C6.47813 22 2.00098 17.5228 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22Z"/>
  </svg>
)
const IconFacebookFill = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"/>
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
        <a href={shop.url} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setBtnHovered(true)} onMouseLeave={() => setBtnHovered(false)} onClick={() => track('shop_click', { shop: shop.name, format: shop.format ?? '' })}
          style={{ padding: '8px 20px', background: btnHovered ? 'rgba(var(--theme-accent), 0.75)' : 'rgb(var(--theme-accent))', color: '#fff', borderRadius: 8, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transform: btnHovered ? 'scale(1.04)' : 'scale(1)', transition: 'background 0.2s, transform 0.15s, background-color 0.45s' }}>
          Voir le produit
        </a>
      </div>
    </div>
  )
}

function ShareButton({ href, onClick, onClickExtra, lineIcon, fillIcon, label }: { href?: string; onClick?: () => void; onClickExtra?: () => void; lineIcon: React.ReactNode; fillIcon: React.ReactNode; label: string }) {
  const [hovered, setHovered] = useState(false)
  const content = <>{hovered ? fillIcon : lineIcon}{label}</>
  if (onClick) return <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="share-btn">{content}</button>
  return <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClickExtra} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="share-btn">{content}</a>
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
    track('share_click', { method: 'copy_link', artist: artist?.name ?? '', album: artist?.featuredAlbum?.title ?? '' })
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
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(var(--theme-accent), 0.7)', marginBottom: 4 }}>
              Album du Jour · <span style={{ color: 'rgb(var(--theme-accent))' }}>No. {artist.number}</span>
            </p>
            <h1 className="text-hero" style={{ color: '#2C2C2A', marginBottom: 4 }}>{artist.name}</h1>
            <p className="text-display-subtitle" style={{ color: '#444441', marginBottom: 8 }}>{featuredAlbum.title}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: '#5F5E5A', lineHeight: 1.5 }}>{artist.meta}</p>
          </div>
          <div style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
            <img src={featuredAlbum.coverUrl} alt={`Pochette de ${featuredAlbum.title}`} className="album-cover-hero" crossOrigin="anonymous" style={!isMobile ? { width: 428, height: 428 } : undefined} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        </section>
      </div>

      <section style={{ padding: `16px ${isMobile ? '0' : isTablet ? `${videoX}px` : '0'} 40px`, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: isNarrow ? '100%' : 962, flexShrink: 0 }}>
          <div className="section-video-inner">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 500, color: 'rgba(var(--theme-accent), 0.6)' }}>Dernier titre</p>
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
              style={isMobile ? { flex: '1 1 calc(50% - 5px)', minWidth: 0, justifyContent: 'center' } : undefined}
              onClick={() => track('streaming_click', { platform: s.platform, artist: artist.name, album: featuredAlbum.title })}>
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
              <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: i === 0 ? 20 : 18, color: i === 0 ? '#2C2C2A' : i === editorial.length - 1 ? '#444441' : '#5F5E5A', lineHeight: i === 0 ? 1.75 : 1.7, fontStyle: i === editorial.length - 1 ? 'normal' : 'normal' }}>
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
        <ShareButton href="https://www.instagram.com/" lineIcon={<IconInstagramLine />} fillIcon={<IconInstagramFill />} label="Instagram" />
        <ShareButton href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(`${artist.name} — ${featuredAlbum.title}`)}`} lineIcon={<IconXLine />} fillIcon={<IconXFill />} label="X / Twitter" onClickExtra={() => track('share_click', { method: 'twitter', artist: artist.name })} />
        <ShareButton href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} lineIcon={<IconFacebookLine />} fillIcon={<IconFacebookFill />} label="Facebook" onClickExtra={() => track('share_click', { method: 'facebook', artist: artist.name })} />
      </section>

      <Footer />
    </main>
  )
}