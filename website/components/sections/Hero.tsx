'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useLenis } from '@/hooks/useLenis'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const lenis = useLenis()

  const scrollToPricing = () => {
    lenis?.scrollTo('#pricing')
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()
    const elements = [
      '.hero-badge',
      '.hero-headline',
      '.hero-subline',
      '.hero-cta',
      '.hero-visual'
    ]

    // Full animation for users with no motion preference
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Set initial state
      gsap.set(elements, { autoAlpha: 0, y: 30 })

      // Animate in
      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.1
      })
    })

    // Simplified animation for reduced motion users
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(elements, { autoAlpha: 0 })
      gsap.to(elements, {
        autoAlpha: 1,
        duration: 0.3,
        stagger: 0.1,
        ease: "none"
      })
    })

    return () => mm.revert()
  }, { scope: heroRef })

  return (
    <section
      ref={heroRef}
      id="hero"
      className="min-h-screen flex items-center bg-stone-50 dark:bg-stone-950 pt-24 pb-20 sm:pt-28 lg:pt-32 lg:pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column — Text content + form */}
          <div>
            {/* Skills mention badge */}
            <span className="hero-badge inline-block text-sm font-medium text-burnt-orange tracking-wide uppercase mb-4">
              AI-Powered Presentation Styles
            </span>

            {/* Headline */}
            <h1 className="hero-headline text-display font-bold text-stone-900 dark:text-white leading-tight">
              Build stunning presentations with AI, right inside PowerPoint
            </h1>

            {/* Subline */}
            <p className="hero-subline text-xl text-stone-600 dark:text-stone-400 mt-6 max-w-lg">
              Slider is your AI copilot that lives in your PowerPoint sidebar. Use expert-crafted Styles to create professional decks in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta mt-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button variant="primary" size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <button
                  onClick={scrollToPricing}
                  className="px-8 py-4 text-lg rounded-full font-medium border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  View Pricing
                </button>
              </div>
              <p className="text-stone-500 text-sm mt-3">
                No credit card required. Free plan available.
              </p>
            </div>
          </div>

          {/* Right column — PowerPoint sidebar mockup */}
          <div className="hero-visual relative w-full max-w-lg mx-auto lg:mx-0">
            {/* PowerPoint window chrome */}
            <div className="bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700 overflow-hidden shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-stone-200 dark:bg-stone-700 border-b border-stone-300 dark:border-stone-600">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-stone-600 dark:text-stone-300 text-xs ml-2">Sales Pitch.pptx</span>
              </div>

              {/* Content area with sidebar */}
              <div className="flex">
                {/* Main slide area */}
                <div className="flex-1 p-4 min-h-[280px] bg-stone-400 flex items-center justify-center">
                  <div className="w-full bg-amber-50 rounded shadow-lg p-4">
                    <h3 className="text-burnt-orange font-semibold text-sm mb-2">Introduction to TeamFlow</h3>
                    <div className="space-y-1.5">
                      <div className="w-full h-1.5 bg-stone-200 rounded"></div>
                      <div className="w-4/5 h-1.5 bg-stone-200 rounded"></div>
                      <div className="w-3/5 h-1.5 bg-stone-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Slider sidebar */}
                <div className="w-[180px] bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-700 flex flex-col">
                  {/* Header */}
                  <div className="p-3 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-2">
                      <img src="/logo.png" alt="Slider" width={20} height={20} className="rounded" />
                      <div>
                        <p className="text-stone-900 dark:text-white text-xs font-semibold">Slider</p>
                        <p className="text-stone-500 dark:text-stone-400 text-[8px]">Slide creation made simple</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat bubbles */}
                  <div className="flex-1 p-2 space-y-2">
                    <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-2 text-[10px] text-stone-700 dark:text-stone-300">
                      Hi! What would you like to create?
                    </div>
                    <div className="bg-burnt-orange rounded-lg p-2 text-[10px] text-white ml-2">
                      A sales pitch for TeamFlow
                    </div>
                    <div className="bg-stone-100 dark:bg-stone-800 rounded-lg p-2 text-[10px] text-stone-700 dark:text-stone-300">
                      Building your deck now...
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="p-2 border-t border-stone-200 dark:border-stone-700">
                    <div className="bg-stone-100 dark:bg-stone-800 rounded-lg px-2 py-1.5">
                      <span className="text-stone-400 text-[8px]">Type a message...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
