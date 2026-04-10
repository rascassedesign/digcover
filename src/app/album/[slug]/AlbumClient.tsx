'use client'

// Ce composant redirige simplement vers la home avec le bon ?date=
// La home existante gère tout l'affichage — on ne duplique pas de logique.
// L'URL /album/[slug] existe pour le SEO/indexation, le contenu est chargé sur la home.

import { useEffect } from 'react'

interface Props {
  slug: string
  date: string
  raw: Record<string, unknown>
}

export default function AlbumClient({ date }: Props) {
  useEffect(() => {
    // Redirection vers la home avec la date correspondante
    window.location.replace(`/?date=${date}`)
  }, [date])

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F1EFE8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
    }}>
      <p style={{
        fontSize: 16,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#888780',
      }}>
        Chargement…
      </p>
    </main>
  )
}
