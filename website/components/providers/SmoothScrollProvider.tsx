'use client'
import { useEffect, useState, createContext, ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Configure ScrollTrigger defaults for better performance
ScrollTrigger.config({
  ignoreMobileResize: true,
})

// Create context for Lenis instance
export const LenisContext = createContext<Lenis | null>(null)

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Create Lenis instance with optimized settings
    const lenisInstance = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.12,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: true,
    })

    // Store in state so context updates
    setLenis(lenisInstance)

    // Throttled scroll update for better performance
    let ticking = false
    lenisInstance.on('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ScrollTrigger.update()
          ticking = false
        })
        ticking = true
      }
    })

    const rafCallback = (time: number) => {
      lenisInstance.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    // Cleanup
    return () => {
      lenisInstance.destroy()
      gsap.ticker.remove(rafCallback)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
