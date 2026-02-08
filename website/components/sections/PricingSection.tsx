'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out Slider',
    features: [
      '5 slides per month',
      'Basic Skills',
      'Community support',
      'PowerPoint integration',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'For professionals who need more',
    features: [
      'Unlimited slides',
      'All Skills included',
      'Priority support',
      'PowerPoint integration',
      'Early access to new features',
    ],
    cta: 'Start Pro',
    href: '/signup',
    highlighted: true,
    badge: 'Most Popular',
  },
]

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Set initial states
        gsap.set('.pricing-header', { autoAlpha: 0, y: 30 })
        gsap.set('.pricing-card', { autoAlpha: 0, y: 40 })

        gsap.to('.pricing-header', {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        })

        gsap.to('.pricing-card', {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pricing-grid',
            start: 'top 80%',
            once: true,
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(['.pricing-header', '.pricing-card'], { clearProps: 'all' })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="bg-stone-100 dark:bg-stone-900 py-24 sm:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pricing-header text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-stone-900 dark:bg-stone-800 text-white ring-4 ring-burnt-orange'
                  : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-burnt-orange text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                  {plan.badge}
                </span>
              )}

              {/* Plan Name */}
              <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-5xl font-bold tracking-tight ${plan.highlighted ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                  {plan.price}
                </span>
                <span className={plan.highlighted ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'}>
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mb-8 ${plan.highlighted ? 'text-stone-400' : 'text-stone-600 dark:text-stone-400'}`}>
                {plan.description}
              </p>

              {/* CTA Button */}
              <Link
                href={plan.href}
                className={`block w-full text-center py-3.5 px-6 rounded-full font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-burnt-orange hover:bg-burnt-orange-hover text-white'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={`shrink-0 mt-0.5 ${plan.highlighted ? 'text-burnt-orange' : 'text-teal'}`}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className={plan.highlighted ? 'text-stone-300' : 'text-stone-600 dark:text-stone-400'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <p className="text-center text-stone-500 text-sm mt-12">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
