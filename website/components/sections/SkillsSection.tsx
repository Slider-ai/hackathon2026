'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Card from '@/components/ui/Card'
import { categories, skillsByCategory } from '@/components/sections/skillsData'

gsap.registerPlugin(ScrollTrigger)

export default function SkillsSection() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Set initial states
        gsap.set(headingRef.current, { autoAlpha: 0, y: 40 })
        gsap.set('.skill-card', { autoAlpha: 0, y: 60 })

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

        // Batch stagger for skill cards
        ScrollTrigger.batch('.skill-card', {
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
        gsap.set([headingRef.current, '.skill-card'], { clearProps: 'all' })
      })

      return () => mm.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="styles"
      className="min-h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white py-20 sm:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-stone-900 dark:text-white">AI-Powered Styles</h2>
          <p className="text-stone-600 dark:text-stone-400 text-lg max-w-2xl mx-auto">
            Automatically detected from your description, or manually choose the perfect style for your presentation.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12 last:mb-0">
            <h3 className="text-burnt-orange uppercase tracking-wide text-sm font-medium mb-6">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsByCategory[category]?.map((skill) => (
                <Card key={skill.id} theme="light" hover className="skill-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-burnt-orange/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-burnt-orange"
                      >
                        {skill.iconPaths.map((d, i) => (
                          <path key={i} d={d} />
                        ))}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">
                        {skill.title}
                      </h4>
                      <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
