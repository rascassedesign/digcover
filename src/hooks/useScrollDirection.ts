'use client'

import { useState, useEffect, useRef } from 'react'

interface ScrollState {
  direction: 'up' | 'down' | null
  isPastThreshold: boolean
}

/**
 * useScrollDirection — détecte la direction du scroll et le franchissement d'un seuil.
 * Utilisé par la nav pill pour disparaître au scroll down et réapparaître au scroll up.
 */
export function useScrollDirection(threshold = 80): ScrollState {
  const [state, setState] = useState<ScrollState>({ direction: null, isPastThreshold: false })
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      const currentY = window.scrollY
      const direction: 'up' | 'down' = currentY > lastScrollY.current ? 'down' : 'up'
      const isPastThreshold = currentY > threshold

      setState(prev => {
        if (prev.direction === direction && prev.isPastThreshold === isPastThreshold) return prev
        return { direction, isPastThreshold }
      })

      lastScrollY.current = currentY
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return state
}
