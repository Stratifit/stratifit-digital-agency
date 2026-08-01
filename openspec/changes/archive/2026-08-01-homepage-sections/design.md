## Context

`public-layout` is archived: the global frame (announcement bar, header, footer) renders from Supabase. The design system provides Button, Card, Container, Section, Badge, Skeleton, and more. The database has seed content for hero, services (4), process steps (4), why_choose_us, acquisition_section, final_cta, pricing plans (3), FAQs (5), and navigation. Portfolio/insights/testimonials tables exist but are empty (no seed data).

This change builds the 12-section homepage in fixed order.

## Goals / Non-Goals

**Goals:**

- Render all 12 approved sections in fixed order
- Drive content from Supabase through feature modules
- Provide a Section Registry
- Provide safe empty states (portfolio/insights/testimonials will be empty until CMS seeding)
- Add cache tags and revalidation
- Reuse design-system components and layout primitives

**Non-Goals:**

- No CMS implementation or editors
- No drag-and-drop section ordering (fixed order in v1)
- No GSAP storytelling yet (may be a follow-up within this change only if scoped)
- No locale routing strategy
- No database changes
- No authentication

## Decisions

### Decision 1: Server-rendered page with feature queries

**Choice:** `page.tsx` is a Server Component that calls feature query modules and renders sections in fixed order.

**Rationale:** Matches the Server Component default rule. Sections are static-per-request content.

### Decision 2: Section Registry

**Choice:** `src/registry/sections.ts` maps section keys to components, mirroring the approved registry concept in `docs/ARCHITECTURE.md` section 14.

**Rationale:** Establishes the shared contract for CMS preview later while keeping the homepage renderer simple.

### Decision 3: Bounded collections

**Choice:** Insights, portfolio, and testimonials queries return a bounded number of records (e.g., 3–6) to keep the homepage fast.

**Rationale:** Homepage shows highlights, not full collections (detail pages come later).

### Decision 4: FAQ accordion

**Choice:** A small accessible accordion using native `<details>`/`<summary>` semantics.

**Rationale:** `<details>` gives keyboard and disclosure behavior without adding dependencies; consistent with the native-first Select decision.

### Decision 5: Visibility handling

**Choice:** Each singleton section checks `is_visible`; collection sections check published + visible filters; renderer skips empty sections.

**Rationale:** Matches RLS public-read policies and DATABASE.md content rules.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Empty portfolio/insights/testimonials | Safe empty states; sections render as compact placeholders or skip gracefully |
| Page too heavy (12 sections) | Bounded queries, server rendering, no client hydration for static sections |
| Seed content drift | Content reads from Supabase; seeds updated separately |
| Cache staleness | Cache tags + revalidation after CMS writes |

## Implementation Plan

1. Create feature query modules for hero, process, why-choose-us, insights, portfolio, testimonials, acquisition, pricing, faq, final-cta
2. Create section components under `src/components/sections/`
3. Create `src/registry/sections.ts`
4. Compose `page.tsx` in fixed order with cache tags
5. Verify lint and build

## Rollback

No database changes. Rollback restores the previous page. No migration involved.
