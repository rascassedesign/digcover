'use client'

import { useEffect } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { applyDarkTheme, resetDarkTheme } from '@/hooks/useColorTheme'
import './about.css'

// Couleur d'accent par défaut pour About (orange/saumon doux)
const ABOUT_DEFAULT_ACCENT: [number, number, number] = [232, 168, 124]

export default function AboutClient() {
  // Appliquer le thème dark fixe au montage
  useEffect(() => {
    // Petit délai pour laisser le DOM rendre avant de poser les styles
    requestAnimationFrame(() => applyDarkTheme(ABOUT_DEFAULT_ACCENT))
    return () => { resetDarkTheme() }
  }, [])

  return (
    <main>
      <Nav activePage="about" />

      {/* HERO */}
      <section className="dc-about-hero">
        <p className="dc-about-kicker">À propos de digcover.fr</p>
        <h1 className="dc-about-title">
          Un jour.<br />
          Un album.<br />
          Zéro algorithme.
        </h1>
      </section>

      {/* BLOC 1 — Le concept */}
      <section className="dc-about-block">
        <span className="dc-about-label">Le concept</span>
        <p>
          DigCover publie <strong>un album par jour, du lundi au vendredi</strong>. Pas de playlist générée, pas de &quot;Découvertes de la semaine&quot;, pas d&apos;intelligence artificielle qui devine ce que tu veux entendre. Juste un choix humain, assumé, avec un texte éditorial pour expliquer pourquoi cet album mérite ton attention aujourd&apos;hui.
        </p>
        <p>
          L&apos;idée est simple : ralentir. Écouter un album en entier plutôt que de zapper entre vingt titres. Redécouvrir ce que c&apos;est que d&apos;être surpris par un disque qu&apos;on n&apos;aurait pas choisi soi-même.
        </p>
      </section>

      {/* BLOC 2 — Pourquoi DigCover */}
      <section className="dc-about-block">
        <span className="dc-about-label">Pourquoi DigCover</span>
        <p>
          Les plateformes de streaming ont résolu un problème, l&apos;accès à la musique, mais en ont créé un autre : l&apos;excès de choix paralyse et les algorithmes finissent par nous renvoyer en boucle ce qu&apos;on écoute déjà. DigCover est une tentative de réponse à ça.
        </p>
        <p>
          Chaque album sélectionné a quelque chose à dire : un contexte de création, une histoire, une raison d&apos;exister au-delà de ses streams. Le texte éditorial est là pour poser ce contexte, pas pour noter ou juger.
        </p>
      </section>

      {/* BLOC 3 — La sélection */}
      <section className="dc-about-block">
        <span className="dc-about-label">La sélection</span>
        <p>
          Pas de genre exclusif, pas de case. DigCover couvre tout : rock, électronique, jazz, folk, hip-hop, musique de film, ambient, classique contemporain. Le seul critère est que l&apos;album mérite qu&apos;on lui consacre de l&apos;attention.
        </p>
        <p>
          On alterne entre sorties récentes et disques plus anciens qu&apos;on redécouvre. Entre artistes connus et découvertes. Entre ce qui est facile à écouter et ce qui demande un peu plus d&apos;attention.
        </p>
      </section>

      {/* BLOC 4 — Qui */}
      <section className="dc-about-block">
        <span className="dc-about-label">Qui ?</span>
        <p>
          DigCover est un projet indépendant imaginé et développé par <strong>Rascasse Design</strong>, un studio de design basé en France. C&apos;est un projet personnel avant tout, une façon de partager des disques qui comptent, avec les outils du design et du code.
        </p>
      </section>

      {/* CTA — Voir l'album du jour */}
      <section className="dc-about-cta-wrapper">
        <a href="/" className="dc-about-cta">
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
