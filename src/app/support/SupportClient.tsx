'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { applyDarkTheme, resetDarkTheme } from '@/hooks/useColorTheme'
import '@/styles/doc.css'

// Même accent par défaut que /about et /confidentialite.
const DOC_DEFAULT_ACCENT: [number, number, number] = [232, 168, 124]

export default function SupportClient() {
  useEffect(() => {
    requestAnimationFrame(() => applyDarkTheme(DOC_DEFAULT_ACCENT))
    return () => { resetDarkTheme() }
  }, [])

  return (
    <main>
      <Nav />

      {/* HERO */}
      <section className="dc-doc-hero">
        <p className="dc-doc-kicker">Application DigCover pour iPhone</p>
        <h1 className="dc-doc-title">Support</h1>
        <p className="dc-doc-updated">Dernière mise à jour : 10 août 2026</p>
      </section>

      {/* BLOC 1 — Configuration requise */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Ce qu&apos;il faut pour utiliser DigCover</span>
        <ul className="dc-doc-list">
          <li>Un <strong>iPhone</strong> — l&apos;application est conçue pour iPhone uniquement.</li>
          <li><strong>iOS 18</strong> au minimum.</li>
          <li>Un <strong>abonnement Apple Music actif</strong>, sur le compte Apple utilisé par l&apos;iPhone.</li>
          <li>Une connexion internet, pour récupérer la sélection du jour et lire la musique.</li>
        </ul>
        <p>
          DigCover ne stocke pas de musique et ne remplace pas Apple Music : l&apos;app propose
          une sélection et confie la lecture à Apple Music. Sans abonnement actif, la
          navigation reste possible mais rien ne peut être écouté.
        </p>
      </section>

      {/* BLOC 2 — Problèmes fréquents */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Problèmes fréquents</span>

        <h2 className="dc-doc-subtitle">« Je n&apos;ai pas d&apos;abonnement Apple Music »</h2>
        <p>
          C&apos;est la cause la plus fréquente d&apos;une app qui ne joue rien. DigCover lit la
          musique <strong>via Apple Music</strong> : sans abonnement actif, la lecture est
          impossible, quel que soit l&apos;album.
        </p>
        <p>
          À la première ouverture, DigCover propose de s&apos;abonner directement depuis l&apos;app.
          Si tu as passé cette étape, ou si <strong>un abonnement a expiré après coup</strong>,
          l&apos;offre n&apos;est plus reproposée dans DigCover. Passe alors par l&apos;application
          <strong> Musique</strong> d&apos;Apple pour souscrire, ou par{' '}
          <span className="dc-doc-path">Réglages › ton compte Apple › Abonnements</span>{' '}
          pour réactiver un abonnement expiré. La lecture redevient disponible dans
          DigCover immédiatement après.
        </p>

        <h2 className="dc-doc-subtitle">« J&apos;ai refusé l&apos;accès à Apple Music »</h2>
        <p>
          Au premier lancement, iOS demande l&apos;autorisation d&apos;accéder à Apple Music et à ta
          bibliothèque. Si tu as répondu <strong>Refuser</strong>, l&apos;app ne peut ni lire un
          album, ni afficher ta bibliothèque — et iOS ne repose plus la question.
        </p>
        <p>Pour la réactiver, deux chemins équivalents dans les réglages de l&apos;iPhone :</p>
        <ul className="dc-doc-list">
          <li>
            <span className="dc-doc-path">Réglages › Apps › DigCover</span> puis active
            <strong> Médias et Apple Music</strong> — selon la version d&apos;iOS, DigCover
            apparaît directement dans la liste des Réglages ;
          </li>
          <li>
            ou <span className="dc-doc-path">Réglages › Confidentialité et sécurité › Médias et Apple Music</span>{' '}
            puis active <strong>DigCover</strong> dans la liste.
          </li>
        </ul>
        <p>
          Reviens ensuite dans DigCover — au besoin, ferme complètement l&apos;app et rouvre-la
          pour que l&apos;autorisation soit prise en compte.
        </p>
      </section>

      {/* BLOC 3 — Confidentialité */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Confidentialité</span>
        <p>
          DigCover ne crée aucun compte et ne collecte aucune donnée personnelle. Le détail
          complet est sur la{' '}
          <Link href="/confidentialite" className="dc-doc-link">
            politique de confidentialité
          </Link>
          .
        </p>
      </section>

      {/* BLOC 4 — Contact */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Nous contacter</span>
        <p>
          Un bug, une question, une suggestion d&apos;album ? Écris à{' '}
          <a href="mailto:contact@digcover.fr" className="dc-doc-link">
            contact@digcover.fr
          </a>
          . Chaque message reçoit une réponse, en général{' '}
          <strong>sous 48 heures ouvrées</strong>.
        </p>
        <p>
          Pour un bug, préciser le modèle d&apos;iPhone, la version d&apos;iOS et ce qui se passait
          au moment du problème aide beaucoup à le reproduire.
        </p>
      </section>

      {/* CTA contact */}
      <section className="dc-doc-cta-wrapper">
        <a href="mailto:contact@digcover.fr" className="dc-doc-cta">
          Nous écrire
          <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
          </svg>
        </a>
      </section>

      <Footer />
    </main>
  )
}
