import { Metadata } from 'next'
import ConfidentialiteClient from './ConfidentialiteClient'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — DigCover',
  description: "L'application DigCover pour iPhone ne crée aucun compte, ne collecte aucune donnée personnelle et n'utilise aucun traceur. Ce que l'app stocke, où, et pourquoi.",
  openGraph: {
    title: 'Politique de confidentialité — DigCover',
    description: "L'application DigCover pour iPhone ne crée aucun compte, ne collecte aucune donnée personnelle et n'utilise aucun traceur.",
    type: 'website',
    locale: 'fr_FR',
    siteName: 'DigCover',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Politique de confidentialité — DigCover',
    description: "Aucun compte, aucune collecte, aucun traceur.",
  },
}

export default function ConfidentialitePage() {
  return <ConfidentialiteClient />
}
