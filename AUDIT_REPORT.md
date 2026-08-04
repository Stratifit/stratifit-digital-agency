# Stratifit — Project Audit Report

**Date:** 2026-08-02
**Branch:** `main`
**Mode:** Read-only audit, followed by Phase 1 implementation

---

## Summary

| Metric | Value |
|---|---|
| Overall Project Health | 80% |
| Implementation Completeness | 80% |
| Production Readiness | 55% |
| Design/UI Completeness | 85% |
| Database/CMS Completeness | 78% |

**P0 (critical) issues found:** none. Lint, TypeScript, and production build all pass.

---

## 1. What Is Done Well

- RSC-first architecture with small, justified client boundaries (31 `"use client"` files)
- Feature-folder modules, section registry, centralized queries, `ActionResult` pattern
- RLS enabled on every table; anon reads only published/visible content; leads anon-insert restricted
- `is_admin()` / `has_admin_role()` are SECURITY DEFINER with locked `search_path`
- Service-role client used only for email event logging + webhook
- Strict TypeScript, zero `any`, zero unsafe HTML, safe console logging
- Migration history in sync (00001–00023), types regenerated
- Media upload: MIME allowlist, 10 MB cap, sanitized filenames, cleanup on failure
- CMS mutations wired with `revalidatePath`; homepage `revalidate = 300`
- Email system: validation, idempotency, event logging, signature-verified webhook
- Honeypot + rate limiting on public forms

## 2. High-Priority Findings (P1)

1. **Email cannot send** — `RESEND_API_KEY` / `RESEND_FROM_EMAIL` not configured in `.env.local`; sends skip with a warning. Contact acknowledgement and lead notifications are not delivered.
2. **AI chat inert without `AI_API_KEY`** — falls back to a rule-based English keyword matcher; `chatbot_knowledge` / `chatbot_settings` / `ai_faq_settings` have no admin UI; several settings fields unused.
3. **`audit_logs` table was orphaned** — created in migration 00011 but never written. *(Fixed during implementation.)*
4. **No automated tests** — no test script exists despite RLS/validation test specs in OpenSpec.

## 3. Medium-Priority Findings (P2)

1. In-progress `getSession()`→`getUser()` + `LinkButton` refactor was uncommitted. *(Completed and committed.)*
2. No canonical URLs / OG / Twitter / JSON-LD / hreflang. *(Fixed.)*
3. `<html lang="en">` hardcoded; chat widget read a static `html lang`. *(Fixed — layout now locale-aware.)*
4. No `loading.tsx` / `error.tsx` / custom `not-found.tsx`. *(Added.)*
5. Plain `<img>` instead of `next/image` in insights, portfolio, admin media. *(Fixed.)*
6. `getVisitorMessages` returned `as never[]`. *(Fixed.)*
7. Auth: leaked-password protection disabled (dashboard setting); `is_admin` executable by anon via RPC (by design — required by RLS policies; returns false for anon).
8. In-memory rate limiting (resets on restart; fine for single-instance V1).
9. README was the default create-next-app template. *(Rewritten.)*

## 4. Low-Priority / Polish (P3)

- Dead `social_twitter` / `social_github` fields in settings form — replaced with Facebook/TikTok to match the rendered icons. *(Fixed.)*
- Duplicated dropdown + click-outside logic (language-switcher, services, budget)
- Acquisition gallery uses hardcoded hex colors + inline `hexToRgba`
- Unused `--radius-xl` token; language pill uses `rounded-2xl`
- Email template `as` casts (cosmetic)
- Footer description copy (~120 chars) wraps to ~3 lines on 375px — copy decision pending

## 5. Supabase / Security Notes

- 37 tables, RLS everywhere, migration history in sync
- Storage: 4 public buckets (listing WARN acceptable for public image buckets)
- Security advisors: `public_bucket_allows_listing` (WARN, accepted), `anon_security_definer_function_executable` (WARN, by design), `auth_leaked_password_protection` disabled (enable in dashboard)
- Performance advisors: unindexed FKs / unused indexes (INFO, expected at current data volume)

## 6. Implementation Work Completed After the Audit

- Committed the `getUser()` JWT validation migration + `LinkButton` refactor (no more `<a>`/`<Link>` nested in `<button>`)
- Added `src/lib/seo.ts`: `canonical()`, `pageMetadata()`, Organization + Article JSON-LD
- Canonical + OG + Twitter metadata on all public pages; JSON-LD on home, insights, work detail
- Dynamic `html lang` from the locale cookie (layout + language switcher)
- `loading.tsx`, `error.tsx`, custom `not-found.tsx`
- Fixed the `as never[]` type hack
- Wired `audit_logs` into publish/save/delete and settings mutations (`src/lib/audit.ts`)
- `next/image` for insights, portfolio, admin media (+ Supabase remote patterns)
- Rewrote `README.md`; aligned social-links CMS form with rendered footer icons

## 7. Remaining Work (for the owner)

1. Set production environment variables (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_WEBHOOK_SIGNING_SECRET`, `AI_API_KEY`, `AI_MODEL`, `NEXT_PUBLIC_SITE_URL`)
2. Enable Supabase Auth leaked-password protection (dashboard)
3. ~~Build admin UI for chatbot knowledge / chatbot settings / AI FAQ~~ *(Done — `/admin/content/chatbot/*`)*
4. ~~Add automated tests~~ *(Done — Vitest, 29 tests across schemas + utilities; run `npm test`)*
5. Deploy to Vercel + verify domain, production migrations, and smoke tests
6. Decide footer description copy length

## 8. Post-Audit Additions

- **Website Sections manager** (`/admin/content/sections`): card grid of every frontend section with 4-language preview tabs, Pause/Resume toggle, and edit links
- **Bulk actions**: select-all + bulk delete for Leads; select-all + bulk archive/delete for Conversations
- **New editors**: Hero, Trusted Logos, Announcement Bar, Navigation, Footer, Buy a Business (`/admin/content/acquisition`)
- **Chatbot admin**: knowledge base CRUD, chatbot settings, AI FAQ settings (`/admin/content/chatbot/*`)
- Legacy `/acquisition` now permanently redirects to `/buy-business`; dead code removed (approx −812 lines)

---

*Prepared during an automated read-only audit of the Stratifit repository.*
