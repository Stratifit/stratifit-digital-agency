# Stratifit — Project Audit Report

**Date:** 2026-08-07
**Branch:** `main`
**Mode:** Read-only audit + implementation sessions (2026-08-02 → 2026-08-07)

---

## Summary

| Metric | Value |
|---|---|
| Overall Project Health | 82% |
| Implementation Completeness | 82% |
| Production Readiness | 55% |
| Design/UI Completeness | 85% |
| Database/CMS Completeness | 78% |

**P0 (critical) issues found:** none. Lint, TypeScript, tests (34), and production build (66 routes) all pass on `main`.

---

## 1. What Is Done Well

- RSC-first architecture with small, justified client boundaries
- Feature-folder modules, section registry, centralized queries, `ActionResult` pattern
- RLS enabled on every table; anon reads only published/visible content; leads anon-insert restricted
- `is_admin()` / `has_admin_role()` are SECURITY DEFINER with locked `search_path`
- Service-role client used only for email event logging + webhook
- Strict TypeScript; safe console logging; no unsafe HTML rendering
- Migration history in sync (00001–00030), types generated
- Media upload: MIME allowlist, 10 MB cap, sanitized filenames, cleanup on failure
- CMS mutations wired with `revalidatePath`; homepage `revalidate = 300`
- Email system: validation, idempotency, event logging, signature-verified webhook
- Honeypot + rate limiting on public forms
- SEO: canonical + OG + Twitter + JSON-LD on public pages; `sitemap.xml` / `robots.txt`
- Locale-aware `<html lang>`; cookie-based language switching with en/de/fr/es dictionaries
- Single global floating back arrow (`PublicBackButton` — localized, `router.back()` with homepage fallback) — no page duplicates
- Shared `FilterPills` component (`src/components/ui/filter-pills.tsx`) — one pill row reused by the acquisition, portfolio, work, and insights galleries instead of five near-identical copies
- Public read RLS policies for the relationship/category tables (`00033`/`00034`) so anon can resolve service/category slugs for published content
- CI gate on Linux reproduces the Vercel build (lint + tests + build + import case checks)

## 2. High-Priority Findings (P1)

1. **Email cannot send** — `RESEND_API_KEY` / `RESEND_FROM_EMAIL` not configured; sends skip with a warning. Contact acknowledgement and lead notifications are not delivered. *(Owner action — verify `.env.local` / Vercel env vars.)*
2. **AI chat inert without `AI_API_KEY`** — falls back to the rule-based English keyword matcher; admin UIs exist for knowledge base, chatbot settings, and AI FAQ. *(Owner action — set `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`.)*
3. **`/services/[slug]` pages missing from `sitemap.xml`** — dedicated service pages exist and are indexed-eligible, but the sitemap only listed the static `/services`. *(Resolved 2026-08-07 — added to `src/app/sitemap.ts` via `getPublicServicePageSlugs()`.)*
4. **Gallery filter pills and category badges rendered empty** — admin-only RLS policies on `portfolio_service_links` / `insight_category_links` / `insight_categories` silently blocked public reads, so `service_slugs` / `category_slugs` resolved empty. *(Resolved 2026-08-07 — migrations `00033` + `00034`; `00034` also fixes a column-shadowing bug in the `insight_categories` policy.)*

## 3. Medium-Priority Findings (P2)

1. **Generic content CMS is English-only** — the portfolio/insights/testimonials/pricing/faq editor (`content-form.tsx` + `content/schemas.ts`) can only edit the English translation. Existing de/fr/es values are preserved on save, but cannot be created or edited in the CMS. Contradicts the multilingual CMS spec (language tabs). *(Resolved 2026-08-07 — the generic collection editor now has EN/DE/FR/ES language tabs; see CMS.md §19.4.)*
2. **Type hacks remain** — `values as never` (5× in `content-form.tsx`), `[] as never[]` (`chat/admin-queries.ts`), plus `as unknown as` casts across acquisition/hero/chat/why-choose-us queries. Type-safety debt; the earlier report's claim that the `as never[]` hack was fully fixed was incorrect. *(Resolved 2026-08-07 — all `as never` casts removed; JSONB column reads now go through the runtime-guarded `parseJsonArray`/`readJsonObject` helpers in `src/lib/json.ts`; the Resend webhook normalizes payload data through a typed `unknown` bridge.)*
3. **`trusted_logos` table orphaned** — the public Trusted By section and its admin editor were removed (2026-08-07). *(Resolved 2026-08-07 — dropped by migration `00031_drop_trusted_logos.sql`; seed rows removed.)*
4. **Stale docs prose** — `docs/COMPONENTS.md` states `radius-xl (24px)` but the token is 16px (globals.css + DESIGN_SYSTEM.md). *(FRONTEND.md §7.2 Trusted By prose removed 2026-08-07.)*

## 4. Low-Priority / Polish (P3)

