'use client'

import { useEffect } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { applyDarkTheme, resetDarkTheme } from '@/hooks/useColorTheme'
import '@/styles/doc.css'

// Même accent par défaut que /about — les pages document ne dépendent
// d'aucune pochette, elles gardent la teinte neutre du site.
const DOC_DEFAULT_ACCENT: [number, number, number] = [232, 168, 124]

export default function ConfidentialiteClient() {
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
        <h1 className="dc-doc-title">
          Politique de<br />
          confidentialité
        </h1>
        <p className="dc-doc-updated">Dernière mise à jour : 10 août 2026</p>
      </section>

      {/* BLOC 1 — Résumé */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">En deux lignes</span>
        <p>
          L&apos;application DigCover <strong>ne crée aucun compte, ne collecte aucune donnée
          personnelle et n&apos;utilise aucun traceur</strong>. Il n&apos;y a pas de serveur DigCover
          qui stocke quoi que ce soit te concernant : les quelques informations dont
          l&apos;app a besoin restent sur ton iPhone.
        </p>
        <p>
          Cette politique concerne l&apos;application iOS DigCover, éditée par
          <strong> Rascasse Design</strong>. Elle décrit exactement ce que l&apos;app fait de tes
          données — c&apos;est-à-dire très peu.
        </p>
      </section>

      {/* BLOC 2 — Aucune collecte */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Aucun compte, aucune collecte</span>
        <p>
          Aucune inscription n&apos;est demandée. Pas de nom, pas d&apos;adresse e-mail, pas de mot
          de passe, pas de numéro de téléphone. L&apos;app fonctionne dès l&apos;installation.
        </p>
        <p>
          DigCover n&apos;intègre <strong>aucun outil de mesure d&apos;audience, aucun SDK
          publicitaire et aucun traceur</strong>. Aucun profil publicitaire n&apos;est constitué,
          ton activité n&apos;est reliée à aucun identifiant, et rien n&apos;est croisé avec des
          données provenant d&apos;autres applications ou sites.
        </p>
        <p>
          Le manifeste de confidentialité livré avec l&apos;app
          (<strong>PrivacyInfo.xcprivacy</strong>, le fichier qu&apos;Apple lit pour établir
          l&apos;étiquette de confidentialité sur l&apos;App Store) déclare formellement
          <strong> zéro collecte de données et zéro traçage</strong>.
        </p>
      </section>

      {/* BLOC 3 — Stockage local */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Ce qui reste sur ton iPhone</span>
        <p>
          Pour se souvenir d&apos;où tu en es, l&apos;app enregistre trois choses
          <strong> localement sur l&apos;appareil</strong>, dans l&apos;espace de stockage privé que
          le système réserve à chaque application. Ces informations ne sont jamais
          transmises, ni à DigCover, ni à personne d&apos;autre :
        </p>
        <ul className="dc-doc-list">
          <li>un indicateur signalant que l&apos;écran d&apos;accueil de première ouverture a déjà été vu ;</li>
          <li>la liste des identifiants d&apos;albums que tu as mis en favori ;</li>
          <li>l&apos;identifiant du dernier album resté sur la platine, pour rouvrir l&apos;app dessus.</li>
        </ul>
        <p>
          Ce sont des identifiants d&apos;albums, pas des données te concernant. Aucune de ces
          informations ne quitte l&apos;appareil, et <strong>désinstaller l&apos;application les
          efface intégralement</strong> — il n&apos;y a pas de sauvegarde à demander ni de compte
          à supprimer, puisqu&apos;il n&apos;y en a pas.
        </p>
      </section>

      {/* BLOC 4 — Apple Music */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Apple Music et MusicKit</span>
        <p>
          La lecture de la musique et l&apos;accès à ta bibliothèque passent entièrement par
          <strong> Apple Music</strong>, via le cadre technique <strong>MusicKit</strong>
          fourni par Apple, et sous <strong>ton propre compte Apple</strong>. Un
          <strong> abonnement Apple Music actif est nécessaire</strong> pour écouter.
        </p>
        <p>
          Concrètement, DigCover demande à iOS l&apos;autorisation d&apos;accéder à Apple Music, puis
          lui demande de lire un album. C&apos;est Apple qui gère la lecture, la bibliothèque et
          l&apos;abonnement. DigCover ne voit ni tes identifiants Apple, ni ton historique
          d&apos;écoute, et ne reçoit aucune donnée de ton compte.
        </p>
        <p>
          Pour cette partie, c&apos;est donc la{' '}
          <a
            href="https://www.apple.com/fr/legal/privacy/fr-ww/"
            target="_blank"
            rel="noopener noreferrer"
            className="dc-doc-link"
          >
            politique de confidentialité d&apos;Apple
          </a>{' '}
          qui s&apos;applique. Tu peux retirer l&apos;autorisation d&apos;accès à tout moment dans les
          réglages de ton iPhone.
        </p>
      </section>

      {/* BLOC 5 — La requête vers digcover.fr */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">La sélection du jour</span>
        <p>
          L&apos;app effectue <strong>une seule requête sortante</strong>, vers{' '}
          <a
            href="https://www.digcover.fr/api/artist"
            target="_blank"
            rel="noopener noreferrer"
            className="dc-doc-link"
          >
            www.digcover.fr/api/artist
          </a>
          , pour récupérer la sélection éditoriale du jour : l&apos;album mis en avant et le
          texte qui l&apos;accompagne. <strong>Aucune donnée te concernant n&apos;y est
          envoyée</strong> — ni identifiant, ni favoris, ni historique. La requête demande
          le contenu du jour, rien de plus.
        </p>
        <p>
          Comme pour n&apos;importe quelle requête sur internet, le serveur qui répond reçoit
          nécessairement ton <strong>adresse IP</strong> et les en-têtes techniques
          standards envoyés par l&apos;appareil. Le site digcover.fr est hébergé par
          <strong> Vercel</strong>, qui conserve des journaux d&apos;accès techniques pendant une
          durée limitée, à des fins de sécurité et de bon fonctionnement du service.
        </p>
        <p>
          Ces journaux ne sont ni exploités, ni analysés, ni reliés à un utilisateur : il
          n&apos;existe aucun compte auquel les rattacher. DigCover n&apos;ajoute de son côté aucun
          enregistrement supplémentaire.
        </p>
      </section>

      {/* BLOC 6 — Partage */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Partage avec des tiers</span>
        <p>
          <strong>Aucune donnée n&apos;est vendue. Aucune donnée n&apos;est partagée avec des
          tiers</strong>, à aucune fin — ni commerciale, ni publicitaire, ni statistique.
          Il n&apos;y a ni régie, ni courtier de données, ni partenaire analytique dans
          l&apos;application.
        </p>
        <p>
          Les seuls acteurs techniques impliqués sont ceux décrits plus haut : Apple, pour
          la lecture musicale, et l&apos;hébergeur du site, pour la sélection du jour.
        </p>
      </section>

      {/* BLOC 7 — Enfants */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Mineurs</span>
        <p>
          L&apos;application ne collectant aucune donnée personnelle et ne demandant aucune
          inscription, elle ne traite pas davantage de données concernant les mineurs que
          celles de n&apos;importe quel autre utilisateur : aucune.
        </p>
      </section>

      {/* BLOC 8 — Modifications */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Évolutions de cette politique</span>
        <p>
          Si l&apos;application venait à changer sur l&apos;un de ces points, cette page serait mise
          à jour avant la sortie de la version concernée, et la date en haut de page
          modifiée en conséquence.
        </p>
      </section>

      {/* BLOC 9 — Contact */}
      <section className="dc-doc-block">
        <span className="dc-doc-label">Une question ?</span>
        <p>
          Pour toute question sur cette politique ou sur le traitement des données dans
          DigCover, écris à{' '}
          <a href="mailto:contact@digcover.fr" className="dc-doc-link">
            contact@digcover.fr
          </a>
          .
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
