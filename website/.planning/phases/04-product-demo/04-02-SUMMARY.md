---
phase: 04-product-demo
plan: 02
subsystem: ui
tags: [gsap, scrolltrigger, animation, scroll-driven, bento-grid, react]

# Dependency graph
requires:
  - phase: 04-01
    provides: ProductDemo static structure with BentoCard, DemoFrame, demoData
  - phase: 03-02
    provides: ScrollTrigger pin+scrub pattern from FeatureShowcase
  - phase: 02-02
    provides: Fade-in animation pattern from Hero
provides:
  - Complete animated ProductDemo section with four animation layers
  - Pinned sidebar walkthrough with scrubbed chat bubble timeline
  - Bento card stagger-reveal pattern
  - Parallax background shapes pattern
affects: [future sections needing pin+scrub animations, parallax effects, batch reveal patterns]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ScrollTrigger.batch() for efficient staggered reveals"
    - "Pin + scrub timeline for sequential content reveal on scroll"
    - "Parallax with scrub: true for background depth"
    - "Restructure layout to avoid pinning within CSS Grid"

key-files:
  created: []
  modified:
    - components/sections/ProductDemo.tsx
    - app/page.tsx

key-decisions:
  - "Restructured layout: heading -> pinned walkthrough -> bento grid below (avoids CSS Grid pin issues)"
  - "Used ScrollTrigger.batch() for bento card reveals instead of individual triggers"
  - "Parallax shapes use scrub: true for direct link, not 0.5 smoothing"

patterns-established:
  - "Pin container, animate children: Never animate the pinned element itself"
  - "Dynamic end calculation: `+=${items.length * 80}vh` with invalidateOnRefresh: true"
  - "Spacer tweens in timeline: tl.to({}, { duration: 0.5 }) creates pause between animations"

# Metrics
duration: 2min
completed: 2026-02-08
---

# Phase 4 Plan 2: ProductDemo Scroll Animations Summary

**Pinned sidebar walkthrough with scrubbed chat bubble timeline, bento card stagger-reveal, parallax depth, and reduced motion support**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-08T03:04:39Z
- **Completed:** 2026-02-08T03:06:50Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Pinned DemoFrame with scrubbed timeline revealing chat bubbles sequentially
- Bento card batch reveal with fade + scale stagger
- Parallax background shapes creating depth without distraction
- Heading fade-in on viewport entry
- Reduced motion fallback showing all content without animation

## Task Commits

Each task was committed atomically:

1. **Task 1: Add GSAP scroll animations to ProductDemo** - `c810991` (feat)
2. **Task 2: Integrate ProductDemo into homepage** - `841df7f` (feat)

## Files Created/Modified
- `components/sections/ProductDemo.tsx` - Added four animation layers: heading fade-in, pinned walkthrough timeline, bento card stagger reveal, parallax shapes. Restructured layout to separate pinned walkthrough from bento grid.
- `app/page.tsx` - Imported and rendered ProductDemo replacing placeholder demo section

## Decisions Made

**1. Layout restructure for pinning reliability**
- **Decision:** Split layout into heading -> full-width pinned walkthrough -> bento grid below
- **Rationale:** Pinning within CSS Grid cells is fragile and causes layout breakage. Dedicated full-width wrapper provides stable pin target.
- **Alternative considered:** Pin first bento card within grid (rejected due to CSS Grid transform conflicts)

**2. ScrollTrigger.batch() for bento card reveals**
- **Decision:** Use ScrollTrigger.batch() instead of individual triggers per card
- **Rationale:** More performant for multiple elements with same animation. Single ScrollTrigger observer instead of 3 separate triggers.

**3. Parallax direct scrub**
- **Decision:** Use `scrub: true` for parallax instead of `scrub: 0.5`
- **Rationale:** Parallax needs immediate response to scroll for depth illusion. Smoothing (0.5) introduces lag that breaks the effect.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restructured layout to avoid CSS Grid pin issues**
- **Found during:** Task 1 (implementing pinned walkthrough)
- **Issue:** Plan suggested pinning within bento grid cell, which causes CSS Grid transform conflicts and layout breakage
- **Fix:** Moved DemoFrame out of grid into dedicated full-width wrapper between heading and grid. Grid now only contains 3 smaller cards.
- **Files modified:** components/sections/ProductDemo.tsx
- **Verification:** Pin works without layout issues, grid remains stable
- **Committed in:** c810991 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (blocking - layout issue)
**Impact on plan:** Necessary structural change to make pinning reliable. No scope change - all animation features delivered as specified.

## Issues Encountered

None - animations implemented smoothly following established patterns from FeatureShowcase and Hero.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ProductDemo complete with all scroll animations
- Four animation patterns now established: pin+scrub timeline, batch stagger reveal, parallax, viewport fade-in
- Homepage sections: Hero, FeatureShowcase, ProductDemo all complete and animated
- Ready for remaining static sections (Skills, Use Cases, CTA) or further polish phases
- No blockers or concerns

---
*Phase: 04-product-demo*
*Completed: 2026-02-08*
