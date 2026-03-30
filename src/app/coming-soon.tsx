'use client'

import { useState, useEffect } from 'react'

function VinylSVG() {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 120, height: 120, display: 'block' }}>
      <circle cx="60" cy="60" r="58" fill="#1a1a1a" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#262626" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#262626" strokeWidth="1" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="#262626" strokeWidth="1" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="#2a2a2a" strokeWidth="1" />
      <circle cx="60" cy="60" r="28" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="20" fill="#2C2C2A" />
      <circle cx="60" cy="60" r="13" fill="#1a1a1a" />
      <ellipse cx="52" cy="50" rx="6" ry="3.5" fill="rgba(255,255,255,0.05)"
        transform="rotate(-25 52 50)" />
      <circle cx="60" cy="60" r="3.5" fill="#F1EFE8" />
    </svg>
  )
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  const [hovered, setHovered] = useState(false)
  const pad = (n: number) => String(n).padStart(2, '0')

  // Mécanique propre — pas de clip zone :
  // Le vinyle est derrière le bloc (z-index 0 < z-index 2)
  // La card a un fond plein qui masque le vinyle naturellement
  //
  // Default : translateY(60px) → vinyle entièrement derrière la card → invisible
  // Hover   : translateY(0px)  → moitié haute visible dans paddingTop, moitié basse derrière card

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 120,
        paddingTop: 60,   // espace pour la moitié haute du vinyle au hover
        flexShrink: 0,
      }}
    >
      {/* Vinyle — z-index 0, derrière la card */}
      <div style={{
        position: 'absolute',
        top: 0,           // ancré en haut du paddingTop
        left: '50%',
        transform: hovered
          ? 'translateX(-50%) translateY(0px)'       // moitié haute visible
          : 'translateX(-50%) translateY(60px)',     // entièrement caché derrière la card
        transition: 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)',
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <div style={{
          animation: hovered ? 'vinyl-spin 3s linear infinite' : 'none',
        }}>
          <VinylSVG />
        </div>
      </div>

      {/* Card — z-index 2, fond plein qui masque la moitié basse du vinyle */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: '#F1EFE8',
        border: '1px solid #D3D1CC',
        borderRadius: 12,
        width: 120,
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        boxShadow: hovered
          ? '0px 16px 40px rgba(44,42,42,0.16), 0px 4px 12px rgba(44,42,42,0.08)'
          : 'none',
        transition: 'box-shadow 0.35s ease',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 900,
          lineHeight: '60px', color: '#2C2C2A', display: 'block',
          width: 100, textAlign: 'center',
        }}>
          {pad(value)}
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.12em', color: '#878580', display: 'block',
          width: 100, textAlign: 'center',
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}

export default function ComingSoon() {
  const LAUNCH_DATE = new Date('2026-04-01T08:00:00')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const update = () => {
      const diff = LAUNCH_DATE.getTime() - new Date().getTime()
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  const units = [
    { value: timeLeft.days,    label: 'JOURS' },
    { value: timeLeft.hours,   label: 'HEURES' },
    { value: timeLeft.minutes, label: 'MINUTES' },
    { value: timeLeft.seconds, label: 'SECONDES' },
  ]

  return (
    <>
      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <main style={{
        minHeight: '100vh', background: '#F1EFE8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', fontFamily: 'var(--font-body)',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 48, width: '100%', maxWidth: 962,
        }}>

          <img src="/logos/digcover-logo.svg" alt="DigCover"
            style={{ height: 72, width: 'auto' }} />

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 900, color: '#2C2C2A', lineHeight: 1.05,
              letterSpacing: '-0.01em', margin: 0,
            }}>
              Un jour. Un album. Zéro algorithme.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: '#5F5E5A', lineHeight: 1.5, margin: 0 }}>
                Une immersion complète dans un univers musical unique, loin du zapping des plateformes.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: '#5F5E5A', lineHeight: 1.5, margin: 0 }}>
                Laissez-vous surprendre et réécoutez la musique de bout en bout.
              </p>
            </div>
          </div>

          {mounted && (
            <div style={{
              display: 'flex', gap: 16, flexWrap: 'wrap',
              justifyContent: 'center', alignItems: 'flex-end',
            }}>
              {units.map(({ value, label }) => (
                <CountdownBlock key={label} value={value} label={label} />
              ))}
            </div>
          )}

          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#2C2C2A', textAlign: 'center', margin: 0,
          }}>
            Lancement le 1er avril 2026
          </p>

        </div>
      </main>
    </>
  )
}