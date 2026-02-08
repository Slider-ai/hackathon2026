'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Feature {
  id: string
  title: string
  subtitle: string
  description: string
  details: string[]
  chatMessages: { text: string; sender: 'user' | 'slider' }[]
}

const features: Feature[] = [
  {
    id: 'describe-vision',
    title: 'Describe Your Vision',
    subtitle: 'Just tell Slider what you need',
    description: 'Type a simple prompt or use powerful add-ons to supercharge your request. Web Search pulls live data, Generate from Notes turns your bullet points into slides, and more.',
    details: [
      'Web Search - Create slides with real-time research',
      'Generate from Notes - Turn bullet points into presentations',
      'Generate from Image - Build slides from visual references',
      'Summarize - Condense long documents into key slides'
    ],
    chatMessages: [
      { text: 'Create a presentation on the NVIDIA sales report of 2026', sender: 'user' },
      { text: 'Searching for "a presentation on the NVIDIA sales report of 2026"...', sender: 'slider' }
    ]
  },
  {
    id: 'ai-generates',
    title: 'AI Generates Your Slides',
    subtitle: 'Watch research turn into presentations',
    description: 'Slider searches the web, finds relevant sources, and creates professional slides with accurate, up-to-date information. See your presentation take shape in real-time.',
    details: [
      'Finds and cites real sources automatically',
      'Creates structured, research-backed content',
      'Generates multiple slides in seconds',
      'Preview each slide before inserting'
    ],
    chatMessages: [
      { text: 'Found 6 sources. Creating 3 slides with research...', sender: 'slider' },
      { text: 'Here are your 3 slides! You can insert them individually or all at once.', sender: 'slider' }
    ]
  },
  {
    id: 'insert-refine',
    title: 'Insert & Refine',
    subtitle: 'One click to add, then keep improving',
    description: 'Insert all slides at once or pick the ones you want. Then continue the conversation to edit, restyle, or expand your deck. Slider remembers context across your entire session.',
    details: [
      'Insert All or choose individual slides',
      'Edit Current Slide with natural language',
      'Apply Themes to match your brand',
      'Keep chatting to refine any detail'
    ],
    chatMessages: [
      { text: 'Make the title slide more engaging and add a chart to slide 2', sender: 'user' },
      { text: 'Done! Title updated and chart added to slide 2.', sender: 'slider' }
    ]
  }
]

