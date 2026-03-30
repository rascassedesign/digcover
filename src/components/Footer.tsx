'use client'

import { useIsMobile } from '@/hooks/useIsMobile'

export default function Footer() {
  const isMobile = useIsMobile(768)
  const px = isMobile ? 20 : 64

  return (
    <footer style={{
      borderTop: '1px solid rgba(var(--theme-mid), 0.3)',
      padding: `28px ${px}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      transition: 'border-color 0.45s',
    }}>
      {/* Logo Rascasse Design */}
      <a
        href="https://rascasse.design"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
      >
        <img
          src="/logos/rascasse-design.png"
          alt="Rascasse Design"
          style={{
            height: 64,
            width: 'auto',
            display: 'block',
            opacity: 0.85,
            filter: 'grayscale(1)',
          }}
        />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 700,
          color: '#5F5E5A',
          letterSpacing: '-0.01em',
        }}>
          Rascasse Design
        </span>
      </a>

      {/* Copyright */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: '#888780',
      }}>
        © 2026 Rascasse Design. Tous droits réservés.
      </p>
    </footer>
  )
}