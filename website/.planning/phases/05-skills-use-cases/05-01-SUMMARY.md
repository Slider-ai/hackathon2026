---
phase: 05
plan: 01
subsystem: content
tags: [skills, data-module, scroll-animation, batch-reveal, gsap]
requires:
  - 01-02-design-tokens
  - 01-03-ui-components
  - 04-02-scroll-animations
provides:
  - skills-data-module
  - skills-section-component
  - category-grouped-grid
  - batch-stagger-pattern
affects:
  - 05-02-use-cases-section
  - app/page.tsx
tech-stack:
  added: []
  patterns:
    - ScrollTrigger.batch for efficient multi-element stagger reveals
    - Category-grouped data structure with reduce() utility
key-files:
  created:
    - components/sections/skillsData.ts
    - components/sections/SkillsSection.tsx
  modified: []
decisions:
  - title: "ScrollTrigger.batch() for skill card reveals"
    rationale: "Single observer for all 9 cards more efficient than individual triggers"
    alternatives: "Individual ScrollTrigger per card (less performant)"
  - title: "Category-grouped data structure"
    rationale: "Skills naturally cluster by industry, grouping makes content scannable"
    alternatives: "Flat array with manual filtering in component"
  - title: "Horizontal flex layout for skill cards"
    rationale: "Icon + text side-by-side maximizes readability and scannability"
    alternatives: "Vertical stacked layout (wastes horizontal space)"
metrics:
  duration: 2min
  completed: 2026-02-08
---

# Phase 5 Plan 01: Skills Data and Section Summary

**One-liner:** Skills section with 9 category-grouped AI preset cards and ScrollTrigger.batch stagger reveal.

## What Was Built

Created the Skills section showcasing Slider's 9 AI presets (Sales Pitch Builder, Proposal Generator, Account Review, Lesson Plan Creator, Course Overview, Training Deck, Investor Pitch, Product Roadmap, Demo Day Slides) grouped by industry category (Sales, Education, Startup).

**Components delivered:**
- **skillsData.ts:** Pure TypeScript data module with Skill interface, skills array, skillsByCategory grouping utility, and categories const
- **SkillsSection.tsx:** Client component rendering category-grouped 3-column grid with ScrollTrigger.batch stagger reveal

**Animation patterns:**
- Heading fade-in (autoAlpha, y: 40)
- ScrollTrigger.batch for efficient multi-element stagger (0.15s stagger, once: true)
- Reduced motion fallback with gsap.matchMedia()

**Design details:**
- Category labels in burnt-orange uppercase text
- Card component with theme="light" and hover shadow lift
- Horizontal flex layout: icon (burnt-orange bg) + title/description
- Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
- Light stone background (bg-stone-100) for visual separation from hero

## Technical Decisions

### ScrollTrigger.batch() for skill card reveals
**Decision:** Use ScrollTrigger.batch('.skill-card') instead of individual triggers
**Rationale:** Single scroll observer for all 9 cards significantly more performant than 9 separate ScrollTrigger instances
**Impact:** Better scroll performance, especially on lower-end devices

### Category-grouped data structure
**Decision:** Use skillsByCategory reduce() utility to group skills by industry
**Rationale:** Skills naturally cluster by use case (Sales, Education, Startup), grouping improves scannability and content hierarchy
**Implementation:** `skills.reduce()` creates `Record<string, Skill[]>` for O(1) category lookups
**Alternative considered:** Flat array with component-level filtering (less reusable)

### Horizontal flex layout for skill cards
**Decision:** Icon and text side-by-side instead of vertically stacked
**Rationale:** Maximizes horizontal space utilization, improves readability at desktop widths
**UX benefit:** Users can scan all 9 cards quickly without excessive scrolling

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

**Created:**
- `components/sections/skillsData.ts` (86 lines) - Typed Skill interface, 9 skills, skillsByCategory utility, categories const
- `components/sections/SkillsSection.tsx` (114 lines) - Client component with ScrollTrigger.batch stagger reveal

**Modified:**
- None

## Commits

| Hash    | Message                                                       |
|---------|---------------------------------------------------------------|
| 4bbdb7a | feat(05-01): create skillsData with typed Skill interface and 9 skills |
| 302ed0b | feat(05-01): create SkillsSection with category-grouped grid and ScrollTrigger.batch |

## Testing Notes

**TypeScript:** `npx tsc --noEmit` passes with no errors
**Build:** `npm run build` succeeds with no warnings
**Verification:**
- 9 skills present in skillsData.ts (3 per category)
- All skills have valid iconPaths arrays
- ScrollTrigger.batch('.skill-card') with once: true
- gsap.matchMedia() with reduced motion fallback
- Category labels render as burnt-orange uppercase
- Cards use Card component with theme="light" and hover prop

## Next Phase Readiness

**Integration needed:**
- Import SkillsSection into app/page.tsx
- Position between ProductDemo and UseCases sections
- Verify scroll flow feels natural from demo bento grid to skill cards

**Pattern established:**
- ScrollTrigger.batch with once: true for efficient multi-element reveals
- Category-grouped content with visual hierarchy (uppercase labels)
- This pattern will be reused in 05-02 for use case testimonials

**No blockers.** Ready for integration into homepage.
