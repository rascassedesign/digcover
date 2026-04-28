'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { ColorTheme } from '@/types'

// ═══════════════════════════════════════════════════
// HELPERS — partagés light + dark
// ═══════════════════════════════════════════════════
function lighten(rgb: [number,number,number], amt: number): [number,number,number] {
  return rgb.map(c => Math.round(c + (255 - c) * amt)) as [number,number,number]
}
function darken(rgb: [number,number,number], amt: number): [number,number,number] {
  return rgb.map(c => Math.round(c * (1 - amt))) as [number,number,number]
}
function mid(rgb: [number,number,number], amt: number): [number,number,number] {
  return rgb.map(c => Math.round(c + (255 - c) * amt * 0.5)) as [number,number,number]
}
function toHex(r: number, g: number, b: number): string {
  return '#' + [r,g,b].map(c => Math.round(c).toString(16).padStart(2,'0')).join('')
}
function rgbToHsl(r: number, g: number, b: number): [number,number,number] {
  r/=255; g/=255; b/=255
  const max=Math.max(r,g,b), min=Math.min(r,g,b)
  let h=0, s=0; const l=(max+min)/2
  if(max!==min){
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min)
    switch(max){
      case r: h=((g-b)/d+(g<b?6:0))/6; break
      case g: h=((b-r)/d+2)/6; break
      case b: h=((r-g)/d+4)/6; break
    }
  }
  return [h*360, s*100, l*100]
}
function hslToRgb(h: number, s: number, l: number): [number,number,number] {
  h/=360; s/=100; l/=100
  let r: number, g: number, b: number
  if (s === 0) { r = g = b = l }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
function pickVibrant(palette: [number,number,number][]): string {
  const scored = palette.map(rgb => {
    const [,s,l] = rgbToHsl(...rgb)
    return { rgb, score: s * (1 - Math.abs(l - 55) / 55) }
  }).sort((a,b) => b.score - a.score)
  return toHex(...scored[0].rgb)
}

// ═══════════════════════════════════════════════════
// HELPERS DARK — calculs HSL pour le système de tinting
// ═══════════════════════════════════════════════════

/**
 * darkenWithComplement — dominante très assombrie + soupçon de complémentaire.
 * Utilisé pour le fond principal du dégradé (--theme-dark).
 * H + 12°, S × 0.6 (min 18%), L = 14%.
 */
export function darkenWithComplement(rgb: [number,number,number]): [number,number,number] {
  const [h, s] = rgbToHsl(...rgb)
  const newH = (h + 12) % 360
  const newS = Math.max(s * 0.6, 18)
  const newL = 14
  return hslToRgb(newH, newS, newL)
}

/**
 * deepDark — quasi noir avec une infime trace de la teinte album.
 * Utilisé pour le bord du dégradé (--theme-deep).
 * S × 0.45 (min 12%), L = 6%.
 */
export function deepDark(rgb: [number,number,number]): [number,number,number] {
  const [h, s] = rgbToHsl(...rgb)
  return hslToRgb(h, Math.max(s * 0.45, 12), 6)
}

/**
 * accentTint — version claire de l'accent avec teinte album perceptible.
 * Utilisé pour les CTA (streaming + shops) sur fond sombre (--theme-tint).
 * S × 0.6 (max 48%), L = 86%.
 */
export function accentTint(rgb: [number,number,number]): [number,number,number] {
  const [h, s] = rgbToHsl(...rgb)
  const newL = 86
  const newS = Math.min(s * 0.6, 48)
  return hslToRgb(h, newS, newL)
}

// ═══════════════════════════════════════════════════
// EXTRACTION COULEUR — inchangé par rapport à l'existant
// ═══════════════════════════════════════════════════
async function extractColors(imageUrl: string): Promise<ColorTheme | null> {
  return new Promise(resolve => {
    const img = new Image()
    if (!imageUrl.startsWith('/')) img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const SIZE = 150
        const canvas = document.createElement('canvas')
        canvas.width = SIZE; canvas.height = SIZE
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }

        ctx.drawImage(img, 0, 0, SIZE, SIZE)
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE)

        const buckets = new Map<string, { rgb: [number,number,number], count: number }>()
        for (let i=0; i<data.length; i+=4) {
          if (data[i+3] < 128) continue
          const r = Math.round(data[i]   / 16) * 16
          const g = Math.round(data[i+1] / 16) * 16
          const b = Math.round(data[i+2] / 16) * 16
          const br = (r+g+b)/3
          if (br < 15 || br > 240) continue
          const key = `${r},${g},${b}`
          const e = buckets.get(key)
          if (e) e.count++
          else buckets.set(key, { rgb:[r,g,b], count:1 })
        }

        const top = Array.from(buckets.values())
          .sort((a,b) => b.count - a.count)
          .slice(0, 20)
          .map(e => e.rgb)

        if (!top.length) { resolve(null); return }

        const dominant = top[0]
        resolve({
          accent:      dominant,
          accentLight: lighten(dominant, 0.72),
          accentDark:  darken(dominant, 0.3),
          contrast:    pickVibrant(top),
        })
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = imageUrl
  })
}