- ~~Vitest config warning: `vitest.config.ts` ESM loaded as CJS~~ *(Resolved 2026-08-07 — renamed to `vitest.config.mts`, `__dirname` → `import.meta.dirname`; warning gone.)*
- ~~`@types/node ^20` while engines + `.nvmrc` pin Node 22~~ *(Resolved 2026-08-07 — bumped to `^22`.)*
- `select("*")` in 5 admin-only queries (`features/content/get-admin-item.ts`, services edit page)
- `src/proxy.ts` (Next 16 middleware) matcher does not exclude `/api/*`; docs recommend it — minor per-request overhead
- `audit_logs` has `previous_data` / `new_data` columns but no mutation populates them
- `supabase/config.toml`: `enable_signup = true`, `enable_confirmations = false`, `minimum_password_length = 6` — review before production (admin_users gate still protects)
- `.env.example` embeds the real Supabase project ref (`dmkxvalcflotfekpxdfw.supabase.co`) — not a secret, but leaks the project id to clones
- Design tokens: `--radius-lg` / `--radius-xl` / `--radius-card-lg` are three aliases for 16px; `--radius-2xl` (14px) is smaller than `--radius-xl` (16px) — documented aliases, but confusing
- Dependency drift: next 16.2.12→16.3.0, react 19.2.4→19.2.8 available; eslint 9→10 and TS 5→7 are majors (do not rush)

## 5. Supabase / Security Notes

- 37 tables, RLS everywhere, migration history in sync (00001–00034)
- Storage: 4 public buckets (listing WARN accepted for public image buckets)
- Security advisors: `public_bucket_allows_listing` (WARN, accepted), `anon_security_definer_function_executable` (WARN, by design), `auth_leaked_password_protection` disabled (enable in dashboard)
- Performance advisors: unindexed FKs / unused indexes (INFO, expected at current data volume)
- Public read policies added for the link/category/media relationship tables (`00033`/`00034`) — `FOR SELECT` to anon/authenticated, EXISTS-gated to published parent content

## 6. Implementation Work Completed (2026-08-02 → 2026-08-07)

**Post-audit (commits 878fdf3 and earlier):**
- Real business case studies, trusted logos, and trust-building work pages
- Modernized admin dashboard shell and overview for all screen sizes
- Announcement editor now edits the slides carousel the site renders
- Service pages (dedicated `/services/[slug]`) + admin editor
- Buy-a-Business marketplace with niche pages
- Chatbot knowledge base, AI FAQ, and chatbot settings admin UIs
- Sections manager, bulk actions for leads/conversations, editors for hero/announcement/navigation/footer

**This session (2026-08-07, commits 3f30cd2 → 2be773b):**
- **Removed the Trusted By section** (deleted `trusted-by-section.tsx`, registry entry, `/work` + `/work/[slug]` usages, admin sections card) and the **"Not sure where to start?" CTA banner** from the Services section. Homepage order is now: Announcement Bar → Header → Hero → Services → Process → Why Choose Us → Insights & Expertise → Portfolio → Acquisition → Testimonials → Pricing → FAQ → Contact → Footer. Docs updated (AGENTS.md, ARCHITECTURE, PROJECT, FRONTEND, CMS, ROADMAP).
- **Single back arrow** — removed 4 page-specific hardcoded back buttons (`/work/[slug]`, `/testimonials`, `/buy-business`, `/buy-business/niches/[slug]`); the global localized `PublicBackButton` is now the only one.
- **Back arrow clearance** — repositioned to `top-28` / `sm:top-32` so it clears the sticky header when the announcement bar is visible.
- **Removed the Trusted Logos admin editor and feature module** (route, manager component, feature queries/mutations, nav link; DB table retained pending owner decision).
- **Localized the work detail page** — every hardcoded UI string on `/work/[slug]` moved to `ui-strings.ts` (23 new keys × 4 languages): fact labels, section labels, headings, alt text, and the final CTA.
- **Localized the Buy-a-Business pages** — all hardcoded UI strings on `/buy-business` and `/buy-business/niches/[slug]` moved to `ui-strings.ts` (27 keys × 4 languages) with a new `tWithValue` helper; `BusinessCard` now accepts a `locale` prop.
- **Reliable back arrow** — replaced the unreliable `history.length` heuristic with in-app previous-route tracking (`router.back()` with homepage fallback), so mobile users return to the page they came from with scroll position restored.
- **Real images + filter pills on the homepage insights section** — the carousel now uses `getInsightImage()` (curated per-article photos) instead of letter placeholders, and gained the All/Strategy/Design/Tech/Growth pill row.
- **Shared `FilterPills` component** — extracted the duplicated pill rows into `src/components/ui/filter-pills.tsx`, reused by the acquisition, portfolio, work, and insights galleries.
- **RLS fix for public link reads** — migrations `00033`/`00034` add public read policies for `portfolio_service_links`, `insight_category_links`, `insight_categories`, and `portfolio_media`, restoring category badges, gallery images, and filter pills.

