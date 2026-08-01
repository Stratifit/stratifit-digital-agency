## Why

The public frame (layout, header, footer, announcement bar) is live, but `page.tsx` still renders the default Next.js template. Per `docs/PROJECT.md` section 7 and `docs/ARCHITECTURE.md` section 15, the homepage is the platform's centerpiece: a fixed sequence of 12 sections, each backed by Supabase content, rendered through approved design-system components.

This change delivers the homepage as the live demonstration of Stratifit's own craft.

## What Changes

- Replace the default `page.tsx` with the Stratifit homepage.
- Implement all 12 approved sections in fixed order:
  1. Hero
  2. Trusted By
  3. Services
  4. Process
  5. Why Choose Us
  6. Insights & Expertise
  7. Portfolio
  8. Acquisition — Buy a Business
  9. Testimonials
  10. Pricing
  11. FAQ
  12. Final CTA
- Add feature query modules for each content domain.
- Add a Section Registry mapping section keys to components (foundation for CMS preview).
- Add cache tags / revalidation paths for homepage content.
- Respect visibility flags (`is_visible`) per section.

## Capabilities

### New Capabilities

- `homepage-sections`: The 12-section Stratifit homepage driven by Supabase content with safe empty states and fixed ordering.

### Modified Capabilities

<!-- None — new capability -->

## Impact

- **Frontend**: Replaces default page with full homepage.
- **Database**: No schema changes. Reads existing tables and seed content.
- **Performance**: Server-rendered sections; selective caching.
- **CMS**: Section Registry foundation enables later CMS preview.
- **No route changes**: Only `page.tsx` and section components.
