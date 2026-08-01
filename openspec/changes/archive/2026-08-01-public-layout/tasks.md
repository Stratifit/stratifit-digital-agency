## 1. Prerequisites

- [x] 1.1 Confirm design-system components exist (Container, Section, Drawer, Button)
- [x] 1.2 Confirm Supabase client layer exists (`src/lib/supabase/server.ts`)
- [x] 1.3 Confirm generated `Database` types exist

## 2. i18n Helper

- [x] 2.1 Create `src/lib/i18n/resolve-translation.ts`
- [x] 2.2 Implement locale lookup with English fallback
- [x] 2.3 Implement safe empty-value fallback
- [x] 2.4 Export the four approved locale constants

## 3. Feature Modules

- [x] 3.1 Create `src/features/site-settings/queries.ts` — `getPublicSiteSettings()`
- [x] 3.2 Create `src/features/navigation/queries.ts` — `getPublicNavigation(location)` returning visible ordered items
- [x] 3.3 Create `src/features/footer/queries.ts` — `getPublicFooterGroups()` with links
- [x] 3.4 Create `src/features/announcement/queries.ts` — `getPublicAnnouncement()` with enabled + date-range filter

## 4. Announcement Bar

- [x] 4.1 Create `src/components/layout/announcement-bar.tsx`
- [x] 4.2 Render only when enabled and within date range
- [x] 4.3 Render message translation for current locale with English fallback
- [x] 4.4 Render optional link and label

## 5. Header and Navigation

- [x] 5.1 Create `src/components/layout/header.tsx`
- [x] 5.2 Render brand/logo area
- [x] 5.3 Render desktop navigation items in `display_order`
- [x] 5.4 Render language switcher
- [x] 5.5 Create mobile menu client control using Drawer
- [x] 5.6 Ensure keyboard and focus behavior for mobile menu

## 6. Footer

- [x] 6.1 Create `src/components/layout/footer.tsx`
- [x] 6.2 Render footer groups and links in `display_order`
- [x] 6.3 Resolve translations for current locale with English fallback
- [x] 6.4 Render contact/settings content from site settings when present

## 7. Language Selector

- [x] 7.1 Create `src/components/layout/language-switcher.tsx`
- [x] 7.2 Show current locale
- [x] 7.3 Offer en, de, fr, es options
- [x] 7.4 Keep route wiring deferred

## 8. Global Layout Composition

- [x] 8.1 Update `src/app/layout.tsx` to compose Announcement Bar, Header, main, Footer
- [x] 8.2 Add skip link with `.skip-link` styling
- [x] 8.3 Keep metadata from earlier setup
- [x] 8.4 Ensure all public routes get the frame

## 9. Verification

- [x] 9.1 Run `npm run lint`
- [x] 9.2 Run `npm run build`
- [x] 9.3 Verify no hardcoded marketing copy introduced
- [x] 9.4 Verify safe fallbacks when content is missing
- [x] 9.5 Record known limitations or follow-up work
