# Phase 4: Product Demo - Research

**Researched:** 2026-02-07
**Domain:** Scroll-driven storytelling, multi-step product walkthroughs, GSAP ScrollTrigger
**Confidence:** HIGH

## Summary

Phase 4 requires a scroll-driven animated walkthrough showing the Slider sidebar in action within a PowerPoint chrome mockup. This is distinct from Phase 3's horizontal slide pattern—instead of pinning and sliding through features, this phase needs a multi-step narrative where content changes sequentially as the user scrolls (e.g., "sidebar appears → types message → content updates").

The standard approach uses GSAP Timeline with ScrollTrigger pin + scrub, animating multiple child elements sequentially within the pinned container. The PowerPoint mockup extends the existing Hero pattern with enhanced chrome details. Parallax effects use simple `yPercent` transforms on background elements. Content structure should use aspect-ratio containers with data attributes for easy screenshot swapping.

**Primary recommendation:** Pin container, create a single timeline with sequential steps (fade in sidebar → animate typing → fade content changes), use scrub: 0.5 for premium feel, structure demo frames as swappable components with fixed aspect ratios.

## Standard Stack

The established libraries/tools for scroll-driven product demos:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.14.x | Timeline-based sequential animations | Industry standard for complex scroll animations, proven React integration |
| ScrollTrigger | 3.14.x (plugin) | Scroll-linked animation control | Best-in-class performance, pin + scrub capabilities essential for walkthroughs |
| @gsap/react | 2.1.x | React integration hook | Official GSAP hook with automatic cleanup, handles React strict mode |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lenis | 1.3.x | Smooth scroll foundation | Already in stack from Phase 1, required for premium scroll feel |
| CSS Transforms | Native | Parallax effects | Hardware-accelerated, no layout shifts, works with ScrollTrigger |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP ScrollTrigger | Framer Motion | Framer Motion excellent for React but GSAP has superior scrub precision and is already in the stack |
| GSAP Timeline | IntersectionObserver + CSS | IO is more performant for simple fade-ins but cannot handle scrubbed multi-step sequences |
| Custom typing animation | Typed.js library | Typed.js is overkill; simple GSAP timeline with text reveal is cleaner |

**Installation:**
Already installed in Phase 1. No new dependencies required.

## Architecture Patterns

### Recommended Component Structure
```
components/sections/
├── ProductDemo.tsx              # Main demo section component
├── DemoFrame.tsx                # Reusable PowerPoint chrome frame wrapper
└── demoContent.ts               # Content data (steps, messages, placeholders)
```

### Pattern 1: Pin Container, Animate Sequential Steps
**What:** Pin the demo section, create a timeline with multiple labeled steps, scrub through them as user scrolls
**When to use:** Multi-step product walkthroughs where each scroll range shows a different interaction

**Example:**
```typescript
// Source: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
// Verified: Official GSAP documentation

'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ProductDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.5,  // Smooth catch-up feel
          start: 'top top',
          end: '+=400vh',  // 4 scroll heights for 4 steps
          invalidateOnRefresh: true,
        }
      })

      // Step 1: Sidebar fades in
      tl.addLabel('sidebarAppear')
        .from(sidebarRef.current, {
          xPercent: 100,
          autoAlpha: 0,
          duration: 1
        })

      // Step 2: Message types out
      tl.addLabel('messageType', '+=0.5')
        .from(messageRef.current, {
          autoAlpha: 0,
          duration: 0.5
        })
        .from(messageRef.current.querySelectorAll('.char'), {
          autoAlpha: 0,
          stagger: 0.05,
          duration: 0.5
        }, '<')

      // Step 3: Content changes
      tl.addLabel('contentUpdate', '+=0.5')
        .to(contentRef.current, {
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.5
        })
        .to(contentRef.current, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5
        }, '+=0.2')
    })

    // Fallback for reduced motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([sidebarRef.current, messageRef.current, contentRef.current], {
        clearProps: 'all'
      })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="h-screen overflow-hidden">
      {/* Demo content */}
    </section>
  )
}
```

**Key principle:** NEVER animate the pinned element itself. Pin the container, animate children. This prevents layout measurement issues.

### Pattern 2: PowerPoint Chrome Frame (Enhanced)
**What:** CSS-only PowerPoint window mockup with title bar, window controls, and content area wrapper
**When to use:** Wrapping demo content to show product in realistic context

