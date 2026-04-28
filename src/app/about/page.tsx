import { Metadata } from 'next'
import AboutClient from './Aboutclient'

export const metadata: Metadata = {
  title: 'À propos — DigCover',
  description: 'DigCover publie un album par jour, du lundi au vendredi. Une alternative aux algorithmes des plateformes de streaming — une curation éditoriale humaine, un artiste à la fois.',
  openGraph: {
    title: 'À propos — DigCover',
    description: 'DigCover publie un album par jour, du lundi au vendredi. Une alternative aux algorithmes des plateformes de streaming.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'DigCover',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos — DigCover',
    description: 'DigCover publie un album par jour, du lundi au vendredi.',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
