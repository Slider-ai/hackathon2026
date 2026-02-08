---
phase: 04-product-demo
plan: 01
subsystem: ui
tags: [gsap, bento-grid, cursor-effects, react, typescript]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: Design tokens, component patterns, GSAP infrastructure
  - phase: 02-navigation-hero
    provides: PowerPoint chrome mockup pattern from Hero.tsx
  - phase: 03-feature-showcase
    provides: Pure TypeScript data module pattern, ScrollTrigger patterns
provides:
  - BentoCard component with cursor-following flashlight effect
  - DemoFrame PowerPoint chrome wrapper with sidebar support
  - ProductDemo section with Square-inspired bento grid layout
  - Demo step content data model (4 steps with sidebar messages)
  - Grid layout system with varying card sizes (large 2x2, medium 1x2, small 1x1)
affects: [04-02-product-demo-scroll, future-sections-using-bento-grid]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cursor-following flashlight effect with direct DOM manipulation for 60fps performance"
    - "Bento grid layout with CSS Grid span classes (large/medium/small variants)"
    - "forwardRef pattern for animation-ready components"
    - "Parallax background shapes positioned behind content"

key-files:
  created:
    - components/sections/demoData.ts
    - components/ui/BentoCard.tsx
    - components/ui/DemoFrame.tsx
    - components/sections/ProductDemo.tsx
  modified: []

key-decisions:
  - "Direct DOM manipulation for cursor flashlight effect instead of React state for performance"
  - "Bento grid with 2x2 large card, 2x 1x2 medium cards, 1x 1x1 small card layout"
  - "First card contains full DemoFrame, other cards show preview content"
  - "Parallax background shapes positioned absolute behind grid"

patterns-established:
  - "BentoCard: Generic card component with grid span variants and cursor flashlight effect"
  - "DemoFrame: Reusable PowerPoint chrome wrapper extending Hero pattern with sidebar support"
  - "Data-driven demo steps: Pure TypeScript module with sidebar messages and grid span metadata"

# Metrics
duration: 3min
completed: 2026-02-08
---

# Phase 04 Plan 01: Product Demo Static Structure Summary

**BentoCard with 60fps cursor flashlight effect, DemoFrame PowerPoint chrome, and Square-inspired bento grid layout with 4 demo steps**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-08T02:38:18Z
- **Completed:** 2026-02-08T02:40:56Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- BentoCard component with performant cursor-following flashlight border effect using direct DOM manipulation
- DemoFrame PowerPoint chrome wrapper with optional sidebar, extending Hero.tsx mockup pattern
- ProductDemo section with Square-inspired bento grid (varying card sizes: 2x2, 1x2, 1x2, 1x1)
- Demo content data model with 4 steps showing Slider sidebar workflow (open, choose skill, AI builds, refine)
- All components ready for GSAP scroll animation targeting with data attributes and CSS classes

## Task Commits

Each task was committed atomically:

1. **Task 1: Demo content data and BentoCard component with cursor flashlight effect** - `87d1cc9` (feat)
   - demoData.ts with 4 demo steps including sidebar messages
   - BentoCard with cursor-following radial gradient using onMouseMove + direct DOM manipulation
   - Grid span variants: large (2x2), medium (1x2), small (1x1)

2. **Task 2: DemoFrame chrome wrapper and ProductDemo bento grid section** - `d560fbd` (feat)
   - DemoFrame wraps content in PowerPoint chrome with optional sidebar
   - ProductDemo section with CSS Grid bento layout (1-col mobile, 2-col tablet, 3-col desktop)
   - Primary card contains full DemoFrame with chat bubbles
   - Parallax background shapes for depth

## Files Created/Modified
- `components/sections/demoData.ts` - Demo step content data with sidebar messages, grid spans, placeholder labels
- `components/ui/BentoCard.tsx` - Bento card with cursor flashlight effect, grid span variants, GSAP targeting classes
- `components/ui/DemoFrame.tsx` - PowerPoint chrome wrapper with forwardRef, optional sidebar support
- `components/sections/ProductDemo.tsx` - Main Product Demo section with bento grid layout and parallax background

## Decisions Made
- **Direct DOM manipulation for cursor effect:** Used ref to update gradient position directly instead of setState to achieve 60fps performance. Avoids React re-renders on every mouse move.
- **Grid span as prop:** BentoCard accepts gridSpan prop ('large' | 'medium' | 'small') instead of arbitrary col/row values. Clearer API, enforces bento aesthetic.
- **First card gets special treatment:** Only the large (2x2) card contains full DemoFrame with sidebar. Other cards show preview content to avoid visual clutter.
- **forwardRef for DemoFrame:** Enables parent components to pass refs for GSAP animation targeting in Plan 02.
- **Parallax shapes behind grid:** Positioned absolute decorative elements with .parallax-shape class for future scroll-driven parallax animation.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness
- Static Product Demo structure complete with all visual elements
- BentoCard cursor flashlight effect functional and performant
- All components have proper data attributes and classes for GSAP targeting
- Ready for Plan 02: scroll animations (ScrollTrigger pin, card stagger, parallax, sidebar chat reveal)
- No blockers or concerns

---
*Phase: 04-product-demo*
*Completed: 2026-02-08*
