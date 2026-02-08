'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useLenis } from '@/hooks/useLenis'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const containerRef = useRef<HTMLElement>(null)
  const lenis = useLenis()

  const scrollToPricing = () => {
    lenis?.scrollTo('#pricing')
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const elements = ['.cta-heading', '.cta-subline', '.cta-buttons']

        // Set initial states
        gsap.set(elements, { autoAlpha: 0, y: 40 })

        gsap.to(elements, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          }
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['.cta-heading', '.cta-subline', '.cta-buttons'], { clearProps: 'all' })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="cta"
      className="bg-burnt-orange text-white py-24 sm:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="cta-heading text-4xl sm:text-5xl font-bold mb-4">
          Ready to Build Smarter Presentations?
        </h2>

        <p className="cta-subline text-lg text-white/80 max-w-2xl mx-auto mb-10">
          Start with our free plan or go Pro for unlimited slides. No credit card required.
        </p>

        <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <button className="px-8 py-4 text-lg rounded-full font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer">
              Get Started Free
            </button>
          </Link>
          <button
            onClick={scrollToPricing}
            className="px-8 py-3.5 rounded-full font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            View Pricing
          </button>
        </div>
      </div>
    </section>
  )
}