**Example:**
```tsx
// Source: Extended from Hero.tsx pattern in codebase
// Verified: Existing implementation + modern browser chrome patterns

export function DemoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-stone-800 rounded-xl border border-stone-700 overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-900 border-b border-stone-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-stone-600" />
            <div className="w-3 h-3 rounded-full bg-stone-600" />
            <div className="w-3 h-3 rounded-full bg-stone-600" />
          </div>
          <span className="text-stone-500 text-xs ml-2">Quarterly Report.pptx</span>
        </div>
        <div className="text-stone-500 text-xs">PowerPoint</div>
      </div>

      {/* Content area with sidebar layout */}
      <div className="flex">
        {/* Main slide area - children render here */}
        <div className="flex-1 p-6 min-h-[400px] bg-stone-850">
          {children}
        </div>

        {/* Slider sidebar */}
        <div className="w-[240px] bg-stone-900 border-l border-stone-700 p-4">
          {/* Sidebar content */}
        </div>
      </div>
    </div>
  )
}
```

### Pattern 3: Parallax Background Elements
**What:** Simple vertical offset of background elements based on scroll progress
**When to use:** Add depth to sections without complex 3D transforms

**Example:**
```typescript
// Source: https://gsap.com/community/forums/topic/25542-parallax-effect-using-scrolltrigger/
// Verified: GSAP community forum best practice

// Parallax on background shapes
gsap.to('.parallax-bg', {
  yPercent: 30,  // Move down 30% of element height
  ease: 'none',
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,  // Direct link for parallax
  }
})
```

**Key insight:** Use `yPercent` instead of `y` for responsive parallax. Use `scrub: true` (not 0.5) for direct scroll-linked parallax.

### Pattern 4: Fade-In-On-Scroll (Reuse from Hero)
**What:** Simple autoAlpha fade when section enters viewport
**When to use:** Initial demo section reveal, consistent with Hero pattern

**Example:**
```typescript
// Source: Hero.tsx from codebase
// Already implemented - reuse this pattern

gsap.from('.demo-content', {
  autoAlpha: 0,
  y: 30,
  duration: 0.8,
  scrollTrigger: {
    trigger: '.demo-content',
    start: 'top 80%',  // Trigger when element is 80% down viewport
    toggleActions: 'play none none none',
  }
})
```

### Anti-Patterns to Avoid

- **Animating pinned element itself:** Causes measurement issues. Always pin container, animate children.
- **Multiple ScrollTriggers on same element:** Creates jumping. Use single timeline with all animations.
- **Hardcoded end values:** Won't update on resize. Use function-based: `end: () => '+=' + (steps * 100) + 'vh'`
- **Scrub on load jumps:** If start is before scroll position 0, animation jumps. Adjust start point.
- **Animating height/width for transitions:** Causes layout shifts (CLS). Use transforms (scale, translate) only.
- **Event handlers without contextSafe():** Creates memory leaks in React. Wrap all delayed animations.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Typing animation | Character-by-character setTimeout loop | GSAP stagger on split text or simple fade-in | Custom typing has timing bugs, accessibility issues (screen readers), complexity for pause/speed control |
| Scroll position detection | Manual scroll event + throttle | ScrollTrigger toggleActions | ScrollTrigger is optimized, handles resize, has built-in markers for debugging |
| Smooth scroll to anchor | Custom lerp/easing logic | Lenis.scrollTo() (already in stack) | Lenis handles all edge cases (interruption, mobile, URL hash) and syncs with GSAP |
| PowerPoint chrome | Image or SVG asset | CSS borders, shadows, gradients | CSS is resolution-independent, theme-able, no HTTP request, easier to swap content |
| Parallax effect | Canvas-based or complex matrix transforms | GSAP yPercent with scrub: true | GSAP handles hardware acceleration, requestAnimationFrame, resize automatically |
| Screenshot placeholder service | Third-party API (placekitten, unsplash) | Local aspect-ratio div with data-src attribute | No external dependency, no CORS, no rate limits, works offline, instant swap |

**Key insight:** GSAP Timeline + ScrollTrigger handles 90% of scroll storytelling needs. Resist urge to build custom scroll listeners or animation engines.

## Common Pitfalls

### Pitfall 1: React Strict Mode Duplicate Animations
**What goes wrong:** In development, React strict mode calls useEffect twice, creating duplicate ScrollTriggers and timelines that fight each other.
**Why it happens:** Standard useEffect doesn't know about GSAP context, cleanup runs too late.
**How to avoid:** Use `useGSAP()` hook from @gsap/react instead of useEffect. It automatically handles cleanup with `gsap.context()`.
**Warning signs:** Animations run twice, console shows duplicate ScrollTrigger IDs, pins don't release.

