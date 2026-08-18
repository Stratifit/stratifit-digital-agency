# Design — Email Inbox

## Context

The project currently sends transactional email through Resend
(`src/features/email/send.ts`) with approved template keys, idempotency via
`email_events`, and a Svix-verified delivery-event webhook at
`/api/webhooks/email`. Enquiries land in `leads` with no reply-by-email or
threading. This change adds inbound email + an admin email inbox, following
the Resend inbound model.

Resend inbound (verified against current Resend docs, 2026):

- Any address on the **receiving domain** is accepted; Resend POSTs an
  `email.received` webhook containing **metadata only** (`email_id`,
  `message_id`, `from`, `to`, `subject`, `received_for`, `created_at`,
  attachment metadata). The full body/headers are fetched via the
  **Received emails API** (`GET /emails/{email_id}`).
- Webhooks are verified with `resend.webhooks.verify({ payload, headers:
  { id, timestamp, signature }, webhookSecret })` (Svix). The project
  already stores this secret as `RESEND_WEBHOOK_SIGNING_SECRET`.
- Threading: replies set `In-Reply-To: <original message_id>` and append to
  `References`. Inbound replies carry `in-reply-to` / `references` in their
  headers, which we use to join the same thread.

## Goals

- Customers can email the agency and get a threaded conversation in the
  admin, grouped by section, with reply-by-email from the dashboard.
- Form submissions (contact, acquisition) join the same inbox so follow-up
  happens in one place.
- Per-section auto-reply with on/off toggle and CMS-editable multilingual
  copy.
- All writes validated; webhook signed; admin-only data; idempotent.

## Non-Goals

- AI-generated replies, attachments content download, realtime push,
  automatic assignment, SLA timers, marketing sends, customer portal.
- Replacing the chat inbox.

## Architecture

```
Customer email ──► Resend Inbound (receiving domain)
                     │ email.received webhook (metadata)
                     ▼
              POST /api/email/inbound      (Svix verify)
                     │ GET /emails/{email_id}  (full email: headers, text, html)
                     ▼
              resolve section (to/received_for → routing_addresses)
              resolve thread (in-reply-to/references → message_id;
                              else customer email + normalized subject; else new)
                     ▼
              Supabase (service-role): email_messages, email_threads
                     │ if section.auto_reply_enabled
                     ▼
              sendEmail(email_inbox_auto_reply, In-Reply-To/References)
                     ▼
              Admin /admin/email/inbox + /admin/email/inbox/[id]
                     │ sendEmailReply (server action, admin session)
                     ▼
              Resend outbound (from = section from_address, threading headers)
                     ▼
              Supabase: outbound email_message + email_events
```

### Components

- `src/features/email-inbox/schemas.ts` — Zod schemas (section, thread,
  message, inbound webhook payload, reply input).
- `src/features/email-inbox/queries.ts` — admin queries (sections with
  counts, thread list, thread detail with messages).
- `src/features/email-inbox/mutations.ts` — server actions: `sendEmailReply`,
  `resolveThread`, `archiveThread`, `assignThread`, section CRUD.
- `src/features/email-inbox/inbound.ts` — webhook processing (verify, fetch
  full email, resolve, persist, auto-reply).
- `src/app/api/email/inbound/route.ts` — POST handler (thin wrapper over
  `inbound.ts`).
- `src/app/admin/email/inbox/page.tsx` + `[id]/page.tsx` — inbox UI.
- `src/app/admin/email/sections/page.tsx` — section management.
- `src/features/email/templates.ts` — add `email_inbox_auto_reply` key.
- `src/components/admin/nav-data.tsx` — add nav entries under
  "Communication".

## Database Schema (migration `00059_email_inbox.sql`)

```sql
create table public.email_inbox_sections (
  id                            uuid primary key default gen_random_uuid(),
  slug                          text not null unique,
  name_translations             jsonb not null default '{}'::jsonb,
  enabled                       boolean not null default true,
  routing_addresses             text[] not null default '{}'::text[],
  form_source_key               text,
  from_address                  text,
  auto_reply_enabled            boolean not null default false,
  auto_reply_subject_translations jsonb not null default '{}'::jsonb,
  auto_reply_body_translations  jsonb not null default '{}'::jsonb,
  display_order                 integer not null default 0,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now(),
  constraint email_inbox_sections_form_source_key_unique
    unique (form_source_key)
);

create table public.email_threads (
  id                uuid primary key default gen_random_uuid(),
  section_id        uuid not null references public.email_inbox_sections(id) on delete restrict,
  customer_email    text not null,
  customer_name     text,
  subject           text not null,
  status            text not null default 'needs_reply'
                    check (status in ('needs_reply','waiting_on_customer','resolved','archived')),
  source            text not null default 'inbound_email'
                    check (source in ('inbound_email','contact_form','acquisition_form','manual')),
  lead_id           uuid references public.leads(id) on delete set null,
  assigned_to       uuid references auth.users(id) on delete set null,
  last_inbound_at   timestamptz,
  last_outbound_at  timestamptz,
  last_message_at   timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.email_messages (
  id                  uuid primary key default gen_random_uuid(),
  thread_id           uuid not null references public.email_threads(id) on delete cascade,
  direction           text not null check (direction in ('inbound','outbound')),
  from_email          text not null,
  to_email            text not null,
  subject             text not null,
  text_content        text not null,
  html_content        text,
  provider_message_id text,
  in_reply_to         text,
  references          text,
  headers             jsonb not null default '{}'::jsonb,
  attachments         jsonb not null default '[]'::jsonb,
  status              text not null check (status in ('received','sent','failed')),
  error_message       text,
  sent_at             timestamptz,
  created_at          timestamptz not null default now()
);

create unique index email_messages_provider_message_id_key
  on public.email_messages (provider_message_id)
  where provider_message_id is not null;

create index email_threads_section_status_idx
  on public.email_threads (section_id, status, last_message_at desc);
create index email_threads_customer_email_idx
  on public.email_threads (customer_email);
create index email_messages_thread_created_idx
  on public.email_messages (thread_id, created_at);
```