export default function FeatureDeepDive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = containerRef.current?.querySelectorAll('.feature-card')
      const progressDots = containerRef.current?.querySelectorAll('.feature-progress-dot')
      if (!cards || cards.length === 0) return

      // Set initial states - first card visible, others hidden
      gsap.set(cards[0], { autoAlpha: 1, scale: 1 })
      cards.forEach((card, i) => {
        if (i > 0) {
          gsap.set(card, { autoAlpha: 0, scale: 0.8, y: 100 })
        }
      })

      // Set first progress dot as active
      if (progressDots && progressDots[0]) {
        gsap.set(progressDots[0], { backgroundColor: '#c4501e', scale: 1.5 })
      }

      // Track last active index to prevent unnecessary updates
      let lastActiveIndex = 0

      // Create the pinned scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.3,  // Faster scrub
          start: 'top top',
          end: () => `+=${(cards.length) * 100}vh`,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            // Calculate which card is currently active based on progress
            const progress = self.progress
            const newIndex = Math.min(
              Math.floor(progress * cards.length),
              cards.length - 1
            )

            // Only update if index changed (performance optimization)
            if (newIndex !== lastActiveIndex) {
              lastActiveIndex = newIndex
              setActiveIndex(newIndex)

              // Update progress dots with gsap.set for immediate update
              if (progressDots) {
                progressDots.forEach((dot, i) => {
                  if (i === newIndex) {
                    gsap.set(dot, { backgroundColor: '#c4501e', scale: 1.5 })
                  } else {
                    gsap.set(dot, { backgroundColor: '#d6d3d1', scale: 1 })
                  }
                })
              }
            }
          }
        }
      })

      // Animate through each card
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          // Animate current card out
          tl.to(card, {
            autoAlpha: 0,
            scale: 1.1,
            y: -50,
            duration: 1,
            ease: 'power2.inOut',
          })
          // Animate next card in
          tl.to(cards[index + 1], {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          }, '<0.3')

          // Add pause between transitions
          tl.to({}, { duration: 0.5 })
        }
      })

      // Set initial state for chat messages - show all immediately for better performance
      // Instead of animating on scroll, just show them with CSS
      cards.forEach((card) => {
        const messages = card.querySelectorAll('.deep-dive-message')
        gsap.set(messages, { autoAlpha: 1, x: 0 })
      })
    })

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set('.feature-card', { clearProps: 'all' })
      gsap.set('.deep-dive-message', { clearProps: 'all' })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="relative bg-white dark:bg-stone-950 min-h-screen overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-white dark:from-stone-900 dark:via-stone-950 dark:to-stone-950" />

      {/* Cards container - stacked */}
      <div ref={cardsContainerRef} className="relative h-screen flex items-center justify-center">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="feature-card absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
            style={{ zIndex: features.length - index }}
          >
            <div className="max-w-6xl w-full mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left: Content */}
                <div className="space-y-6">
                  <div>
                    <p className="text-burnt-orange uppercase tracking-wide text-sm font-medium mb-2">
                      Step {index + 1} of {features.length}
                    </p>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white mb-4">
                      {feature.title}
                    </h2>
                    <p className="text-xl text-stone-600 dark:text-stone-400">
                      {feature.subtitle}
                    </p>
                  </div>

                  <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature details list */}
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-burnt-orange mt-1 flex-shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Visual/Demo - Slider Interface Mockup */}
                <div className="relative">
                  <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-700">
                    {/* Slider Header */}
                    <div className="p-4 border-b border-stone-200 dark:border-stone-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src="/logo.png" alt="Slider" width={36} height={36} className="rounded" />
                          <div>
                            <p className="text-stone-900 dark:text-white font-semibold">Slider</p>
                            <p className="text-stone-500 dark:text-stone-400 text-xs">Slide creation made simple</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="10" r="3" />
                            <path d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Chat Dropdown + Add Button */}
                    <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-stone-50 dark:bg-stone-700 rounded-lg px-3 py-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                          </svg>
                          <span className="text-stone-600 dark:text-stone-300 text-sm flex-1 truncate">
                            {index === 0 ? 'New Chat' : feature.chatMessages[0]?.text.slice(0, 25) + '...'}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                        <button className="w-9 h-9 rounded-lg bg-stone-50 dark:bg-stone-700 flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500 dark:text-stone-400">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="p-4 space-y-3 min-h-[200px] bg-stone-50/50 dark:bg-stone-800/50">
                      {/* Step 1: Show feature menu */}
                      {index === 0 && (
                        <div className="bg-white dark:bg-stone-700 rounded-xl border border-stone-200 dark:border-stone-600 shadow-lg p-2 w-48 ml-auto">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-600">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
                              Themes
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto"><polyline points="9 18 15 12 9 6" /></svg>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-600">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                              Edit Current Slide
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-burnt-orange/10 text-burnt-orange text-sm font-medium">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                              Web Search
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-600">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                              Generate from notes
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 dark:text-stone-300 text-sm hover:bg-stone-50 dark:hover:bg-stone-600">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                              Generate from Image
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chat messages */}
                      {feature.chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`deep-dive-message rounded-2xl px-4 py-3 text-sm max-w-[85%] ${
                            msg.sender === 'user'
                              ? 'bg-burnt-orange text-white ml-auto'
                              : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}

                      {/* Step 2: Show generated slides preview */}
                      {index === 1 && (
                        <div className="bg-white dark:bg-stone-700 rounded-xl border border-stone-200 dark:border-stone-600 p-3 mt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-stone-900 dark:text-white font-medium text-sm">Generated Slides (3)</span>
                            <button className="flex items-center gap-1 text-burnt-orange text-xs font-medium px-2 py-1 bg-burnt-orange/10 rounded-lg">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                              Insert All
                            </button>
                          </div>
                          <div className="bg-stone-50 dark:bg-stone-600 rounded-lg p-2 text-xs text-stone-600 dark:text-stone-300">
                            <span className="font-medium text-stone-800 dark:text-white">1. NVIDIA&apos;s Financial Growth in 2026</span>
                            <span className="ml-2 text-stone-400">paragraph</span>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Show success state */}
                      {index === 2 && (
                        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                          Changes applied to 3 slides
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500 dark:text-stone-400">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <div className="flex-1 bg-stone-100 dark:bg-stone-700 rounded-xl px-4 py-2.5">
                          <span className="text-stone-400 text-sm">Start a new conversation...</span>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-burnt-orange flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-stone-400 text-[10px] text-center mt-2">Slide 1 / 3</p>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-burnt-orange/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal/10 rounded-full blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {features.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600 feature-progress-dot"
            data-index={i}
          />
        ))}
      </div>
    </div>
  )
}