**Example:**
```typescript
// ❌ BAD - Creates duplicates in strict mode
useEffect(() => {
  const tl = gsap.timeline({ scrollTrigger: { /* ... */ } })
  return () => tl.kill()  // Too basic
}, [])

// ✅ GOOD - Auto-cleanup with context
useGSAP(() => {
  const tl = gsap.timeline({ scrollTrigger: { /* ... */ } })
  // Automatically reverted on unmount
}, { scope: containerRef })
```

### Pitfall 2: Animating Same Property Multiple Times
**What goes wrong:** If you create multiple ScrollTriggers animating the same property (e.g., opacity) of the same element, the animation jumps instead of smoothly transitioning.
**Why it happens:** ScrollTrigger caches starting values when created. Second trigger resets to cached value.
**How to avoid:** Put all animations in a single timeline, OR use `immediateRender: false` on subsequent tweens, OR use `.fromTo()` to explicitly set both values.
**Warning signs:** Element "pops" back to starting position when scrolling into second ScrollTrigger range.

**Example:**
```typescript
// ❌ BAD - Will jump
gsap.to('.element', { opacity: 0, scrollTrigger: { trigger: '.section1' } })
gsap.to('.element', { opacity: 1, scrollTrigger: { trigger: '.section2' } })

// ✅ GOOD - Single timeline
const tl = gsap.timeline({ scrollTrigger: { /* ... */ } })
tl.to('.element', { opacity: 0 })
  .to('.element', { opacity: 1 })
```

### Pitfall 3: Not Using Function-Based End Values
**What goes wrong:** Hardcoded `end` values (e.g., `end: '+=2000'`) don't update when viewport resizes, causing ScrollTrigger positions to be wrong.
**Why it happens:** GSAP caches calculations on creation. Window resize triggers `refresh()` but hardcoded values stay the same.
**How to avoid:** Use function-based values: `end: () => '+=' + (steps * 100) + 'vh'` and set `invalidateOnRefresh: true`.
**Warning signs:** Animations work on desktop but break on mobile, or break after rotating device.

**Example:**
```typescript
// ❌ BAD - Fixed value
scrollTrigger: {
  end: '+=2000',  // Won't update on resize
}

// ✅ GOOD - Dynamic function
scrollTrigger: {
  end: () => `+=${steps * 100}vh`,  // Recalculates
  invalidateOnRefresh: true,
}
```

### Pitfall 4: Pinning Order Issues
**What goes wrong:** When multiple sections pin, ScrollTriggers created later miscalculate positions because earlier pins add extra scroll distance.
**Why it happens:** Pin adds "fake" scroll space. Later triggers measure before pin space is accounted for.
**How to avoid:** Create ScrollTriggers in DOM order (top to bottom), OR use `refreshPriority` to control calculation order.
**Warning signs:** Second pinned section triggers too early or too late, positions are offset.

### Pitfall 5: Layout Shifts from Animating Size Properties
**What goes wrong:** Animating `width`, `height`, `top`, `left` causes cumulative layout shift (CLS), hurting Core Web Vitals and causing jank.
**Why it happens:** These properties trigger reflow. Browser must recalculate layout for entire page.
**How to avoid:** Use CSS transforms only (`scale`, `translate`, `rotate`). These are GPU-accelerated composited animations.
**Warning signs:** Scroll feels janky, Chrome DevTools Performance shows purple layout events, Lighthouse flags CLS > 0.1.

**Example:**
```typescript
// ❌ BAD - Causes layout shift
gsap.to('.element', { width: 500, height: 300 })

// ✅ GOOD - No reflow
gsap.to('.element', { scale: 1.5 })
```

### Pitfall 6: Forgetting ScrollTrigger.refresh() After Dynamic Content
**What goes wrong:** If images load or AJAX content appears after ScrollTriggers initialize, positions are wrong because measurements were taken before content expanded the page.
**Why it happens:** ScrollTrigger measures on creation. New content changes layout heights.
**How to avoid:** Call `ScrollTrigger.refresh()` after images load, after DOM updates, or use `invalidateOnRefresh: true`.
**Warning signs:** Animations trigger at wrong scroll positions after images load, sections overlap.

### Pitfall 7: Flash of Unstyled Content (FOUC) with from() Tweens
**What goes wrong:** Using `.from()` for initial page load animations shows elements at full opacity first, then GSAP applies starting styles, creating a visible flash.
**Why it happens:** React renders with default styles, then GSAP JavaScript runs after, changing initial state.
**How to avoid:** Use `.fromTo()` with explicit starting values, OR set initial state with CSS/Tailwind classes, OR use `gsap.set()` before render.
**Warning signs:** Elements briefly appear at wrong position/opacity on page load before animating.

