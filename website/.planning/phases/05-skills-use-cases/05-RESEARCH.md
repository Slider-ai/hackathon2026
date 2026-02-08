# Phase 5: Skills & Use Cases - Research

**Researched:** 2026-02-08
**Domain:** Card grid layouts with category labels, scroll-triggered staggered reveals, Skills/use case content strategy
**Confidence:** HIGH

## Summary

Phase 5 implements two card grid sections showcasing Slider's AI Skills presets and use case scenarios. The Skills section displays skill cards grouped by category labels (Sales, Education, Startup) on a light background (stone-100), while Use Cases shows industry/role-specific scenarios on a dark background (stone-950). Both sections use ScrollTrigger.batch() for efficient staggered reveal animations as cards enter the viewport.

This phase differs from Phase 3's pinned horizontal scroll and Phase 4's sequential timeline—here we have two independent static card grids that simply fade in with stagger as users scroll past them. The established pattern is ScrollTrigger.batch() with onEnter callback, which automatically groups elements that trigger around the same time and animates them with a stagger.

Skills cards showcase specific AI preset capabilities (e.g., "Sales Pitch Builder", "Lesson Plan Creator") that represent the core product value proposition. These aren't generic features—they're concrete, named skills that users select in the sidebar. Use cases illustrate who benefits and how (e.g., "Sales Teams: Create winning pitch decks", "Marketing: Build campaign reports").

**Key architectural decisions:**
- Two separate data modules: `skillsData.ts` and `useCaseData.ts` following established pure TypeScript pattern
- Skills section: Light theme Card components with simple hover (scale + shadow lift), not BentoCard flashlight effect
- Use Cases section: Dark theme Card components, could use BentoCard if cursor flashlight adds value
- ScrollTrigger.batch() called separately for `.skill-card` and `.use-case-card` classes
- Category labels use simple text styling (uppercase, tracking-wide, text-sm, font-medium, color accent)
- Icon representation via SVG path arrays (iconPaths) matching featureData.ts pattern

**Primary recommendation:** Create skillsData.ts and useCaseData.ts with typed interfaces, use Card component for Skills (light theme, hover: true), optionally use BentoCard for Use Cases (dark theme), implement two separate ScrollTrigger.batch() calls in client components SkillsSection and UseCasesSection, group Skills visually with category label headings.

## Standard Stack

The established libraries/tools for card grid reveals:

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.14.2 | Animation engine | ScrollTrigger.batch() provides efficient grouped animations |
| @gsap/react | 2.1.2 | React integration | useGSAP hook with scope for cleanup |
| ScrollTrigger | 3.14.2 | Scroll-triggered reveals | batch() method groups elements that enter viewport together |
| Next.js | 16.1.6 | Framework | Client components for scroll animations, server components for data |
| Tailwind CSS | 4.x | Styling | Grid layouts, card styling, responsive breakpoints |

### Supporting (Already in Project)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lenis | 1.3.17 | Smooth scroll | Already integrated, provides premium scroll feel |
| Card.tsx | Custom | Card UI component | Light/dark themes with hover prop for simple interactions |
| BentoCard.tsx | Custom | Enhanced card with cursor effect | Dark theme cards with flashlight interaction |

### No Additional Libraries Required
All dependencies already installed from Phase 1. No new packages needed.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ScrollTrigger.batch() | Individual ScrollTriggers per card | Batch is more efficient, reduces memory overhead for 6-9+ cards |
| Card component | BentoCard for all | BentoCard flashlight effect looks best on dark backgrounds, Skills are on light |
| Category label headings | Tabs or filters | Static labels simpler, no interaction state to manage, better for linear scroll narrative |
| SVG iconPaths array | Icon library (Lucide, Heroicons) | iconPaths pattern established in featureData.ts, keeps consistency |

**Installation:**
```bash
# No installation required — all dependencies from Phase 1
```

## Architecture Patterns