// ═══════════════════════════════════════════════════
// THÈME LIGHT (existant, inchangé)
// ═══════════════════════════════════════════════════
export const DEFAULT_THEME: ColorTheme = {
  accent:      [44, 44, 42],
  accentLight: [241, 239, 232],
  accentDark:  [20, 20, 18],
  contrast:    '#FFDE42',
}

export function applyTheme(theme: ColorTheme) {
  const root = document.documentElement
  const [ar,ag,ab] = theme.accent
  const [lr,lg,lb] = theme.accentLight
  const [dr,dg,db] = theme.accentDark

  const mr = Math.round((ar + lr) / 2)
  const mg = Math.round((ag + lg) / 2)
  const mb = Math.round((ab + lb) / 2)

  root.style.setProperty('--theme-accent',     `${ar}, ${ag}, ${ab}`)
  root.style.setProperty('--theme-light',      `${lr}, ${lg}, ${lb}`)
  root.style.setProperty('--theme-mid',        `${mr}, ${mg}, ${mb}`)
  root.style.setProperty('--theme-dark',       `${dr}, ${dg}, ${db}`)
  root.style.setProperty('--theme-contrast',    theme.contrast)
  root.style.setProperty('--theme-accent-hex',  toHex(ar, ag, ab))
  root.style.setProperty('--theme-light-hex',   toHex(lr, lg, lb))
}

export function resetTheme() { applyTheme(DEFAULT_THEME) }

// ═══════════════════════════════════════════════════
// THÈME DARK — système principal de tinting du site
// ═══════════════════════════════════════════════════

/**
 * Interpolation HSL la plus courte sur le hue.
 * Pour passer de jaune (60°) à bleu (240°), on prend le chemin court (180°)
 * pas le chemin long qui passerait par marron.
 */
function lerpHue(h1: number, h2: number, t: number): number {
  const diff = ((h2 - h1 + 540) % 360) - 180
  return (h1 + diff * t + 360) % 360
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function interpolateHsl(
  from: [number, number, number],
  to: [number, number, number],
  t: number
): [number, number, number] {
  return [lerpHue(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)]
}

// Easing cubic-bezier(0.4, 0, 0.2, 1) — équivalent CSS ease-out
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// Conserver l'accent courant pour interpoler depuis lui
let currentAccent: [number, number, number] | null = null
let currentAnimFrame: number | null = null

/**
 * applyDarkTheme — applique le set de tokens dark-first à partir de l'accent.
 * Interpole en HSL sur 600ms pour éviter les couleurs intermédiaires sales en RGB.
 * Set : --theme-accent, --theme-tint, --theme-dark, --theme-deep sur :root.
 */
export function applyDarkTheme(accent: [number, number, number], animate = true) {
  const target = document.documentElement

  // Cancel any in-flight animation
  if (currentAnimFrame !== null) {
    cancelAnimationFrame(currentAnimFrame)
    currentAnimFrame = null
  }

  // Si reduced-motion ou première application, on saute directement à la valeur cible
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!animate || !currentAccent || prefersReducedMotion) {
    setAccentTokens(target, accent)
    currentAccent = accent
    return
  }

  // Animation HSL : convertir from + to en HSL, interpoler, reconvertir en RGB
  const fromHsl = rgbToHsl(...currentAccent)
  const toHsl = rgbToHsl(...accent)
  const startTime = performance.now()
  const duration = 600

  const tick = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOut(progress)

    const interpolatedHsl = interpolateHsl(fromHsl, toHsl, eased)
    const interpolatedRgb = hslToRgb(...interpolatedHsl)
    setAccentTokens(target, interpolatedRgb)

    if (progress < 1) {
      currentAnimFrame = requestAnimationFrame(tick)
    } else {
      // Snap à la valeur finale exacte pour éviter les arrondis
      setAccentTokens(target, accent)
      currentAccent = accent
      currentAnimFrame = null
    }
  }

  currentAnimFrame = requestAnimationFrame(tick)
}

