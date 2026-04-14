'use client'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function AboutClient() {
  const isMobile = useIsMobile(768)
  const px = isMobile ? 20 : 64

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <div className="hero-zone">
        <Nav activePage="about" />
        <section style={{
          padding: `${isMobile ? 40 : 80}px ${px}px ${isMobile ? 48 : 80}px`,
          maxWidth: 960,
          margin: '0 auto',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(var(--theme-accent), 0.6)',
            marginBottom: isMobile ? 16 : 24,
            transition: 'color 0.45s',
          }}>
            À propos de Digcover.fr
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 48 : 84,
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            color: '#2C2C2A',
            marginBottom: isMobile ? 32 : 48,
          }}>
            Un jour.<br />Un album.<br />Zéro algorithme.
          </h1>
        </section>
      </div>

      {/* Contenu éditorial */}
      <section style={{
        padding: `${isMobile ? 40 : 64}px ${px}px`,
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
      }}>

        {/* Bloc 1 — Le concept */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#2C2C2A',
          }}>
            Le concept
          </p>
          <div style={{ height: 1, background: '#D3D1C7' }} />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 20,
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            DigCover publie <strong>un album par jour, du lundi au vendredi</strong>. Pas de playlist générée, pas de "Découvertes de la semaine", pas d'intelligence artificielle qui devine ce que tu veux entendre. Juste un choix humain, assumé, avec un texte éditorial pour expliquer pourquoi cet album mérite ton attention aujourd'hui.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 20,
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            L'idée est simple : ralentir. Écouter un album en entier plutôt que de zapper entre vingt titres. Redécouvrir ce que c'est que d'être surpris par un disque qu'on n'aurait pas choisi soi-même.
          </p>
        </div>

        {/* Bloc 2 — Pourquoi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#2C2C2A',
          }}>
            Pourquoi DigCover
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 20,
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            Les plateformes de streaming ont résolu un problème, l'accès à la musique, mais en ont créé un autre : l'excès de choix paralyse et les algorithmes finissent par nous renvoyer en boucle ce qu'on écoute déjà. DigCover est une tentative de réponse à ça.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 20,
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            Chaque album sélectionné a quelque chose à dire: un contexte de création, une histoire, une raison d'exister au-delà de ses streams. Le texte éditorial est là pour poser ce contexte, pas pour noter ou juger.
          </p>
        </div>

        {/* Bloc 3 — La sélection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#2C2C2A',
          }}>
            La sélection
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 20,
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            Pas de genre exclusif, pas de case. DigCover couvre tout: rock, électronique, jazz, folk, hip-hop, musique de film, ambient, classique contemporain. Le seul critère est que l'album mérite qu'on lui consacre de l'attention.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 20,
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            On alterne entre sorties récentes et disques plus anciens qu'on redécouvre. Entre artistes connus et découvertes. Entre ce qui est facile à écouter et ce qui demande un peu plus d'attention.
          </p>
        </div>

        {/* Bloc 4 — Qui */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#2C2C2A',
          }}>
            Qui
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 20,
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            DigCover est un projet indépendant imaginé et développé par <strong>Rascasse Design</strong>, un studio de design basé en France. C'est un projet personnel avant tout une façon de partager des disques qui comptent, avec les outils du design et du code.
          </p>
        </div>

      </section>

      {/* CTA — Voir l'album du jour */}
      <section style={{
        padding: `0 ${px}px ${isMobile ? 64 : 96}px`,
        maxWidth: 960,
        margin: '0 auto',
      }}>
        <a href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 32px',
          background: '#2C2C2A',
          color: '#F9F7F2',
          borderRadius: 12,
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Voir l&apos;album du jour
          <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/>
          </svg>
        </a>
      </section>

      <Footer />
    </main>
  )
}