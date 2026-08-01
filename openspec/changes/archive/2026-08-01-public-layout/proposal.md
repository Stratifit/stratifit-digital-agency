## Why

The design system and Supabase client layer are complete, but the public site still renders the default Next.js template. No global layout exists: no Announcement Bar, Header/Navigation, Footer, or language selector. Per `docs/ROADMAP.md` Phase 5, the global public frame must be built before homepage sections.

Per `docs/PROJECT.md` section 7 and `docs/ARCHITECTURE.md` section 15, the layout order is: Announcement Bar → Header/Navigation → Page content → Footer.

## What Changes

- **Global layout**: Replace the default `src/app/layout.tsx` shell with the Stratifit public frame.
- **Announcement Bar**: Server Component reading `announcement_bar` from Supabase; renders only when enabled and within date range.
- **Header / Navigation**: Server Component reading `navigation_items` (location = header, visible) from Supabase; desktop nav + mobile drawer.
- **Footer**: Server Component reading `footer_groups` and `footer_links` from Supabase.
- **Language selector**: Stub supporting the four approved locales (en, de, fr, es) without committing to a routing strategy yet.
- **Container integration**: Wrap global chrome in the design-system `Container` and `Section` primitives.
- **Data access**: Add feature modules under `src/features/` (navigation, footer, site-settings) following the centralized query pattern.

## Capabilities

### New Capabilities

- `public-layout`: Global public website frame — announcement bar, header/navigation, footer, and language selector wired to Supabase content.

### Modified Capabilities

<!-- None — new capability -->

## Impact

- **Frontend**: Replaces default layout with Stratifit public frame.
- **Database**: No schema changes. Reads existing tables.
- **CMS**: Content will be editable once CMS phase lands (content already lives in Supabase).
- **No route changes**: Only `layout.tsx` and new component files.