function setAccentTokens(target: HTMLElement, accent: [number, number, number]) {
  const [ar, ag, ab] = accent
  const [tr, tg, tb] = accentTint(accent)
  const [dr, dg, db] = darkenWithComplement(accent)
  const [pr, pg, pb] = deepDark(accent)

  target.style.setProperty('--theme-accent', `${ar}, ${ag}, ${ab}`)
  target.style.setProperty('--theme-tint', `${tr}, ${tg}, ${tb}`)
  target.style.setProperty('--theme-dark', `${dr}, ${dg}, ${db}`)
  target.style.setProperty('--theme-deep', `${pr}, ${pg}, ${pb}`)
  target.style.setProperty('--theme-accent-hex', toHex(ar, ag, ab))
}

const DEFAULT_DARK_ACCENT: [number, number, number] = [232, 168, 124]

export function resetDarkTheme() {
  const target = document.documentElement
  if (currentAnimFrame !== null) {
    cancelAnimationFrame(currentAnimFrame)
    currentAnimFrame = null
  }
  currentAccent = null
  // Cleanup : on retire les variables pour laisser les valeurs CSS reprendre la main
  target.style.removeProperty('--theme-accent')
  target.style.removeProperty('--theme-tint')
  target.style.removeProperty('--theme-dark')
  target.style.removeProperty('--theme-deep')
  target.style.removeProperty('--theme-accent-hex')
}

// ═══════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════

/**
 * useColorTheme — hook existant, applique le thème light. Inchangé.
 */
export function useColorTheme(coverUrl: string | null | undefined) {
  const [theme, setTheme] = useState<ColorTheme>(DEFAULT_THEME)
  const [isExtracting, setIsExtracting] = useState(false)
  const prevUrl = useRef<string | null>(null)

  const extract = useCallback(async (url: string) => {
    if (url === prevUrl.current) return
    prevUrl.current = url
    setIsExtracting(true)
    const result = await extractColors(url)
    const resolved = result ?? DEFAULT_THEME
    setTheme(resolved)
    applyTheme(resolved)
    setIsExtracting(false)
  }, [])

  useEffect(() => {
    if (!coverUrl) { resetTheme(); setTheme(DEFAULT_THEME); return }
    extract(coverUrl)
  }, [coverUrl, extract])

  useEffect(() => () => { resetTheme() }, [])

  return { theme, isExtracting }
}

/**
 * useDarkColorTheme — extrait l'accent depuis la pochette et applique le thème dark.
 * Cleanup sur démontage.
 */
export function useDarkColorTheme(coverUrl: string | null | undefined) {
  const [accent, setAccent] = useState<[number,number,number]>(DEFAULT_DARK_ACCENT)
  const [isExtracting, setIsExtracting] = useState(false)
  const prevUrl = useRef<string | null>(null)

  const extract = useCallback(async (url: string) => {
    if (url === prevUrl.current) return
    prevUrl.current = url
    setIsExtracting(true)
    const result = await extractColors(url)
    const resolvedAccent = result?.accent ?? DEFAULT_DARK_ACCENT
    setAccent(resolvedAccent)
    applyDarkTheme(resolvedAccent)
    setIsExtracting(false)
  }, [])

  useEffect(() => {
    if (!coverUrl) { resetDarkTheme(); setAccent(DEFAULT_DARK_ACCENT); return }
    extract(coverUrl)
  }, [coverUrl, extract])

  useEffect(() => () => { resetDarkTheme() }, [])

  return { accent, isExtracting }
}
