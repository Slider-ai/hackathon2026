'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FeatureSlide } from '@/components/ui/FeatureSlide'
import { features } from '@/components/sections/featureData'

gsap.registerPlugin(ScrollTrigger)

export default function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    // Full animation for users with no motion preference
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const numSlides = features.length

      // Create timeline with scrubbed ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.3,  // Faster scrub for better responsiveness
          start: 'top top',
          end: () => `+=${numSlides * 200}vh`,
          invalidateOnRefresh: true,
          fastScrollEnd: true,  // Snap to end on fast scroll
          preventOverlaps: true,
        }
      })

      // Animate slides horizontally with hold between each
      // Skip first slide (index 0) — already visible at start
      // Hold first slide
      tl.to({}, { duration: 0.5 })

      features.forEach((_, index) => {
        if (index > 0) {
          // Slide transition
          tl.to(slidesRef.current, {
            xPercent: -100 * index,
            ease: 'none',
            duration: 1
          })
          // Hold on this slide before moving to next
          tl.to({}, { duration: 0.5 })
        }
      })
    })

    // Fallback for reduced motion users
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Reset any transforms, show slides stacked vertically
      gsap.set(slidesRef.current, { clearProps: 'all' })
      gsap.set('.feature-slide', { clearProps: 'all' })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="features"
      className="h-screen overflow-hidden bg-white dark:bg-stone-950"
    >
      <div
        ref={slidesRef}
        className="flex h-full will-change-transform motion-reduce:flex-col motion-reduce:h-auto motion-reduce:overflow-y-auto"
      >
        {features.map((feature) => (
          <FeatureSlide
            key={feature.id}
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
              >
                {feature.iconPaths.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </svg>
            }
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
}
