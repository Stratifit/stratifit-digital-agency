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
- CI gate on Linux reproduces the Vercel build (lint + tests + build + import case checks)

## 2. High-Priority Findings (P1)

1. **Email cannot send** — `RESEND_API_KEY` / `RESEND_FROM_EMAIL` not configured; sends skip with a warning. Contact acknowledgement and lead notifications are not delivered. *(Owner action — verify `.env.local` / Vercel env vars.)*
2. **AI chat inert without `AI_API_KEY`** — falls back to the rule-based English keyword matcher; admin UIs exist for knowledge base, chatbot settings, and AI FAQ. *(Owner action — set `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`.)*
3. **`/services/[slug]` pages missing from `sitemap.xml`** — dedicated service pages exist and are indexed-eligible, but the sitemap only lists the static `/services`. `getPublicServicePageSlugs()` already exists and is used by the public layout; add it to `src/app/sitemap.ts`.

## 3. Medium-Priority Findings (P2)

1. **Generic content CMS is English-only** — the portfolio/insights/testimonials/pricing/faq editor (`content-form.tsx` + `content/schemas.ts`) can only edit the English translation. Existing de/fr/es values are preserved on save, but cannot be created or edited in the CMS. Contradicts the multilingual CMS spec (language tabs). *(Fixed 2026-08-07 — work detail page only; the generic editor remains English-only.)*
2. **Type hacks remain** — `values as never` (5× in `content-form.tsx`), `[] as never[]` (`chat/admin-queries.ts`), plus `as unknown as` casts across acquisition/hero/chat/why-choose-us queries. Type-safety debt; the earlier report's claim that the `as never[]` hack was fully fixed was incorrect.
3. **`trusted_logos` table orphaned** — the public Trusted By section and its admin editor were removed (2026-08-07), but the table (migration 00006) and seed rows still exist. Dropping it is a destructive migration awaiting owner approval.
4. **Stale docs prose** — `docs/FRONTEND.md` §7.2 still describes the removed Trusted By section; `docs/COMPONENTS.md` states `radius-xl (24px)` but the token is 16px (globals.css + DESIGN_SYSTEM.md).

## 4. Low-Priority / Polish (P3)

- Vitest prints a config warning on every run: `vitest.config.ts` is ESM loaded as CJS — rename to `vitest.config.mts`
- `@types/node ^20` while engines + `.nvmrc` pin Node 22 (should be `^22`)
- `select("*")` in 5 admin-only queries (`features/content/get-admin-item.ts`, services edit page)
- `src/proxy.ts` (Next 16 middleware) matcher does not exclude `/api/*`; docs recommend it — minor per-request overhead
- `audit_logs` has `previous_data` / `new_data` columns but no mutation populates them
- `supabase/config.toml`: `enable_signup = true`, `enable_confirmations = false`, `minimum_password_length = 6` — review before production (admin_users gate still protects)
- `.env.example` embeds the real Supabase project ref (`dmkxvalcflotfekpxdfw.supabase.co`) — not a secret, but leaks the project id to clones
- Design tokens: `--radius-lg` / `--radius-xl` / `--radius-card-lg` are three aliases for 16px; `--radius-2xl` (14px) is smaller than `--radius-xl` (16px) — documented aliases, but confusing
- Dependency drift: next 16.2.12→16.3.0, react 19.2.4→19.2.8 available; eslint 9→10 and TS 5→7 are majors (do not rush)

## 5. Supabase / Security Notes

- 37 tables, RLS everywhere, migration history in sync (00001–00030)
- Storage: 4 public buckets (listing WARN accepted for public image buckets)
- Security advisors: `public_bucket_allows_listing` (WARN, accepted), `anon_security_definer_function_executable` (WARN, by design), `auth_leaked_password_protection` disabled (enable in dashboard)
- Performance advisors: unindexed FKs / unused indexes (INFO, expected at current data volume)

## 6. Implementation Work Completed (2026-08-02 → 2026-08-07)

**Post-audit (commits 878fdf3 and earlier):**
- Real business case studies, trusted logos, and trust-building work pages
- Modernized admin dashboard shell and overview for all screen sizes
- Announcement editor now edits the slides carousel the site renders
- Service pages (dedicated `/services/[slug]`) + admin editor
- Buy-a-Business marketplace with niche pages
- Chatbot knowledge base, AI FAQ, and chatbot settings admin UIs
- Sections manager, bulk actions for leads/conversations, editors for hero/announcement/navigation/footer

**This session (2026-08-07, commits 3f30cd2 → 0d918f5):**
- **Removed the Trusted By section** (deleted `trusted-by-section.tsx`, registry entry, `/work` + `/work/[slug]` usages, admin sections card) and the **"Not sure where to start?" CTA banner** from the Services section. Homepage order is now: Announcement Bar → Header → Hero → Services → Process → Why Choose Us → Insights & Expertise → Portfolio → Acquisition → Testimonials → Pricing → FAQ → Contact → Footer. Docs updated (AGENTS.md, ARCHITECTURE, PROJECT, FRONTEND, CMS, ROADMAP).
- **Single back arrow** — removed 4 page-specific hardcoded back buttons (`/work/[slug]`, `/testimonials`, `/buy-business`, `/buy-business/niches/[slug]`); the global localized `PublicBackButton` is now the only one.
- **Back arrow clearance** — repositioned to `top-28` / `sm:top-32` so it clears the sticky header when the announcement bar is visible.
- **Removed the Trusted Logos admin editor and feature module** (route, manager component, feature queries/mutations, nav link; DB table retained pending owner decision).
- **Localized the work detail page** — every hardcoded UI string on `/work/[slug]` moved to `ui-strings.ts` (23 new keys × 4 languages): fact labels, section labels, headings, alt text, and the final CTA.

## 7. Remaining Work (for the owner)

1. Set production environment variables (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_WEBHOOK_SIGNING_SECRET`, `AI_API_KEY`, `AI_MODEL`, `NEXT_PUBLIC_SITE_URL`)
2. Enable Supabase Auth leaked-password protection (dashboard)
3. Decide: drop the orphaned `trusted_logos` table (needs a migration)
4. Add `/services/[slug]` to `sitemap.xml`
5. Deploy to Vercel + verify domain, production migrations, and smoke tests

## 8. Known Follow-ups (engineering)

- Multi-language editing tabs in the generic content CMS (portfolio/insights/testimonials/pricing/faq)
- Replace `as never` / `as unknown as` casts with proper discriminated typing
- Rename `vitest.config.ts` → `.mts`; bump `@types/node` to `^22`
- Sweep remaining stale doc prose (FRONTEND §7.2, COMPONENTS radius note)

---

*Prepared during an automated audit of the Stratifit repository, refreshed 2026-08-07. Lint, TypeScript, 34 tests, and production build verified on `main` at time of writing.*