### Recommended Project Structure
```
components/
├── sections/
│   ├── SkillsSection.tsx       # Client component with batch reveal for Skills
│   ├── UseCasesSection.tsx     # Client component with batch reveal for Use Cases
│   ├── skillsData.ts           # Pure TypeScript: Skill[] with categories
│   └── useCaseData.ts          # Pure TypeScript: UseCase[] with icons
└── ui/
    ├── Card.tsx                # Existing: light/dark theme, simple hover
    └── BentoCard.tsx           # Existing: dark theme, cursor flashlight
```

### Pattern 1: ScrollTrigger.batch() for Card Grid Stagger
**What:** Group cards that enter viewport together, animate with stagger
**When to use:** Any grid of 3+ cards that should reveal on scroll
**Example:**
```typescript
// Source: https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch()
// Verified: Official GSAP documentation + ProductDemo.tsx implementation

'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SkillsSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Batch animate skill cards as they enter viewport
      ScrollTrigger.batch('.skill-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.15,  // 150ms between each card
            ease: 'power2.out',
          })
        },
        start: 'top 85%',  // Trigger when card top hits 85% viewport height
        once: true,  // Fire only once per card
      })
    })

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Show all cards without animation
      gsap.set('.skill-card', { clearProps: 'all' })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="min-h-screen bg-stone-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">AI-Powered Skills</h2>

        {/* Category: Sales */}
        <div className="mb-12">
          <h3 className="text-burnt-orange uppercase tracking-wide text-sm font-medium mb-6">
            Sales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card theme="light" hover className="skill-card">
              {/* Skill content */}
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Key principles:**
- Use `.skill-card` class selector for batch target
- `onEnter` receives array of elements that triggered around same time
- `stagger: 0.15` creates sequential reveal (150ms delay between cards)
- `once: true` prevents re-triggering on scroll up
- `start: 'top 85%'` triggers before card fully enters (feels responsive)

### Pattern 2: Category-Grouped Card Grid Layout
**What:** Cards organized under category label headings with visual hierarchy
**When to use:** When items naturally group into 2-4 distinct categories
**Example:**
```tsx
// Source: Bento grid patterns from UI design trends 2026 + Square design reference
// Verified: Multiple web design sources emphasize category labels with consistent spacing

