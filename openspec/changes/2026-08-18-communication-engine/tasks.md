# Tasks — Stratifit Communication Engine

## 1. Database
- [x] Migration 00066: drop `email_templates` + `email_events`, create
      `email_templates` (new), `email_logs`, `email_schedules`,
      `automation_triggers` with RLS; re-link section template FKs
- [x] Seed 39 templates (23 auto + 16 manual) in en/de/fr/es
- [x] Regenerate `src/types/database.types.ts`

## 2. Engine core
- [x] `types.ts` + `schemas.ts` (template, send, schedule, trigger schemas)
- [x] `sender.ts` — Nodemailer + AWS SES SMTP (env config, reply-as list)
- [x] `renderer.ts` — translations → text + branded HTML (partials)
- [x] `templates/partials.ts` — header/footer/signature/brand intro/social/legal
- [x] 39 templates seeded in `email_templates` (DB-stored for CMS editing; no
      catalog file — the DB is the source of truth)
- [x] `language.ts` — detectLanguage + pickTranslation + labels
- [x] `auto-fill.ts` — variable resolution + context builders
- [x] `triggers.ts` — event → template mapping
- [x] `send-template.ts` — load → render → send → log (service-role)
- [x] `queries.ts` / `mutations.ts` — admin reads + server actions

## 3. Integration
- [x] Rewire lead flow (auto-reply/acknowledgement, thread mirror)
- [x] Rewire admin reply / auto-reply in the inbox
- [x] Re-point `/api/email/inbound` at the new engine
- [x] Re-point `/api/webhooks/email` at `email_logs`

## 4. Admin dashboard
- [x] Communication nav group + landing page
- [x] Templates library (list/filter/preview/edit/duplicate/toggle)
- [x] Composer (send page with reply-as + auto-fill preview)
- [x] Logs page
- [x] Schedules page (create/list)
- [x] Triggers page (list/toggle)
- [x] Inbox re-wired (reply-as + template picker)

## 5. Cleanup + verification
- [x] Delete `src/features/email/*`
- [x] Remove Resend package; SMTP env vars documented in `.env.example`
- [x] Update `docs/EMAIL_SYSTEM.md`, `docs/ROADMAP.md`
- [x] Tests for language/auto-fill/triggers/schemas
- [x] `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`

## Follow-up (environment)
- [ ] Configure AWS SES SMTP credentials in Vercel (SMTP_HOST/PORT/USER/PASS,
      COMMUNICATION_FROM_EMAIL) and verify the sender domain in SES
- [ ] Point SES inbound (receiving rule) at `/api/email/inbound`
- [ ] Point SES delivery notifications (SNS → HTTPS) at `/api/webhooks/email`
      and set `COMMUNICATION_WEBHOOK_SECRET`