### RLS

- `email_inbox_sections`: admins manage (ALL, `is_admin()`); sections'
  metadata is admin-only (names/addresses are private configuration).
- `email_threads` / `email_messages`: admins manage (ALL, `is_admin()`).
  No anon policies.
- The inbound webhook uses the **service-role** client (same model as the
  chat system's service-role mediation) because Resend's request carries no
  user session.
- Admin mutations use the user-session server client (RLS `is_admin()`).

### Seed (`supabase/seed.sql`)

Default sections: `contact`, `brand-design`, `website-development`,
`ai-automation`, `acquisition`, `support`, `other` with English names,
`display_order`, and `other` marked as the fallback (routing of unmatched
addresses + form keys with no mapping).

## Key Decisions

1. **Metadata webhook + Received emails API fetch** — Choice: handle the
   metadata-only `email.received` event and fetch the full email with the
   Resend SDK. Rationale: Resend (2026) deliberately excludes body/headers
   from webhooks for serverless body-size limits; the full payload is
   required for `in-reply-to` / `references` threading. Alternative
   considered: full-payload webhooks (not available for this event).
2. **Separate `email_threads` / `email_messages` tables** — Choice:
   purpose-built tables instead of reusing `chat_conversations`.
   Rationale: chat is realtime/AI with visitor tokens and modes; email is
   async, customer-initiated, with provider ids and different statuses.
   Sharing would overload chat semantics and RLS. Alternative: extend chat
   tables with `channel` — rejected (risk to the live chat system, muddied
   statuses/modes).
3. **Section routing by address + form source key** — Choice: sections own
   `routing_addresses` and at most one `form_source_key`. Rationale:
   matches "any address at the receiving domain" (route by `to`) and gives
   forms a deterministic section without inventing per-form config.
   Alternative: routing tables — unnecessary complexity for V1.
4. **Auto-reply = fixed admin template, not AI** — Choice: per-section
   toggle + multilingual subject/body, sent with threading headers.
   Rationale: user asked for on/off per section; AI copy is out of scope.
   V1 sends the `en` translation; `de/fr/es` stored for later language
   detection.
5. **Form threads do not trigger auto-reply** — Choice: auto-reply only on
   inbound email; forms already show an acknowledgement and create a lead
   notification. Rationale: avoids double messaging to a form submitter.
6. **Service-role for the webhook, session client for admin** — Choice:
   matches the chat system's approved anonymous-access model
   (`docs/CHAT_SYSTEM.md` §60) and keeps admin writes under `is_admin()`.
   Alternative: a narrow `anon` insert policy — rejected (would allow
   arbitrary anonymous writes into the inbox).
7. **No realtime in V1** — Choice: the inbox polls/refreshes; realtime is
   follow-up work. Rationale: narrow scope; chat already covers realtime
   needs.

## Security

- Svix verification before any processing; 401 on failure.
- Zod validation of the webhook payload, reply input, and section input.
- Admin-only RLS; no anon access; service-role never imported client-side.
- Reply recipient is always the thread's stored customer email — no
  arbitrary recipients (open-relay prevention, per `docs/EMAIL_SYSTEM.md`).
- Outbound sends go through `sendEmail` with an approved template key or
  through the validated reply builder; `email_events` idempotency prevents
  duplicate sends (key `email_inbox_reply:{thread_id}:{message_id}`).
- Attachment metadata only; HTML content stored but rendered as
  text/preview in the admin (never as raw HTML by default).

## Risks & Mitigations

- **Resend fetch failure after webhook** — retry-safe: message insert is
  idempotent by `provider_message_id`; Resend retries webhooks per its
  schedule; handler returns 200 after logging.
- **Thread resolution misses** — customers replying from a different
  address can create a new thread. Mitigation: fallback match on customer
  email + normalized subject (30 days); admin can merge/relabel manually in
  V2.
- **DNS/MX conflicts with existing mail** — use a subdomain for receiving
  (e.g., `inbound.stratifit.com`) per Resend guidance if the root domain is
  already on another provider.
- **Duplicate form thread spam** — thread lookup by section + customer
  email + open status before creating a new thread.
- **Admin reply latency/failure** — outbound message recorded as `failed`
  with a friendly admin error; retry button re-sends with the same
  idempotency key.

## Migration Plan

1. Write migration `00059_email_inbox.sql` (tables, indexes, RLS).
2. Update `supabase/seed.sql` with default sections.
3. `supabase db push` to the linked project (same as previous migrations).
4. Regenerate database types (`supabase gen types` → `src/types/database.types.ts`).
5. Implement features, routes, admin pages.
6. Run lint, typecheck, tests, build; run `node .freebuff/verify-cms-saves.mjs`-style
   save-path verification for the new admin pages.

## Rollback

- Code: remove nav entries + routes; tables are additive and unused by
  other features.
- Database: `DROP TABLE email_messages, email_threads,
  email_inbox_sections` (reversible only by re-running the migration —
  keep the migration file; do not edit history).
- Disable inbound: stop routing webhooks in Resend; the route 404s.

## Open Questions (resolved at implementation)

- Exact Resend SDK method for the Received emails API (`resend.emails.get(id)`
  vs REST `GET /emails/{id}`) — verify against installed SDK version.
- Whether the reply `from` per section or a single global from address:
  resolved as per-section `from_address` with global fallback to
  `RESEND_FROM_EMAIL`.