export default function SkillsSection() {
  const categories = ['Sales', 'Education', 'Startup']
  const skillsByCategory = {
    Sales: [/* sales skills */],
    Education: [/* education skills */],
    Startup: [/* startup skills */]
  }

  return (
    <section className="min-h-screen bg-stone-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          AI-Powered Skills
        </h2>

        {categories.map((category) => (
          <div key={category} className="mb-12 last:mb-0">
            {/* Category label with accent color */}
            <h3 className="text-burnt-orange uppercase tracking-wide text-sm font-medium mb-6">
              {category}
            </h3>

            {/* Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsByCategory[category].map((skill) => (
                <Card key={skill.id} theme="light" hover className="skill-card">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-burnt-orange/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-burnt-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        {skill.iconPaths.map((d, i) => (
                          <path key={i} d={d} strokeWidth="1.5" />
                        ))}
                      </svg>
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-lg font-semibold text-stone-900 mb-2">
                        {skill.title}
                      </h4>
                      <p className="text-stone-600 text-sm">
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
```

**Key principles:**
- Category labels use accent color (burnt-orange), uppercase, tracking-wide
- Consistent `mb-12` between category groups creates visual rhythm
- Grid gap-6 provides breathing room without excessive whitespace
- Cards within category animate together via batch

### Pattern 3: Pure TypeScript Data Module
**What:** Separate .ts file with typed interface and exported array, no JSX
**When to use:** All content data that doesn't require dynamic rendering logic
**Example:**
```typescript
// Source: featureData.ts and demoData.ts patterns from existing codebase
// Verified: Established project convention

// skillsData.ts
export interface Skill {
  id: string
  category: 'Sales' | 'Education' | 'Startup'
  title: string
  description: string
  iconPaths: string[]  // SVG path 'd' attributes
}

export const skills: Skill[] = [
  {
    id: 'sales-pitch',
    category: 'Sales',
    title: 'Sales Pitch Builder',
    description: 'Create compelling pitch decks with proven frameworks for discovery, demo, and close.',
    iconPaths: [
      'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
    ]
  },
  // ... more skills
]

// Utility: Group skills by category for rendering
export const skillsByCategory = skills.reduce((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = []
  acc[skill.category].push(skill)
  return acc
}, {} as Record<string, Skill[]>)

export const categories = ['Sales', 'Education', 'Startup'] as const
```

```typescript
// useCaseData.ts
export interface UseCase {
  id: string
  title: string
  subtitle: string  // "For Sales Teams", "For Marketing"
  description: string
  iconPaths: string[]
}

export const useCases: UseCase[] = [
  {
    id: 'sales-teams',
    title: 'Win More Deals',
    subtitle: 'For Sales Teams',
    description: 'Create winning pitch decks that close deals. Customize presentations for every prospect in minutes.',
    iconPaths: [
      'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
    ]
  },
  // ... more use cases
]
```

**Key principles:**
- Pure TypeScript, no React imports
- Typed interface exported for type safety
- iconPaths array matches featureData.ts pattern
- Utility functions (grouping, filtering) in same file
- No default export, named exports for interface + data

### Pattern 4: Light vs Dark Card Hover Strategies
**What:** Different hover effects for light and dark backgrounds
**When to use:** Skills (light bg) vs Use Cases (dark bg)
**Example:**
```tsx
// Skills Section: Light background, simple hover
// Source: Card.tsx existing implementation + CSS hover best practices 2026

<Card theme="light" hover className="skill-card">
  {/* Content */}
</Card>

// Card.tsx hover implementation:
// hover:shadow-card-hover (lifts shadow depth)
// Combined with optional scale via group-hover in parent

// Use Cases Section: Dark background, optional cursor flashlight
// Source: BentoCard.tsx existing implementation

// Option 1: BentoCard with flashlight effect
<BentoCard gridSpan="medium" className="use-case-card">
  {/* Content */}
</BentoCard>

// Option 2: Simple Card on dark
<Card theme="dark" hover className="use-case-card">
  {/* Content */}
</Card>
```

**Recommendation:**
- **Skills (light bg):** Use Card with hover prop. Simple shadow lift is clean, professional.
- **Use Cases (dark bg):** Use Card with hover prop for consistency, OR use BentoCard if cursor flashlight adds premium feel. BentoCard already exists and works well on dark backgrounds.

**Rationale:** BentoCard's flashlight effect shines on dark backgrounds (stone-950) but wouldn't work visually on light backgrounds (stone-100). For consistency across both sections, using Card with theme prop is simpler.

### Pattern 5: Separate ScrollTrigger.batch() Calls for Multiple Sections
**What:** Independent batch() calls for different card types on same page
**When to use:** When page has multiple card grid sections (Skills + Use Cases)
**Example:**
```typescript
// Source: GSAP ScrollTrigger documentation + ProductDemo.tsx multi-animation pattern
// Verified: Official docs confirm multiple batch calls don't conflict

'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Batch 1: Skills cards
      ScrollTrigger.batch('.skill-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
          })
        },
        start: 'top 85%',
        once: true,
      })

      // Batch 2: Use case cards (independent, different selector)
      ScrollTrigger.batch('.use-case-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
          })
        },
        start: 'top 85%',
        once: true,
      })
    })

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(['.skill-card', '.use-case-card'], { clearProps: 'all' })
    })

    return () => mm.revert()
  }, { scope: pageRef })

  return (
    <div ref={pageRef}>
      {/* Skills section with .skill-card elements */}
      {/* Use Cases section with .use-case-card elements */}
    </div>
  )
}
```

**Key principles:**
- Different class selectors prevent batch overlap (`.skill-card` vs `.use-case-card`)
- Both batch calls coexist in same useGSAP hook with same scope
- Each section's cards batch independently as they enter viewport
- Same animation values (y: 60, stagger: 0.15) create visual consistency across sections

### Anti-Patterns to Avoid
- **Animating cards individually without batch:** Creates 10+ ScrollTrigger instances unnecessarily, worse performance
- **Using BentoCard on light backgrounds:** Flashlight effect doesn't show well on stone-100, stick to Card component
- **Category pills/filters instead of labels:** Adds interaction complexity without benefit for linear scroll narrative
- **Inconsistent stagger timing:** Use same stagger value (0.15) across both sections for cohesive feel
- **Hard-coding category groups in JSX:** Use data-driven approach with skillsByCategory utility

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered card reveals | Custom IntersectionObserver + CSS transitions | ScrollTrigger.batch() | Batch handles grouping logic, timing coordination, stagger, and cleanup automatically |
| Category filtering/sorting | Client-side state + filter UI | Static category labels with grouped data | Simpler, better scroll narrative, no state management needed |
| Icon management | Custom SVG components per icon | iconPaths array pattern | Established in featureData.ts, keeps data pure TypeScript, easy to update |
| Card hover effects | Custom CSS transitions on multiple properties | Card/BentoCard hover prop | Already built, theme-aware, accessible, consistent across site |
| Cursor flashlight effect | Custom mousemove tracking + gradient positioning | BentoCard component | Already implemented with 60fps direct DOM manipulation |

**Key insight:** ScrollTrigger.batch() eliminates the complexity of coordinating multiple scroll-triggered animations. Custom solutions require manually tracking which elements have entered viewport, grouping them by timing, managing stagger state, and cleaning up observers. Batch does all this in one method call.

## Common Pitfalls

### Pitfall 1: Animating from Transformed State
**What goes wrong:** Cards flash or jump during reveal if they start with CSS transforms
**Why it happens:** GSAP `from()` conflicts with existing CSS transform values
**How to avoid:**
- Remove any CSS transforms (scale, translate) from `.skill-card` and `.use-case-card` classes
- Let GSAP control all transforms via animation
- Use `autoAlpha` (opacity + visibility) instead of just opacity for better performance

**Warning signs:** Cards visible for one frame before animating, or cards snap to position

### Pitfall 2: Missing `once: true` in ScrollTrigger.batch()
**What goes wrong:** Cards re-animate every time user scrolls up/down past them
**Why it happens:** Without `once`, batch fires `onEnter` every time elements enter viewport
**How to avoid:** Always include `once: true` in batch config for reveal animations

**Warning signs:** Cards fade in again when scrolling back up, janky repeated animations

### Pitfall 3: Category Label Styling Inconsistency
**What goes wrong:** Category labels look disconnected from design system
**Why it happens:** Using arbitrary colors or font sizes instead of design tokens
**How to avoid:**
- Use `text-burnt-orange` (established accent color)
- Use `uppercase tracking-wide text-sm font-medium` (established label pattern)
- Maintain consistent margin-bottom (mb-6) between label and grid

**Warning signs:** Labels that don't match Hero eyebrow or ProductDemo section labels

### Pitfall 4: Grid Gap Mismatch
**What goes wrong:** Card spacing feels different from other sections
**Why it happens:** Using different gap values (gap-4, gap-8) instead of consistent gap-6
**How to avoid:** Use `gap-6` consistently across all card grids (matches ProductDemo pattern)

**Warning signs:** Cards feel too cramped or too spread out compared to demo cards

### Pitfall 5: Scope Issues with Multiple Sections
**What goes wrong:** ScrollTrigger.batch() doesn't find elements in second section
**Why it happens:** Scope ref only wraps one section, not both
**How to avoid:**
- Set scope to parent element containing both sections (e.g., pageRef on <div> wrapping both)
- OR create separate client components (SkillsSection, UseCasesSection) each with own useGSAP + scope
- Use different class selectors (`.skill-card`, `.use-case-card`) to prevent batch conflicts

**Warning signs:** Only first section animates, second section cards appear immediately without animation

### Pitfall 6: Icon Path Errors
**What goes wrong:** SVG icons don't render or throw console errors
**Why it happens:** Invalid SVG path syntax, missing viewBox, incorrect stroke/fill props
**How to avoid:**
- Copy path `d` attributes from verified SVG sources (Feather Icons, Heroicons)
- Always include viewBox="0 0 24 24" on svg element
- Use stroke="currentColor" and fill="none" for outline icons
- Test each icon path before committing to data file

**Warning signs:** Blank icon boxes, console errors about invalid path data

## Code Examples

Verified patterns from official sources and existing codebase:

### Example 1: Complete SkillsSection Component
```tsx
// Source: Patterns from ProductDemo.tsx + featureData.ts structure
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Card from '@/components/ui/Card'
import { skills, categories, skillsByCategory } from '@/components/sections/skillsData'

