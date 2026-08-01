## Context

`foundation-design-system` and `supabase-client-layer` are archived. The design system provides Button, Container, Section, Drawer, and more. The client layer provides typed browser/server clients. The database has seeded navigation items (7 header), footer groups (3), footer links, site settings, and an announcement bar (disabled by default).

This change builds the global public frame in the approved order: Announcement Bar → Header/Navigation → page content → Footer.

## Goals / Non-Goals

**Goals:**

- Replace the default Next.js layout with the Stratifit public frame
- Render Announcement Bar from Supabase (enabled + in-range only)
- Render Header/Navigation from Supabase (header location, visible, ordered)
- Render Footer from Supabase (groups + links, ordered)
- Provide mobile navigation via the design-system Drawer
- Provide a language selector for en, de, fr, es
- Centralize data access in feature modules
- Provide safe fallbacks

**Non-Goals:**

- No homepage section implementation (Phase 6)
- No locale routing strategy decision (deferred to Phase 7)
- No CMS implementation
- No authentication
- No hardcoded marketing copy
- No database changes

## Decisions

### Decision 1: Server Components for global chrome

**Choice:** Announcement Bar, Header, and Footer are Server Components that fetch data via server client feature queries.

**Rationale:** Global chrome is static-per-request content; Server Components avoid client hydration cost. The mobile menu control is the only Client Component (Drawer interaction).

### Decision 2: Mobile navigation via Drawer

**Choice:** The mobile menu uses the design-system `Drawer` (right direction) from `src/components/ui/drawer.tsx`.

**Rationale:** Reuses the approved Radix-based primitive with focus management and reduced-motion handling.

### Decision 3: Language selector as a controlled stub

**Choice:** A `LanguageSwitcher` component renders the four locales and tracks the current locale, but does not change routes yet.

**Rationale:** The locale routing strategy (prefix vs default-english) is a Phase 7 decision per `docs/ARCHITECTURE.md` section 16.3. Building the control now keeps scope small.

### Decision 4: Translation resolution helper

**Choice:** Add `src/lib/i18n/resolve-translation.ts` returning the requested locale value with English fallback and safe empty fallback.

**Rationale:** `docs/DATABASE.md` section 5 requires centralized locale behavior.

### Decision 5: Feature modules

**Choice:** Create `src/features/site-settings/queries.ts`, `src/features/navigation/queries.ts`, `src/features/footer/queries.ts`.

**Rationale:** Follows the centralized query pattern from `supabase-clients` and `docs/DATABASE.md` section 33.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Missing seed content breaks layout | Safe empty-state fallbacks per component |
| Announcement date handling | Compare against `now()`; render only when in range |
| Drawer hydration mismatch | Client Component with mounted-state guard |
| Locale routing changes later | LanguageSwitcher is presentational; wiring deferred |

## Implementation Plan

1. Add i18n translation resolution helper
2. Create feature modules: site-settings, navigation, footer
3. Create `components/layout/announcement-bar.tsx`, `header.tsx`, `footer.tsx`, `language-switcher.tsx`
4. Update `src/app/layout.tsx` to compose the frame
5. Verify lint and build

## Rollback

No database changes. Rollback removes the layout components and restores the default layout. No migration involved.
