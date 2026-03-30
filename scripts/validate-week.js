#!/usr/bin/env node
/**
 * DiscCover — Script de validation hebdomadaire
 * Usage : node scripts/validate-week.js [lundi de la semaine]
 * Exemple : node scripts/validate-week.js 2026-03-30
 *
 * Vérifie les 5 JSON du lundi au vendredi.
 * Le week-end (samedi/dimanche) n'est pas publié.
 */

const fs   = require('fs')
const path = require('path')

const ARTISTS_DIR = path.join(__dirname, '../data/artists')
const COVERS_DIR  = path.join(__dirname, '../public/covers')

// ── Couleurs terminal ──────────────────────────────────────────
const green  = (s) => `\x1b[32m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const red    = (s) => `\x1b[31m${s}\x1b[0m`
const bold   = (s) => `\x1b[1m${s}\x1b[0m`
const dim    = (s) => `\x1b[2m${s}\x1b[0m`

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']

// ── Trouver le lundi d'une date donnée ────────────────────────
function getLundi(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z')
  const day = d.getUTCDay() // 0=dim, 1=lun, ..., 6=sam
  const diff = day === 0 ? -6 : 1 - day // ramener au lundi
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().split('T')[0]
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split('T')[0]
}

// ── Validation d'un fichier JSON ───────────────────────────────
function validateAlbum(filePath) {
  const errors   = []
  const warnings = []

  let data
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (e) {
    return { errors: [`JSON invalide : ${e.message}`], warnings: [] }
  }

  if (data._instructions) {
    errors.push('Fichier template non modifié — supprimer le bloc _instructions')
    return { errors, warnings }
  }

  function check(path, label) {
    const val = path.split('.').reduce((o, k) => o?.[k], data)
    if (!val || (Array.isArray(val) && val.length === 0)) {
      errors.push(`Champ manquant : ${label}`)
      return false
    }
    if (typeof val === 'string' && /^\[.+\]$/.test(val.trim())) {
      warnings.push(`Valeur template non remplacée : ${label}`)
      return false
    }
    return true
  }

  // Champs obligatoires
  check('id',                     'id')
  check('number',                 'number')
  check('publishedAt',            'publishedAt')
  check('artist.name',            'artist.name')
  check('artist.origin',          'artist.origin')
  check('featuredAlbum.title',    'featuredAlbum.title')
  check('featuredAlbum.year',     'featuredAlbum.year')
  check('featuredAlbum.label',    'featuredAlbum.label')
  check('featuredAlbum.genres',   'featuredAlbum.genres')
  check('featuredAlbum.coverUrl', 'featuredAlbum.coverUrl')
  check('meta',                   'meta')
  check('editorial',              'editorial')
  check('video.youtubeId',        'video.youtubeId')
  check('streaming.spotify',      'streaming.spotify')
  check('streaming.appleMusic',   'streaming.appleMusic')
  check('vinyl',                  'vinyl (boutiques)')
  check('discography',            'discography')

  // Éditorial — 3 paragraphes
  if (Array.isArray(data.editorial)) {
    if (data.editorial.length < 3)
      warnings.push(`Éditorial : ${data.editorial.length} paragraphe(s) — 3 recommandés`)
    data.editorial.forEach((p, i) => {
      if (typeof p === 'string' && p.startsWith('§'))
        warnings.push(`Paragraphe ${i+1} contient encore le texte template`)
    })
  }

  // YouTube ID valide
  if (data.video?.youtubeId === 'XXXXXXXXXXX' || (data.video?.youtubeId?.length ?? 0) < 8)
    errors.push('video.youtubeId invalide ou non rempli')

  // Pochette locale — fichier existe ?
  if (data.featuredAlbum?.coverUrl?.startsWith('/covers/')) {
    const coverPath = path.join(COVERS_DIR, path.basename(data.featuredAlbum.coverUrl))
    if (!fs.existsSync(coverPath))
      errors.push(`Pochette introuvable : public${data.featuredAlbum.coverUrl}`)
  }

  // Discographie — au moins 2 entrées
  if (Array.isArray(data.discography) && data.discography.length < 2)
    warnings.push('Discographie incomplète — ajoute les albums précédents')

  // Liens streaming non génériques
  Object.entries(data.streaming || {}).forEach(([platform, url]) => {
    if (url?.includes('XXXX'))
      errors.push(`Lien streaming non rempli : ${platform}`)
  })

  return { errors, warnings }
}

// ── Main ───────────────────────────────────────────────────────
const inputDate = process.argv[2] || new Date().toISOString().split('T')[0]
const lundi = getLundi(inputDate)

console.log('')
console.log(bold('  DiscCover — Validation de la semaine'))
console.log(dim(`  Lundi au vendredi · semaine du ${lundi}`))
console.log('')

let totalErrors   = 0
let totalWarnings = 0
let totalOk       = 0

for (let i = 0; i < 5; i++) {
  const date     = addDays(lundi, i)
  const jour     = JOURS[i]
  const filePath = path.join(ARTISTS_DIR, `${date}.json`)
  const exists   = fs.existsSync(filePath)

  if (!exists) {
    console.log(`  ${red('❌')} ${bold(date)}  ${dim(jour)}  ${red('Fichier manquant')}`)
    totalErrors++
    continue
  }

  const { errors, warnings } = validateAlbum(filePath)

  let artistName = '', albumTitle = ''
  try {
    const d = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    artistName = d.artist?.name ?? ''
    albumTitle = d.featuredAlbum?.title ?? ''
  } catch {}

  const label = `${bold(date)}  ${dim(jour + ' ·')} ${artistName} — ${albumTitle}`

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`  ${green('✅')} ${label}`)
    totalOk++
  } else if (errors.length === 0) {
    console.log(`  ${yellow('⚠️ ')} ${label}`)
    warnings.forEach(w => console.log(`       ${yellow('→')} ${w}`))
    totalWarnings++
  } else {
    console.log(`  ${red('❌')} ${label}`)
    errors.forEach(e => console.log(`       ${red('→')} ${e}`))
    warnings.forEach(w => console.log(`       ${yellow('→')} ${yellow(w)}`))
    totalErrors++
  }
}

console.log('')
console.log('  ' + '─'.repeat(56))
console.log(`  ${green(`✅ ${totalOk} OK`)}  ${yellow(`⚠️  ${totalWarnings} warnings`)}  ${red(`❌ ${totalErrors} erreurs`)}`)
console.log('')

if (totalErrors > 0) {
  console.log(red('  ✗ La semaine n\'est pas prête — corrige les erreurs avant de committer.'))
} else if (totalWarnings > 0) {
  console.log(yellow('  ⚠ La semaine peut être publiée mais vérifie les points signalés.'))
} else {
  console.log(green('  ✓ Tout est bon — tu peux committer et pousser !'))
}
console.log('')