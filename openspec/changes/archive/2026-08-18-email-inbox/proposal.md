# Proposal — Email Inbox (inbound email conversations with admin replies)

## Business Reason

Customer enquiries arrive through multiple channels — contact form, service
pages, acquisition form, and direct email. Today those become `leads` rows
with no conversation capability: the admin cannot reply by email from the
dashboard, replies cannot be threaded, and there is no per-topic inbox.

The goal is a modern helpdesk flow (the Intercom / HelpScout / Front model):

- Inbound email → Resend Inbound → webhook → backend → Supabase → dashboard
- Dashboard → backend → Resend outbound → customer
- Customer replies thread back into the same conversation via `Message-ID` /
  `In-Reply-To` / `References`

Every message is tagged with the section it belongs to (Contact, Brand
Design, Website Development, AI & Automation, Acquisition, Support, Other),
so the admin can filter and follow up per section. Each section can enable
an automatic acknowledgement reply, editable in the CMS.

## What Changes

A new **Email Inbox** capability is added alongside the existing chat
inbox and leads:

1. **New public route** `POST /api/email/inbound` — receives Resend inbound
   webhooks (Svix-verified), fetches the full email from Resend's Received
   emails API, resolves the thread and section, persists the message, and
   optionally sends the section's auto-reply.
2. **New database tables** — `email_inbox_sections`, `email_threads`,
   `email_messages` (migration + RLS + seed + types).
3. **New admin module** `/admin/email/inbox` (section tabs + thread list)
   and `/admin/email/inbox/[id]` (thread detail + reply editor), plus
   `/admin/email/sections` to manage sections and their auto-replies.
4. **Unified with forms** — contact and acquisition form submissions
   auto-create a thread in their mapped section, so follow-up happens from
   the email inbox and the customer's email replies thread back.
5. **New approved email template** `email_inbox_auto_reply` for the
   per-section auto-reply, following the existing idempotency + event
   logging rules in `docs/EMAIL_SYSTEM.md`.

## New Capabilities

- Receive and store customer emails in Supabase (threaded).
- Route messages into admin-managed sections (Contact, services, Acquisition,
  Support, Other) by routing address or form source.
- Per-section automatic acknowledgement reply with an on/off toggle and
  editable multilingual subject/body.
- Admin replies from the dashboard via Resend outbound, with correct
  `In-Reply-To` / `References` threading.
- Thread statuses (`needs_reply`, `waiting_on_customer`, `resolved`,
  `archived`), assignment, and section filters in the admin.
- Form submissions (contact, acquisition) create email threads in their
  mapped section.

## Modified Capabilities

- **Email system** (`docs/EMAIL_SYSTEM.md`): extends from outbound-only to
  outbound + inbound; adds one approved template key and one webhook route
  (`/api/email/inbound`) alongside the existing delivery-event webhook.
- **Admin nav** (`Communication` group): adds "Email Inbox" and "Email
  Sections" entries; the existing "Email Activity" (`/admin/email`) remains
  the delivery-event log.
- **Leads flow**: form submissions continue to create leads; additionally
  they create (or join) an email thread so email follow-up is possible.
  Lead ↔ thread linking is optional in V1 (by customer email).
- **Resend configuration**: requires `RESEND_API_KEY`,
  `RESEND_FROM_EMAIL`, `RESEND_WEBHOOK_SIGNING_SECRET`, plus the Resend
  receiving-domain setup (domain verified for sending and receiving).

## Non-Goals

- Replacing the chat conversation inbox (chat stays AI-driven; email inbox
  is async email threads).
- Automatic AI-generated replies (auto-reply is a fixed, admin-edited
  template, not AI copy).
- Attachments: V1 stores attachment metadata only (filename, type, size);
  downloading content via the Resend attachments API is follow-up work.
- Email deduplication across providers, full CRM, bulk/marketing sends,
  customer portal, multi-tenant workspaces, auto-assignment rules, SLA
  timers, or email-side spam classification beyond rate limiting + basic
  checks.
- Multilingual auto-reply selection by detected customer language (V1 sends
  the English translation; subject/body are stored per locale for later use).

## Impact

- **Architecture**: new `src/features/email-inbox/` feature module (schemas,
  admin queries, mutations, inbound processing); one new route handler;
  one new admin section group; no new dependencies (uses the existing
  `resend` package + `src/features/email/send.ts`).
- **Database**: 3 new tables, RLS (admin-only + service-role writes from
  the webhook), seed sections, generated types.
- **CMS**: two new pages + section management; admin-only under existing
  auth.
- **Security**: webhook signature verification (Svix via
  `resend.webhooks.verify`), Zod validation on every write, admin-only RLS,
  no anon access to threads/messages, idempotency on `provider_message_id`
  and on email events, no open-relay (reply targets are stored thread
  recipients only).
- **Performance**: narrow selects, indexed thread/message queries, no
  realtime in V1 (poll/refresh), no unbounded webhook retries (Resend
  handles retry schedule; handler is idempotent).
- **Dependencies**: none new.
- **Accessibility**: reply form follows existing form rules (labels,
  focus, keyboard); inbox list is semantic and keyboard-navigable.

## References

- `docs/EMAIL_SYSTEM.md` — provider, idempotency, event logging, webhook
  verification, template rules.
- `docs/CHAT_SYSTEM.md` — inbox/thread/status conventions reused where
  sensible (statuses are deliberately distinct).
- `docs/DATABASE.md` — purpose-built tables, JSONB multilingual fields,
  RLS-first.
- `AGENTS.md` — approved stack, OpenSpec workflow, RLS and secret rules.
