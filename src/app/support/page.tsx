import { Metadata } from 'next'
import SupportClient from './SupportClient'

export const metadata: Metadata = {
  title: 'Support — DigCover',
  description: "Aide et contact pour l'application DigCover sur iPhone : configuration requise, abonnement Apple Music, autorisation d'accès à la musique.",
  openGraph: {
    title: 'Support — DigCover',
    description: "Aide et contact pour l'application DigCover sur iPhone : configuration requise, abonnement Apple Music, autorisation d'accès.",
    type: 'website',
    locale: 'fr_FR',
    siteName: 'DigCover',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support — DigCover',
    description: "Aide et contact pour l'application DigCover sur iPhone.",
  },
}

export default function SupportPage() {
  return <SupportClient />
}
