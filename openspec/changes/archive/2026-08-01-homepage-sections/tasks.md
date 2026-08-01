## 1. Prerequisites

- [x] 1.1 Confirm public-layout frame renders (AnnouncementBar, Header, Footer)
- [x] 1.2 Confirm design-system components available
- [x] 1.3 Confirm Supabase seed content for services, process, pricing, faqs

## 2. Feature Query Modules

- [x] 2.1 Create `src/features/hero/queries.ts` — `getPublicHero()` (visible only)
- [x] 2.2 Create `src/features/process/queries.ts` — `getPublicProcessSteps()` (visible, ordered)
- [x] 2.3 Create `src/features/why-choose-us/queries.ts` — `getPublicWhyChooseUs()` (visible)
- [x] 2.4 Create `src/features/insights/queries.ts` — `getPublicInsights(limit)` (published, bounded)
- [x] 2.5 Create `src/features/portfolio/queries.ts` — `getPublicPortfolioProjects(limit)` (published, bounded)
- [x] 2.6 Create `src/features/testimonials/queries.ts` — `getPublicTestimonials(limit)` (visible + verified)
- [x] 2.7 Create `src/features/acquisition/queries.ts` — `getPublicAcquisitionSection()` (visible)
- [x] 2.8 Create `src/features/pricing/queries.ts` — `getPublicPricingPlans()` (published, visible, ordered)
- [x] 2.9 Create `src/features/faq/queries.ts` — `getPublicFaqs()` (published, visible, ordered)
- [x] 2.10 Create `src/features/final-cta/queries.ts` — `getPublicFinalCta()` (visible)

## 3. Section Components

- [x] 3.1 Create `src/components/sections/hero-section.tsx`
- [x] 3.2 Create `src/components/sections/trusted-by-section.tsx`
- [x] 3.3 Create `src/components/sections/services-section.tsx`
- [x] 3.4 Create `src/components/sections/process-section.tsx`
- [x] 3.5 Create `src/components/sections/why-choose-us-section.tsx`
- [x] 3.6 Create `src/components/sections/insights-section.tsx`
- [x] 3.7 Create `src/components/sections/portfolio-section.tsx`
- [x] 3.8 Create `src/components/sections/acquisition-section.tsx`
- [x] 3.9 Create `src/components/sections/testimonials-section.tsx`
- [x] 3.10 Create `src/components/sections/pricing-section.tsx`
- [x] 3.11 Create `src/components/sections/faq-section.tsx` (accessible details/summary accordion)
- [x] 3.12 Create `src/components/sections/final-cta-section.tsx`

## 4. Trusted By Data

- [x] 4.1 Create `src/features/trusted-logos/queries.ts` — `getPublicTrustedLogos()` (visible + verified)
- [x] 4.2 Wire Trusted By section to the query

## 5. Section Registry

- [x] 5.1 Create `src/registry/sections.ts` mapping all 12 section keys to components
- [x] 5.2 Export `HOMEPAGE_SECTION_KEYS` in fixed order

## 6. Homepage Composition

- [x] 6.1 Rewrite `src/app/page.tsx` to render sections in approved fixed order
- [x] 6.2 Skip hidden or empty sections safely
- [x] 6.3 Add cache tags / revalidation to the homepage data access
- [x] 6.4 Ensure no hardcoded marketing copy

## 7. Verification

- [x] 7.1 Run `npm run lint`
- [x] 7.2 Run `npm run build`
- [x] 7.3 Verify homepage renders without runtime errors against seed content
- [x] 7.4 Verify empty portfolio/insights/testimonials sections fail safely
- [x] 7.5 Verify responsive behavior at mobile/tablet/desktop
- [x] 7.6 Record known limitations or follow-up work
