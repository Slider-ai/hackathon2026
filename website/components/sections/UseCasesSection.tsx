'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Card from '@/components/ui/Card'
import { useCases } from '@/components/sections/useCaseData'

gsap.registerPlugin(ScrollTrigger)

export default function UseCasesSection() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Set initial states
        gsap.set(headingRef.current, { autoAlpha: 0, y: 40 })
        gsap.set('.use-case-card', { autoAlpha: 0, y: 60 })

        // Heading fade-in
        gsap.to(headingRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            once: true,
          }
        })

        // Batch stagger for use case cards
        ScrollTrigger.batch('.use-case-card', {
          onEnter: (elements) => {
            gsap.to(elements, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out'
            })
          },
          start: 'top 85%',
          once: true
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([headingRef.current, '.use-case-card'], { clearProps: 'all' })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="use-cases"
      className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white py-20 sm:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-stone-900 dark:text-white">Built for Every Team</h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg max-w-2xl mx-auto">
            No matter your role, Slider helps you create presentations that make an impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map(useCase => (
            <Card key={useCase.id} theme="light" hover className="use-case-card">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-burnt-orange/10 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-burnt-orange"
                  >
                    {useCase.iconPaths.map((d, i) => (
                      <path key={i} d={d} />
                    ))}
                  </svg>
                </div>
                <div>
                  <p className="text-burnt-orange text-xs uppercase tracking-wide font-medium mb-2">
                    {useCase.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