gsap.registerPlugin(ScrollTrigger)

export default function SkillsSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.skill-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
          })
        },
        start: 'top 85%',
        once: true,
      })
    })

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set('.skill-card', { clearProps: 'all' })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="skills"
      className="min-h-screen bg-stone-100 text-stone-900 py-20 sm:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <h2 className="text-4xl font-bold text-center mb-16">
          AI-Powered Skills
        </h2>

        {/* Category groups */}
        {categories.map((category) => (
          <div key={category} className="mb-12 last:mb-0">
            <h3 className="text-burnt-orange uppercase tracking-wide text-sm font-medium mb-6">
              {category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsByCategory[category]?.map((skill) => (
                <Card key={skill.id} theme="light" hover className="skill-card">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
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

                    {/* Content */}
                    <div>
                      <h4 className="text-lg font-semibold text-stone-900 mb-2">
                        {skill.title}
                      </h4>
                      <p className="text-stone-600 text-sm leading-relaxed">
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
```

### Example 2: Complete UseCasesSection Component
```tsx
// Source: Patterns from ProductDemo.tsx BentoCard usage
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Card from '@/components/ui/Card'
import { useCases } from '@/components/sections/useCaseData'

gsap.registerPlugin(ScrollTrigger)

export default function UseCasesSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.batch('.use-case-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
          })
        },
        start: 'top 85%',
        once: true,
      })
    })

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set('.use-case-card', { clearProps: 'all' })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="use-cases"
      className="min-h-screen bg-stone-950 text-white py-20 sm:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <h2 className="text-4xl font-bold text-center mb-16">
          Built for Every Team
        </h2>

        {/* Flat grid (no category grouping) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <Card key={useCase.id} theme="dark" hover className="use-case-card">
              <div className="space-y-4">
                {/* Icon */}
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

                {/* Content */}
                <div>
                  <p className="text-burnt-orange text-xs uppercase tracking-wide font-medium mb-2">
                    {useCase.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed">
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
```

### Example 3: skillsData.ts Structure
```typescript
// Source: featureData.ts pattern from existing codebase
export interface Skill {
  id: string
  category: 'Sales' | 'Education' | 'Startup'
  title: string
  description: string
  iconPaths: string[]
}

export const skills: Skill[] = [
  // Sales
  {
    id: 'sales-pitch',
    category: 'Sales',
    title: 'Sales Pitch Builder',
    description: 'Create compelling pitch decks with proven frameworks for discovery, demo, and close.',
    iconPaths: [
      'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
    ]
  },
  {
    id: 'proposal-generator',
    category: 'Sales',
    title: 'Proposal Generator',
    description: 'Build custom proposals fast. Auto-format pricing, terms, and case studies.',
    iconPaths: [
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    ]
  },
  {
    id: 'account-review',
    category: 'Sales',
    title: 'Account Review',
    description: 'Summarize deals, track pipeline, and present QBRs with data-driven insights.',
    iconPaths: [
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    ]
  },

  // Education
  {
    id: 'lesson-plan',
    category: 'Education',
    title: 'Lesson Plan Creator',
    description: 'Build engaging lessons with activities, visuals, and assessments aligned to objectives.',
    iconPaths: [
      'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    ]
  },
  {
    id: 'course-overview',
    category: 'Education',
    title: 'Course Overview',
    description: 'Design full course decks with syllabi, schedules, and module breakdowns.',
    iconPaths: [
      'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    ]
  },
  {
    id: 'training-deck',
    category: 'Education',
    title: 'Training Deck',
    description: 'Onboard teams with structured training slides, exercises, and knowledge checks.',
    iconPaths: [
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    ]
  },

  // Startup
  {
    id: 'investor-pitch',
    category: 'Startup',
    title: 'Investor Pitch',
    description: 'Craft a compelling story with traction, market size, and financial projections.',
    iconPaths: [
      'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    ]
  },
  {
    id: 'product-roadmap',
    category: 'Startup',
    title: 'Product Roadmap',
    description: 'Visualize your product vision with timelines, milestones, and feature releases.',
    iconPaths: [
      'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
    ]
  },
  {
    id: 'demo-day',
    category: 'Startup',
    title: 'Demo Day Slides',
    description: 'Nail your accelerator demo with punchy problem-solution-traction narrative.',
    iconPaths: [
      'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122'
    ]
  }
]

// Utility: Group skills by category
export const skillsByCategory = skills.reduce((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = []
  acc[skill.category].push(skill)
  return acc
}, {} as Record<string, Skill[]>)

export const categories = ['Sales', 'Education', 'Startup'] as const
```

### Example 4: useCaseData.ts Structure
```typescript
// Source: demoData.ts pattern from existing codebase
export interface UseCase {
  id: string
  title: string
  subtitle: string
  description: string
  iconPaths: string[]
}

export const useCases: UseCase[] = [
  {
    id: 'sales-teams',
    title: 'Win More Deals',
    subtitle: 'For Sales Teams',
    description: 'Create winning pitch decks that close deals. Customize presentations for every prospect in minutes, not hours.',
    iconPaths: [
      'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
    ]
  },
  {
    id: 'marketing-teams',
    title: 'Showcase Results',
    subtitle: 'For Marketing',
    description: 'Build campaign decks, reports, and stakeholder presentations that showcase your impact with compelling data.',
    iconPaths: [
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    ]
  },
  {
    id: 'executives',
    title: 'Present with Confidence',
    subtitle: 'For Executives',
    description: 'Deliver board presentations and strategic updates with polish and confidence. Focus on the message, not the slides.',
    iconPaths: [
      'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    ]
  },
  {
    id: 'consultants',
    title: 'Deliver Insights',
    subtitle: 'For Consultants',
    description: 'Package recommendations and findings into polished client deliverables. Maintain brand consistency across projects.',
    iconPaths: [
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    ]
  },
  {
    id: 'educators',
    title: 'Engage Students',
    subtitle: 'For Educators',
    description: 'Create engaging lesson presentations that keep students focused. Save hours on slide design and spend time teaching.',
    iconPaths: [
      'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    ]
  },
  {
    id: 'founders',
    title: 'Secure Funding',
    subtitle: 'For Founders',
    description: 'Build investor-ready pitch decks that tell your story. From seed to Series A, nail the narrative that gets you funded.',
    iconPaths: [
      'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    ]
  }
]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Individual ScrollTriggers per card | ScrollTrigger.batch() | GSAP 3.5+ (2020) | Reduces memory overhead, simplifies code, automatic grouping logic |
| Static icon libraries bundled | SVG path arrays in data | 2024-2025 trend | Smaller bundle, pure TypeScript data, easier to update/customize icons |
| Tab/filter interfaces for categories | Static category labels with grouped grids | 2025-2026 design trend | Simpler, better scroll narrative, no state management, cleaner UX |
| Uniform card layouts | Varied card sizes (bento grid) | 2024-2026 | More visual interest, but uniform is better for category-grouped content |
| Complex cursor tracking libraries | Direct DOM manipulation | 2025+ | 60fps performance, simpler code, no library overhead |

**Deprecated/outdated:**
- **AOS (Animate On Scroll) library:** ScrollTrigger provides more control and better performance
- **WOW.js:** Unmaintained, ScrollTrigger is modern standard
- **Individual IntersectionObserver per card:** Batch pattern is more efficient
- **Icon font libraries (Font Awesome):** SVG path arrays provide better tree-shaking and customization

## Content Strategy

### Skills Content (9 total: 3 per category)

Based on AI presentation tool research and Slider's product positioning:

**Sales Category (3 skills):**
1. **Sales Pitch Builder** - Core sales skill for pitch decks with discovery/demo/close frameworks
2. **Proposal Generator** - Custom proposals with auto-formatted pricing and case studies
3. **Account Review** - QBRs and pipeline tracking with data-driven insights

**Education Category (3 skills):**
1. **Lesson Plan Creator** - Engaging lessons with activities and assessments aligned to objectives
2. **Course Overview** - Full course decks with syllabi, schedules, module breakdowns
3. **Training Deck** - Team onboarding with structured slides, exercises, knowledge checks

**Startup Category (3 skills):**
1. **Investor Pitch** - Compelling story with traction, market size, financial projections
2. **Product Roadmap** - Vision visualization with timelines, milestones, feature releases
3. **Demo Day Slides** - Accelerator demos with punchy problem-solution-traction narrative

**Naming pattern:** Action-oriented titles (Builder, Generator, Creator) that describe what the skill does, not generic categories.

### Use Case Content (6 scenarios)

Based on PowerPoint use case research and target personas:

1. **For Sales Teams: Win More Deals** - Pitch decks that close, prospect customization
2. **For Marketing: Showcase Results** - Campaign decks, reports, stakeholder presentations
3. **For Executives: Present with Confidence** - Board presentations, strategic updates
4. **For Consultants: Deliver Insights** - Client deliverables, brand consistency
5. **For Educators: Engage Students** - Lesson presentations, time savings
6. **For Founders: Secure Funding** - Investor-ready pitch decks, seed to Series A

**Structure pattern:** "For [Persona]: [Benefit]" subtitle + outcome-focused title + specific scenario description.

## Open Questions

1. **BentoCard for Use Cases?**
   - What we know: BentoCard flashlight effect works well on dark backgrounds
   - What's unclear: Does it add enough value vs simple Card hover, or feel gimmicky?
   - Recommendation: Start with Card theme="dark" hover for consistency with Skills section. Can upgrade to BentoCard later if cursor effect adds premium feel during implementation.

2. **Icon selection specifics**
   - What we know: iconPaths array pattern established, needs valid SVG path data
   - What's unclear: Exact icon library to source from (Feather, Heroicons, Lucide)
   - Recommendation: Use Heroicons or Feather Icons for consistency with modern design. Test each path before committing to data file.

3. **Skills card layout: Icon position**
   - What we know: Icon + text content, light background
   - What's unclear: Icon left (horizontal) vs icon top (vertical) layout
   - Recommendation: Icon left with flex gap-4 (horizontal layout) keeps cards compact, scans better in grid. Icon top wastes vertical space.

4. **Use case card count**
   - What we know: Requirements show 3 placeholder cards, research suggests 6 scenarios
   - What's unclear: Is 6 too many for viewport? Should it be 3-4?
   - Recommendation: 6 use cases (2 rows of 3 on desktop) provides better coverage of target personas. ScrollTrigger batch handles reveals smoothly.

## Sources

### Primary (HIGH confidence)
- GSAP ScrollTrigger.batch() official docs - https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch/
- Existing codebase patterns: featureData.ts, demoData.ts, ProductDemo.tsx, Card.tsx, BentoCard.tsx
- Square website design analysis via WebFetch - https://squareup.com

### Secondary (MEDIUM confidence)
- [UI Design Trends 2026: Bento grid patterns](https://landdding.com/blog/ui-design-trends-2026) - Card grid design patterns
- [GSAP ScrollTrigger Complete Guide (2025)](https://gsapify.com/gsap-scrolltrigger) - Batch animation patterns
- [Best AI Presentation Makers 2026](https://plusai.com/blog/best-ai-presentation-makers) - Skills preset examples
- [Modern Card Hover Animations](https://dev.to/kadenwildauer/modern-card-hover-animations-css-and-javascript-3cg3) - Hover effect patterns

### Tertiary (LOW confidence - general guidance)
- Web search results on presentation template categories - General industry categories
- Web search results on business use case scenarios - Persona-based scenarios

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project, ScrollTrigger.batch() verified in official docs
- Architecture patterns: HIGH - Based on established codebase patterns (featureData.ts, ProductDemo.tsx)
- Content strategy: MEDIUM - Skills and use cases derived from AI presentation tool research and product positioning
- Card hover approach: MEDIUM - Card vs BentoCard decision is implementation preference, both options valid
- Animation timing: HIGH - ScrollTrigger.batch() parameters verified in official docs and existing implementation
- Icon paths: MEDIUM - Pattern established, specific icons need to be sourced and tested

**Research date:** 2026-02-08
**Valid until:** 2026-03-08 (30 days - stable domain, no fast-moving dependencies)
