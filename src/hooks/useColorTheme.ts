'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { ColorTheme } from '@/types'

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
function pickVibrant(palette: [number,number,number][]): string {
  const scored = palette.map(rgb => {
    const [,s,l] = rgbToHsl(...rgb)
    return { rgb, score: s * (1 - Math.abs(l - 55) / 55) }
  }).sort((a,b) => b.score - a.score)
  return toHex(...scored[0].rgb)
}

async function extractColors(imageUrl: string): Promise<ColorTheme|null> {
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
          accentLight: lighten(dominant, 0.72),  // assez visible mais pas criard
          accentDark:  darken(dominant, 0.3),
          contrast:    pickVibrant(top),
        })
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = imageUrl
  })
}

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

  // Calcul intermédiaire (mid)
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

export function useColorTheme(coverUrl: string|null|undefined) {
  const [theme, setTheme] = useState<ColorTheme>(DEFAULT_THEME)
  const [isExtracting, setIsExtracting] = useState(false)
  const prevUrl = useRef<string|null>(null)

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
