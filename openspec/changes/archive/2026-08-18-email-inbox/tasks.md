# Tasks — Email Inbox

Dependency-ordered implementation tasks. Each numbered section must be
completed and verified before moving on.

## 1. Prerequisites — Resend inbound configuration

- [x] Confirm Resend account + verified domain. Root domain `stratifit.com`
      is verified for sending; `email.received` webhook →
      `https://stratifit.com/api/email/inbound` is enabled.
- [ ] Add MX records for receiving — **pending user DNS step** (user chose
      root domain; MX record must be added at the DNS provider and verified
      in the Resend dashboard).
- [ ] Add a webhook for `email.received` → `https://<site>/api/email/inbound`
      (dev: use a tunnel, e.g. ngrok).
- [x] Add env vars to `.env.local` and Vercel:
      `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_WEBHOOK_SIGNING_SECRET`
      (`.env.local` done; Vercel needs the same three manually).
- [ ] Verify inbound by emailing the receiving address — **pending MX
      records**; webhook signature verification was verified locally with the
      exact Standard Webhooks algorithm (valid → 200, invalid → 401).

## 2. Database

- [x] Inspect latest migration number and `supabase/migrations/` conventions.
- [x] Write `supabase/migrations/00060_email_inbox.sql`:
      `email_inbox_sections`, `email_threads`, `email_messages`, indexes,
      RLS policies (admin manage; no anon), updated-at triggers.
- [x] Update `supabase/seed.sql` with default sections
      (`contact`, `brand-design`, `website-development`, `ai-automation`,
      `acquisition`, `support`, `other`).
- [x] Apply: `supabase db push --linked --yes` (migration 00060; also fixed a
      reserved-word issue — `references` is quoted).
- [x] Verify remote schema: 7 sections present in the live DB.
- [x] Regenerate types into `src/types/database.types.ts`.
- [ ] RLS tests added — deferred; RLS behavior verified empirically (anon
      reads return empty; admin policies mirror existing tables).

## 3. Feature module — schemas + queries

- [x] `src/features/email-inbox/schemas.ts` — Zod schemas: inbound webhook
      payload, received email, reply input, section input.
- [x] `src/features/email-inbox/queries.ts` — admin queries:
      `getEmailSectionsWithCounts`, `getEmailThreads(sectionId, status)`,
      `getEmailThreadDetail(threadId)` (thread + messages), plus
      `getEmailSectionsForAdmin` for the sections editor.
- [x] Unit tests for schemas (valid/invalid reply, webhook payload,
      received email, section validation).

## 4. Inbound webhook

- [x] Verify Svix signature with `resend.webhooks.verify` using
      `RESEND_WEBHOOK_SIGNING_SECRET` (mirrors `/api/webhooks/email`);
      verified locally with the Standard Webhooks algorithm.
- [x] Fetch full email from the Received emails API — confirmed SDK method
      `resend.emails.receiving.get(id)` returns `headers` incl.
      `in-reply-to`/`references`.
- [x] Implement `src/features/email-inbox/inbound.ts`: section resolution
      (routing addresses → fallback `other`), thread resolution
      (`in-reply-to`/`references` → stored RFC message-id; else customer
      email + normalized subject; else create), idempotent message insert by
      Resend email id, thread update, reopen `resolved` threads.
- [x] Auto-reply: `email_inbox_auto_reply` template key, sent via `sendEmail`
      with `In-Reply-To`/`References` when the section has
      `auto_reply_enabled`; idempotency key includes the inbound message id.
- [x] `src/app/api/email/inbound/route.ts` POST handler (401 bad signature,
      200 on success/duplicate).
- [ ] Real inbound email test — **pending MX records**; signature path + forms
      integration verified end-to-end.

## 5. Admin — inbox UI

- [x] Add nav entries: "Email Inbox" (`/admin/email/inbox`) and "Email
      Sections" (`/admin/email/sections`) under Communication.
- [x] `/admin/email/inbox/page.tsx` — section tabs with counts, thread list
      (customer, subject, last message, time, status), status filters.
- [x] `/admin/email/inbox/[id]/page.tsx` — thread detail: message history
      (inbound/outbound, safe text preview), customer info, section badge,
      status controls (resolve/reopen/archive), reply editor
      (React Hook Form + Zod, loading/error/success states).
- [x] Server actions in `src/features/email-inbox/mutations.ts`:
      `sendEmailReply` (Resend outbound with threading headers + outbound
      message record + `waiting_on_customer`), `resolveEmailThread`,
      `archiveEmailThread`, `reopenEmailThread` — all admin-guarded via
      `requireAdmin()`, all validated. (`assignThread` deferred — not in V1.)

## 6. Admin — section management

- [x] `/admin/email/sections/page.tsx` — CRUD: name translations, enabled,
      routing addresses, form-source mapping, from address, display order,
      auto-reply toggle + subject/body translations (multilingual editor
      pattern reused from existing CMS forms).
- [x] Server actions: create/update/delete section (delete blocked for
      `other` and for sections with threads), unique-slug handling.
- [x] Validation consistent with other CMS editors (Zod + field errors).

## 7. Forms integration (unified inbox)

- [x] `src/features/email-inbox/forms.ts`: after a successful lead insert,
      `syncLeadToEmailThread` creates-or-joins a thread in the section mapped
      by `form_source_key` (service-role client). Never fails the lead flow;
      form threads don't trigger auto-reply.
- [x] Verified end-to-end via the live server action: first submission created
      a thread + message in the Contact section; duplicate submission joined
      the same thread (1 thread / 2 messages). Test data cleaned up.

## 8. Verification & docs

- [x] `npx tsc --noEmit` clean · `npm run lint` clean (0 errors; 2 benign
      RHF `watch()` warnings, same as existing editors) · `npm run test` —
      111 passed · `npm run build` clean (all new routes present).
- [x] Webhook signature verification tested live (valid → 200, invalid → 401).
- [x] Forms → inbox integration tested end-to-end through the running dev
      server against the live DB (thread created, duplicate joins).
- [ ] Full inbound-email → auto-reply → admin-reply loop — **pending MX
      records** for real receiving; the outbound reply path (sendEmailReply)
      is implemented but needs a real inbound email to round-trip.
- [x] Update `docs/EMAIL_SYSTEM.md` (inbound flow, new template keys, new
      route, email inbox section) and `docs/ROADMAP.md` (email inbox
      delivered).
- [x] Admin auth gate: added an optimistic session-cookie check in
      `src/proxy.ts` — Next 16 swallows `redirect()` from the (dashboard)
      layout, so admin shells rendered unauthenticated (pre-existing,
      all admin pages; data was still RLS-protected). Verified 307 →
      `/admin/login` in dev and prod.
- [x] Archived (this change).

---

## Verification summary

**Implemented:** inbound email → inbox sections → threaded conversations →
admin reply-by-email, per-section auto-reply with on/off, unified form
integration, section management.

**Verified:** typecheck, lint, 111 unit tests, production build, live webhook
signature verification (valid/invalid), live forms→thread integration
(create + idempotent join), admin auth gate in dev + prod.

**Deferred / pending:** MX records on the root domain (user DNS step) before
real inbound email can be received; RLS unit tests; full inbound →
auto-reply → reply round-trip with a real email; Vercel env vars.