## Code Examples

Verified patterns from official sources:

### Multi-Step Pinned Walkthrough
```typescript
// Source: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
// Pattern: Pin + Timeline + Labels for organized steps

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    pin: true,
    scrub: 0.5,
    start: 'top top',
    end: () => `+=${numSteps * 100}vh`,  // Dynamic based on steps
    invalidateOnRefresh: true,
  }
})

// Use labels to organize steps
tl.addLabel('step1')
  .from('.sidebar', { xPercent: 100, autoAlpha: 0, duration: 1 })

tl.addLabel('step2', '+=0.5')  // Add 0.5 gap after step1
  .from('.message', { autoAlpha: 0, duration: 0.5 })

tl.addLabel('step3', '+=0.5')
  .to('.content', { autoAlpha: 0, scale: 0.95, duration: 0.5 })
  .set('.content', { attr: { 'data-step': 2 } })  // Swap content
  .to('.content', { autoAlpha: 1, scale: 1, duration: 0.5 })
```

### Content Swap Structure for Easy Screenshot Replacement
```tsx
// Source: Best practice from placeholder image research
// Pattern: Fixed aspect ratio + data attributes for swap targets

interface DemoStep {
  id: string
  sidebarMessage: string
  contentImage: string  // Path to screenshot (or placeholder)
}

// In component
<div className="demo-content relative w-full" data-step={currentStep}>
  {/* Fixed aspect ratio prevents layout shift */}
  <div className="aspect-[16/10] bg-stone-700 rounded overflow-hidden">
    <img
      src={steps[currentStep].contentImage}
      alt="Demo step content"
      className="w-full h-full object-cover"
    />
  </div>
</div>

// Later, swap screenshots by just updating contentImage in data
// No component structure changes needed
```

### Parallax Background (Simple Depth Effect)
```typescript
// Source: https://gsap.com/community/forums/topic/25542-parallax-effect-using-scrolltrigger/
// Pattern: Separate scrub:true trigger for background elements

gsap.to('.parallax-shape', {
  yPercent: 50,  // Moves down 50% of element height
  ease: 'none',
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,  // Direct link (not 0.5) for parallax
  }
})
```

### useGSAP with Cleanup (React Pattern)
```typescript
// Source: https://gsap.com/resources/React/
// Pattern: Official React integration with auto-cleanup

import { useGSAP } from '@gsap/react'

export default function ProductDemo() {
  const containerRef = useRef<HTMLDivElement>(null)

  // All animations auto-revert on unmount
  useGSAP(() => {
    const tl = gsap.timeline({ /* ... */ })
    // Create animations here

    // No manual cleanup needed - handled by context
  }, {
    scope: containerRef,  // Scopes selectors to this container
    dependencies: []      // Re-run only when these change
  })

  return <section ref={containerRef}>...</section>
}
```

