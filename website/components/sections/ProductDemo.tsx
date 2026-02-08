'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DemoFrame } from '@/components/ui/DemoFrame'
import { demoSteps } from '@/components/sections/demoData'

gsap.registerPlugin(ScrollTrigger)

export default function ProductDemo() {
  const containerRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const walkthroughRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Get walkthrough step (first step with large gridSpan)
  const walkthroughStep = demoSteps[0]

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Set initial states
      gsap.set(headingRef.current, { autoAlpha: 0, y: 40 })

      // 1. Heading fade-in (triggers before pinning starts)
      gsap.to(headingRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: walkthroughRef.current,
          start: 'top 80%',
          once: true,
        }
      })

      // 2. Sidebar walkthrough timeline (pinned, scrub)
      const chatBubbles = containerRef.current?.querySelectorAll('.demo-chat-bubble')
      const slideContent = containerRef.current?.querySelector('.demo-slide-content')
      const slideThumbnails = containerRef.current?.querySelectorAll('.demo-slide-thumb')

      if (walkthroughRef.current && chatBubbles && chatBubbles.length > 0) {
        // Initially hide all chat bubbles and slide content
        gsap.set(chatBubbles, { autoAlpha: 0, y: 20 })
        if (slideContent) gsap.set(slideContent, { autoAlpha: 0 })
        if (slideThumbnails) gsap.set(slideThumbnails, { autoAlpha: 0.3 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: walkthroughRef.current,
            pin: true,
            scrub: 0.3,  // Faster scrub
            start: 'top 5%',
            end: () => `+=${chatBubbles.length * 50}vh`,
            invalidateOnRefresh: true,
            pinSpacing: true,
            fastScrollEnd: true,
            preventOverlaps: true,
          }
        })

        // Sequentially reveal each chat bubble
        chatBubbles.forEach((bubble, index) => {
          tl.to(bubble, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          })

          // At message 4 (index 3), start showing the slide content
          if (index === 3 && slideContent) {
            tl.to(slideContent, {
              autoAlpha: 1,
              duration: 0.5,
              ease: 'power2.out',
            }, '<')
            // Light up first thumbnail
            if (slideThumbnails && slideThumbnails[0]) {
              tl.to(slideThumbnails[0], { autoAlpha: 1, duration: 0.3 }, '<')
            }
          }

          // At message 5 (index 4), light up more thumbnails
          if (index === 4 && slideThumbnails && slideThumbnails.length > 1) {
            tl.to([slideThumbnails[1], slideThumbnails[2]], {
              autoAlpha: 1,
              duration: 0.3,
              stagger: 0.1,
            }, '<0.3')
          }

          // At message 6 (index 5), light up remaining thumbnails
          if (index === 5 && slideThumbnails && slideThumbnails.length > 3) {
            tl.to([slideThumbnails[3], slideThumbnails[4]], {
              autoAlpha: 1,
              duration: 0.3,
              stagger: 0.1,
            }, '<0.3')
          }

          // Add spacer between bubbles
          if (index < chatBubbles.length - 1) {
            tl.to({}, { duration: 0.4 })
          }
        })
      }

      // 3. Parallax background shapes
      gsap.utils.toArray<HTMLElement>('.parallax-shape').forEach((shape, i) => {
        gsap.to(shape, {
          yPercent: 30 + (i * 20),
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      })
    })

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Show all elements without animation
      gsap.set('.demo-chat-bubble', { clearProps: 'all' })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="demo"
      className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white relative overflow-hidden"
    >
      {/* Parallax background shapes */}
      <div className="parallax-shape w-64 h-64 bg-burnt-orange/10 rounded-full blur-3xl absolute -top-32 -left-16" />
      <div className="parallax-shape w-48 h-48 bg-teal/10 rounded-full blur-3xl absolute bottom-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 relative z-10">
        {/* Full-width pinned walkthrough with heading */}
        <div ref={walkthroughRef} className="mb-16 lg:mb-24 will-change-transform">
          {/* Section heading - now inside pinned container */}
          <div ref={headingRef} className="demo-heading text-center mb-8 lg:mb-12">
            <p className="text-burnt-orange uppercase tracking-wide text-sm font-medium mb-3">
              See It In Action
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-stone-900 dark:text-white">
              Watch Slider Build Your Deck
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-lg max-w-2xl mx-auto">
              From opening the sidebar to final polish, see how Slider transforms your presentation workflow with AI-powered Styles.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <DemoFrame
              data-step="sidebar-walkthrough"
              sidebarContent={
                <div ref={sidebarRef} className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-3 border-b border-stone-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Slider" width={28} height={28} className="rounded" />
                        <div>
                          <p className="text-stone-900 text-sm font-semibold">Slider</p>
                          <p className="text-stone-500 text-[10px]">Slide creation made simple</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="10" r="3" />
                          <path d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                    {walkthroughStep.sidebarMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`demo-chat-bubble rounded-xl p-3 text-xs opacity-0 invisible ${
                          msg.sender === 'user'
                            ? 'bg-burnt-orange text-white ml-4'
                            : 'bg-stone-100 text-stone-700 mr-4'
                        }`}
                        data-bubble-index={i}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  {/* Input area */}
                  <div className="p-3 border-t border-stone-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                      <div className="flex-1 bg-stone-100 rounded-lg px-3 py-2">
                        <span className="text-stone-400 text-[10px]">Start a new conversation...</span>
                      </div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                          <path d="M22 2L11 13" />
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-stone-400 text-[10px] text-center mt-2">Slide 1 / 5</p>
                  </div>
                </div>
              }
            >
              {/* PowerPoint-style layout with slide thumbnails */}
              <div className="w-full h-full flex">
                {/* Slide thumbnails panel */}
                <div className="w-24 lg:w-28 bg-stone-200 border-r border-stone-300 p-2 space-y-2 flex-shrink-0">
                  {[
                    { num: 1, title: 'Introduction to TeamFlow', hasContent: true },
                    { num: 2, title: 'The Problem', hasContent: true },
                    { num: 3, title: 'Our Solution', hasContent: true },
                    { num: 4, title: 'Key Features', hasContent: true },
                    { num: 5, title: 'Pricing & CTA', hasContent: true },
                  ].map((slide) => (
                    <div key={slide.num} className="flex items-start gap-1">
                      <span className="text-[10px] text-stone-500 mt-1">{slide.num}</span>
                      <div
                        className={`demo-slide-thumb flex-1 aspect-[16/10] bg-amber-50 rounded border-2 opacity-30 ${
                          slide.num === 1 ? 'border-burnt-orange' : 'border-stone-300'
                        } p-1 overflow-hidden`}
                      >
                        <p className="text-burnt-orange text-[6px] font-medium truncate">{slide.title}</p>
                        <div className="mt-0.5 space-y-0.5">
                          <div className="w-full h-0.5 bg-stone-300 rounded"></div>
                          <div className="w-3/4 h-0.5 bg-stone-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main slide area */}
                <div className="flex-1 p-4 lg:p-6 flex flex-col bg-stone-400">
                  <div className="demo-slide-content flex-1 bg-amber-50 rounded shadow-lg p-4 lg:p-6 flex flex-col opacity-0 invisible">
                    {/* Title slide content */}
                    <h3 className="text-burnt-orange font-semibold text-base lg:text-xl mb-3">Introduction to TeamFlow</h3>
                    <div className="space-y-2 text-stone-700 text-[10px] lg:text-xs leading-relaxed">
                      <p>TeamFlow has revolutionized how remote teams collaborate, serving thousands of companies worldwide.</p>
                      <p>This presentation will explore our key features, competitive advantages, and why TeamFlow is the right choice for your organization.</p>
                    </div>
                  </div>
                  {/* Notes area */}
                  <div className="mt-2 text-stone-500 text-[10px]">Click to add notes</div>
                </div>
              </div>
            </DemoFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