**Later session (2026-08-07, open follow-ups):**
- **Multilingual generic content CMS** — the portfolio/insights/testimonials/pricing/faq editor (`content-form.tsx`, `features/content/schemas.ts`, `save-mutations.ts`) gained EN/DE/FR/ES language tabs; translations are stored/validated as full JSONB objects, English required, others preserved. New schema tests added (`schemas.test.ts`, 11 tests).
- **Work detail gallery seed** — migration `00041` adds `portfolio_media.image_url` (media_id now nullable) and seeds 27 gallery rows across the 9 published case studies; `seed.sql` mirrors the seed; `features/portfolio/queries.ts` resolves direct image URLs ahead of media-library lookups; database types updated.
- **Type-hack cleanup** — all `as never` casts removed; new runtime-guarded helpers `parseJsonArray` / `readJsonObject` in `src/lib/json.ts` replace `as unknown as` JSONB casts across about/hero/acquisition/why-choose-us/chat queries; Resend webhook normalizes payload data through a typed `unknown` bridge.
- **Tooling polish** — `vitest.config.ts` → `vitest.config.mts` (`__dirname` → `import.meta.dirname`, warning gone); `@types/node` bumped `^20` → `^22`.

**Connectivity audit session (2026-08-07, latest):**
- **Full-stack connectivity audit** — verified every public section/page is DB-driven with an admin editor and 4-language support; all homepage sections (Hero → Contact) plus About, Services, Work, Insights, Testimonials, Buy-a-Business, and Detail pages render from Supabase and are editable in the CMS.
- **Final CTA connected to the homepage** — `FinalCtaSection` was registered and admin-editable but never rendered. Added `finalCta` to `HOMEPAGE_SECTION_KEYS` (after Contact, before Footer); its seed and admin editor already existed.
- **`/work` stats band is now CMS-editable** — migration `00042` adds `section_settings.stats` (jsonb); the `portfolio` section row is seeded with the default 3 stats; the Sections admin editor gained a Stats editor; `/work` reads the stats from the DB instead of hardcoded English strings.
- **Acquisition niche catalog moved to the DB** — migration `00043` creates `acquisition_niches` (7 niches seeded in 4 languages with stats, RLS: public read visible only, admin manage) with admin CRUD (`/admin/content/acquisition/niches` + new/edit pages, `NicheForm` with locale tabs), replacing the hardcoded English catalog in `niches.ts`; public pages `/buy-business` + `/buy-business/niches/[slug]` and `sitemap.xml` now fetch from the DB.
- **Services admin form gained EN/DE/FR/ES tabs** — `features/services/schemas.ts` now validates full 4-locale JSONB translation objects (English required); `service-form.tsx` has locale tabs; `updateService` merges translations so saving one language never wipes others.
- **Hardcoded frontend strings localized** — `/services` page hero, `/services/[slug]` labels (Deliverables, Our Process, etc.), `/about` headings/fallbacks, `/work` hero fallbacks, `/testimonials` and `/insights` hero fallbacks all moved to `ui-strings.ts` (en/de/fr/es).
- **Section header fallbacks** — all section titles/descriptions restored when DB translations are empty via `SectionHeader` fallback registry (`src/lib/i18n/section-fallbacks.ts`) + migrations `00044`/`00045`; 3 new tests.
- **Final CTA section removed** — the "Ready to Transform Your Digital Presence?" card was removed from the homepage, registry, component, admin editor/nav, and its `final_cta` table dropped (migration `00046`).
- **Legal & careers pages restyled** — Terms of Service and Cookie Policy now render the same icon-card design as Privacy Policy; all legal/careers/hiring pages gained rich 4-language fallback content (`src/lib/i18n/detail-page-fallbacks.ts`) so they render correctly even before migrations apply; new `/hiring` page ("We're Hiring") added as a CMS detail page; **Imprint** link added to the footer Legal group and mobile nav, **Hiring** link added to the footer Company group (migration `00047` + seed).

## 7. Remaining Work (for the owner)

1. Set production environment variables (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_WEBHOOK_SIGNING_SECRET`, `AI_API_KEY`, `AI_MODEL`, `NEXT_PUBLIC_SITE_URL`)
2. Enable Supabase Auth leaked-password protection (dashboard)
3. Deploy to Vercel + verify domain, production migrations, and smoke tests
4. Apply migration `00041_portfolio_media_gallery.sql` to the remote database (pending deploy)

## 8. Known Follow-ups (engineering)

- Sweep remaining stale doc prose (COMPONENTS radius note — FRONTEND §7.2 resolved)
- `select("*")` in 5 admin-only queries
- `audit_logs.previous_data` / `new_data` columns are never populated
- Review `supabase/config.toml` signup/password settings before production
- `.env.example` embeds the real Supabase project ref

---

*Prepared during an automated audit of the Stratifit repository, refreshed 2026-08-07. Lint, TypeScript, 34 tests, and production build verified on `main` at time of writing.*