### Typing Effect (Simple Stagger, No Library)
```typescript
// Source: GSAP timeline stagger pattern
// Pattern: Split text into spans, stagger reveal

// In component, split text into character spans
const message = "Make this slide more visual"
<div className="message">
  {message.split('').map((char, i) => (
    <span key={i} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
  ))}
</div>

// In animation
tl.from('.message .char', {
  autoAlpha: 0,
  stagger: 0.05,  // 50ms between each character
  duration: 0.1,
  ease: 'none'
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ScrollMagic library | GSAP ScrollTrigger | 2020 | ScrollTrigger has better performance, more features, maintained actively. ScrollMagic is deprecated. |
| IntersectionObserver for all scroll animations | IO for simple reveals, ScrollTrigger for scrubbed/complex | 2020-2021 | Hybrid approach: use lightweight IO for fade-ins, GSAP for timelines/pinning |
| Manual useEffect cleanup | useGSAP hook from @gsap/react | 2023 | Automatic context cleanup, handles React strict mode, prevents memory leaks |
| AOS (Animate On Scroll) library | Native CSS scroll-driven animations OR GSAP | 2024-2025 | CSS scroll timeline API now supported (but limited), GSAP still best for complex cases |
| Custom smooth scroll (lerp loops) | Lenis library | 2022-2023 | Lenis is battle-tested, handles mobile Safari, syncs with GSAP via bridge pattern |
| Image-based browser mockups | Pure CSS chrome frames | 2024-2025 | CSS is resolution-independent, no asset loading, easier theming |
| Third-party placeholder services | Local aspect-ratio containers | 2025-2026 | No external dependencies, no CORS, works offline, instant swaps |

**Deprecated/outdated:**
- **ScrollMagic**: Last release 2019, incompatible with GSAP 3.x, community recommends migration to ScrollTrigger
- **AOS library**: Still works but CSS scroll-timeline API and GSAP ScrollTrigger are more flexible
- **jQuery.parallax plugins**: Performance issues, not React-compatible, GSAP handles this natively
- **Typed.js for typing effects**: Overkill for simple reveals, GSAP stagger is simpler and more controllable

## Open Questions

Things that couldn't be fully resolved:

1. **Typing animation character splitting**
   - What we know: Can split text into spans in React render, or use CSS-based solutions
   - What's unclear: Best accessibility approach for screen readers (aria-label with full text vs sequential character reveals)
   - Recommendation: Use simple fade-in on full text for reduced motion users, provide aria-label with complete message

2. **Optimal number of demo steps**
   - What we know: More steps = longer scroll distance = more engagement but also more development time
   - What's unclear: User research for optimal walkthrough length for product demos
   - Recommendation: Start with 3-4 key steps (sidebar appear → message type → content change → result), validate with user testing

3. **Screenshot aspect ratio standardization**
   - What we know: Fixed aspect ratio prevents layout shift, 16:10 is common for presentations
   - What's unclear: Whether to show full slide or zoomed detail for different steps
   - Recommendation: Use 16:10 for full slides, allow per-step aspect ratio override for detail shots

4. **Mobile demo experience**
   - What we know: Pinning works on mobile but long scroll distances can feel tedious
   - What's unclear: Whether to disable pinning on mobile and show static steps instead
   - Recommendation: Test both approaches, consider reducing scroll distance (2vh per step instead of 100vh) on mobile

## Sources

### Primary (HIGH confidence)
- [GSAP ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) - Official docs for pin, scrub, timeline integration
- [GSAP Timeline Documentation](https://gsap.com/docs/v3/GSAP/gsap.timeline()/) - Sequential animation patterns, position parameter
- [GSAP React Integration Guide](https://gsap.com/resources/React/) - useGSAP hook, cleanup, context-safe patterns
- [ScrollTrigger Common Mistakes](https://gsap.com/resources/st-mistakes/) - Official pitfalls guide
- [GSAP Forum: Pin Element and Change Content](https://gsap.com/community/forums/topic/37168-scrolltrigger-pin-an-element-and-change-that-elements-content-on-scroll/) - Recommended pattern for content swapping
- [Web Bae: Horizontal Scrolling with Pin and Fade](https://www.webbae.net/posts/horizontal-scrolling-section-with-pin-and-fade-effects) - Complete implementation pattern

### Secondary (MEDIUM confidence)
- [Codrops: Scroll-Driven Dual-Wave Animation](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/) - 2026 modern GSAP patterns
- [SaaSFrame: SaaS Landing Page Trends 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples) - Scroll-triggered product demos trend
- [Utsubo: Immersive Storytelling Websites 2026](https://www.utsubo.com/blog/immersive-storytelling-websites-guide) - Scroll storytelling best practices
- [Skya Designs: Scroll Storytelling Trend 2026](https://www.skyadesigns.co.uk/web-design-insights/web-design-trend-2026-scroll-storytelling/) - Hook within 0-15% of scroll, 2-3 minute experiences
- [Digital Silk: Scrolling Effects Benefits & Risks](https://www.digitalsilk.com/digital-trends/scrolling-effects/) - Performance and CLS warnings
- [Medium: Optimizing GSAP in Next.js 15](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232) - SSR safety, cleanup patterns

### Tertiary (LOW confidence - needs verification)
- CodePen browser mockup examples - Inspirational but need adaptation
- Generic CSS parallax tutorials - Patterns verified but implementation varies

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - GSAP + ScrollTrigger verified from official docs and existing codebase
- Architecture patterns: HIGH - Official GSAP docs + proven pin-and-animate pattern from forum discussions
- PowerPoint mockup: MEDIUM - Extending Hero pattern (exists in code) with enhanced chrome (new design)
- Parallax effects: HIGH - Simple yPercent pattern verified in GSAP docs and community
- Content swap structure: MEDIUM - Best practice inferred from placeholder research + common React patterns
- Pitfalls: HIGH - Official GSAP mistakes guide + React integration docs

**Research date:** 2026-02-07
**Valid until:** ~2026-03-07 (30 days - GSAP is stable, patterns unlikely to change)
