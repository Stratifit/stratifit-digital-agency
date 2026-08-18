# EMAIL_SYSTEM.md — Stratifit Digital Agency Platform

**Project:** Stratifit Digital Agency
**Document type:** Email system specification
**Status:** Initial approved email-system specification
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/CMS.md`, `AGENTS.md`

---

## 1. Purpose

This document defines the Stratifit transactional and operational email system.

It specifies:

- Email provider usage (Resend)
- Server-only client boundaries
- Approved template keys
- Typed template data
- Idempotency
- Delivery-event logging
- Webhook verification
- Retry behavior
- Multilingual behavior
- Security and abuse prevention
- CMS email activity
- Testing

Emails support the lead, acquisition, chat, and admin workflows without exposing the system to open-relay abuse.

---

## 2. Email System Goals

The email system must:

- Send reliable transactional and operational emails
- Keep all provider credentials server-side
- Use approved template keys only
- Validate template data before sending
- Prevent duplicate sends
- Record delivery events
- Verify webhook signatures
- Fail safely when the provider is unavailable
- Prevent arbitrary email sending from public routes
- Support the supported languages where applicable

---

## 3. Approved Provider

Resend is the approved email provider.

Resend API calls must happen server-side only.

Never expose the Resend API key to the browser.

---

## 4. Scope

Version 1 includes:

- Server-only Resend client
- Typed template schemas
- Contact form acknowledgement
- New-lead notification (admin)
- Acquisition enquiry notification (admin)
- Chat escalation notification
- Admin invitation
- Plain-text fallbacks
- Email-event logging
- Idempotency
- Verified webhook route
- Controlled send behavior

Version 1 does not include:

- Marketing campaigns
- Unrestricted recipient lists
- Arbitrary public email submission
- Full multilingual template libraries beyond approved copy
- Complex retry queues

---

## 5. Template Keys

Approved template keys:

```text
contact_acknowledgement
lead_notification
acquisition_notification
chat_escalation
admin_invitation
email_inbox_auto_reply
email_inbox_reply
```

Each key has a Zod schema in `src/features/email/templates.ts`.

The system rejects unknown template keys.

`email_inbox_auto_reply` renders the per-section auto-reply subject/body from
CMS-editable translations inside the branded shell.

`email_inbox_reply` renders a free-form admin reply (written in the email
inbox) as plain paragraphs inside the branded shell.

---

## 6. Environment Variables

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_WEBHOOK_SIGNING_SECRET=
```

- `RESEND_API_KEY` — Resend API key (server-only)
- `RESEND_FROM_EMAIL` — verified sender address
- `RESEND_WEBHOOK_SIGNING_SECRET` — `whsec_` secret for webhook signature verification

When `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is missing, email sending is skipped with a warning instead of failing the business operation.

---

## 7. Server-Only Client

The Resend client lives in `src/features/email/client.ts`.

It:

- Imports `server-only`
- Caches the client instance
- Returns `null` when the API key is missing

It must never be imported from a Client Component.

---

## 8. Send Flow

```text
Validate template data (Zod)
↓
Resolve sender and client
↓
Build idempotency key
↓
Log queued event (unique idempotency key)
↓
If already queued → skip send
↓
Call Resend
↓
Update event to sent or failed
```

## 9. Idempotency

Every send records an `email_events` row with a unique `idempotency_key`.

When the idempotency key already exists, the send is skipped.

Lead-related emails use a deterministic key based on the lead ID, which prevents duplicate acknowledgement or notification emails for the same lead.

## 10. Event Logging

All sends are recorded in `public.email_events`:

```text
template_key
recipient_email
sender_email
provider
provider_message_id
status (queued, sent, delivered, failed, bounced, complained)
related_type
related_id
idempotency_key
error_code
error_message
metadata
sent_at
delivered_at
```

Event writes use the service-role client because `email_events` is admin-only under RLS.

## 11. Webhook Routes

### Delivery events

Route: `POST /api/webhooks/email`

Behavior:

1. Requires `RESEND_WEBHOOK_SIGNING_SECRET`
2. Verifies the Svix-style signature using `resend.webhooks.verify`
3. Maps event types to statuses:

```text
email.sent        → sent
email.delivered   → delivered
email.failed      → failed
email.bounced     → bounced
email.complained  → complained
```

4. Updates the matching `email_events` row by `provider_message_id`
5. Returns 400 for invalid signatures, 500 for update failures

### Inbound email (Email Inbox)

Route: `POST /api/email/inbound`

Receives Resend `email.received` webhooks (metadata only) and powers the
admin Email Inbox (`/admin/email/inbox`). See `docs/` OpenSpec change
`2026-08-18-email-inbox` for the full design.

Behavior:

1. Requires `RESEND_WEBHOOK_SIGNING_SECRET`; verifies the Svix signature
   (401 on failure)
2. Fetches the full email (body + threading headers) from the Resend
   Received emails API via `resend.emails.receiving.get(emailId)`
3. Routes the email to an inbox section by matching `to`/`received_for`
   against section `routing_addresses` (fallback: `other`)
4. Resolves the thread via `in-reply-to`/`references` headers, then by
   customer email + normalized subject (30-day window), then creates a new
   thread
5. Persists the message idempotently by the Resend email id and updates the
   thread (reopening resolved threads)
6. Sends the section auto-reply when `auto_reply_enabled` (with
   `In-Reply-To`/`References` threading headers and an idempotency key that
   includes the inbound message id)
7. Returns 200 for every verified delivery (including duplicates) so Resend
   stops retrying; processing errors are logged and do not cause retries

## 12. Email Inbox (Conversations)

The admin Email Inbox turns inbound email and website form enquiries into
threaded conversations:

- `email_inbox_sections` — admin-managed categories (slug, multilingual
  name, routing addresses, form-source mapping, from address, optional
  routing language, auto-reply toggle + subject/body translations, display
  order)
- `email_threads` — one conversation per customer (status: needs_reply /
  waiting_on_customer / resolved / archived; source: inbound_email /
  contact_form / acquisition_form / manual; detected language)
- `email_messages` — inbound/outbound messages with provider ids and
  threading headers

Language-aware routing: when inbound email arrives, its language is detected
first (see §16), then the section is resolved by routing address **preferring
a section whose `language` matches the detected language**. A section with
no language (`null`) is language-agnostic and matches any language, so
existing sections keep their current behaviour until an admin opts a section
into a specific language. The default seed ships German, French, and Spanish
variants of the contact section (`contact-de`, `contact-fr`, `contact-es`) so
language routing is active out of the box, with English served by the
language-agnostic `contact` section.

Admin reply flow (outgoing):

```text
Admin types a reply in /admin/email/inbox/[id]
↓
sendEmailReply server action (admin-guarded, Zod-validated)
↓
Resend outbound (from = section from_address, In-Reply-To/References)
↓
email_messages outbound row + email_events idempotency
↓
Thread → waiting_on_customer
```

The reply composer includes an **Insert template** picker listing the enabled
template library (grouped by category). Selecting one fills the subject and
body with the template rendered in the thread's language; values the thread
knows (`name`, `section_name`, `customer_email`) are injected and unknown
variables stay as `{{placeholders}}` for the admin to replace before sending.
An optional subject override is accepted by `sendEmailReply` (falls back to
`Re: <thread subject>` when empty).

Threading:

- Outbound sends record the RFC message-id (fetched from Resend after
  sending) so customer replies thread back reliably
- Inbound replies match `in-reply-to`/`references` against stored RFC
  message-ids, falling back to customer email + normalized subject

Form integration:

- `submitLead` creates-or-joins a thread in the section mapped to the form
  source (`contact_form` → Contact) via the service-role client, preferring a
  language-specific section when one matches the visitor's language (falling
  back to the language-agnostic default); thread failures never fail the lead
  submission
- Form threads do not trigger auto-reply (forms already acknowledge)

## 13. Public Routes and Abuse Prevention

Public routes must not accept arbitrary:

- Recipient
- Subject
- Sender
- Body
- Reply-to

Only the approved send functions may construct emails.

This prevents open-relay behavior.

## 14. Notifications

### Contact acknowledgement

Sent to the visitor after a successful contact form submission.

### New-lead notification

Sent to the admin email (`site_settings.contact_email`) after a contact-form lead.

### Acquisition notification

Sent to the admin email after an acquisition enquiry.

### Chat escalation

Sent to the admin email when a visitor requests human support.

### Admin invitation

Sent when inviting a new admin user.

## 15. Retry Behavior

The system does not retry automatically.

Failed sends remain visible in `email_events` with status `failed` and an error message.

This avoids duplicate sends and keeps the flow predictable.

Controlled retry can be added later if justified.

## 16. Multilingual Behavior

Supported languages: `en`, `de`, `fr`, `es`. English is the fallback.

### Email template library

The Email Inbox ships with a multilingual template library (`email_templates`, migrations `00061` + `00065`) covering the categories Stratifit needs. The complete version-1 library contains **39 templates — 23 auto-replies and 16 manual templates**:

- **Auto-replies (23)** — instant replies to inbound email and form leads: contact/lead thank-yous, per-section auto-replies (contact, brand design, web development, AI & automation, acquisition, support), a generic fallback, plus lifecycle notifications (project started, milestone reached, project delayed, problem detected, revision requested, approval needed, meeting reminder, inactive client follow-up), billing notifications (invoice sent, payment received, payment failed, payment overdue), and an enquiry/service-request confirmation.
- **Lifecycle (manual)** — proposal, contract, onboarding, project kickoff, weekly update, design delivery, development update, testing update, launch announcement, project complete.
- **Follow-ups** — conversation resolved follow-up, feedback request.
- **Billing (manual)** — invoice ready, payment reminder, overdue notice, refund confirmation.
- **Custom** — support response, generic proposal/contract templates.

Each template stores `subject_translations` and `body_translations` as `{ en, de, fr, es }` JSONB, plus a category, trigger event (`on_lead`, `on_inbound_email`, `on_thread_resolved`, `manual`), an on/off switch, and display order. Content supports `{{placeholder}}` keys (`name`, `section_name`, `company`, `project_name`, `project_stage`, `amount`, `due_date`, `invoice_number`, `payment_status`, `issue_description`, `meeting_date`, `admin_name`, `customer_email`); unknown keys render empty.

Admin management lives under **Admin → Communication → Email Templates** (`/admin/email/templates`, category-filtered editor). Each editor card includes a **live preview** (branded email shell with sample data injected into placeholders, dark/light toggle, per-language rendering) and a **Duplicate** action that copies a template with a unique key and starts it disabled until reviewed.

### Automatic sends

- **Auto-reply** — when an inbound email or form lead arrives, the section's linked template is sent **in the customer's language** (detected from the message; `Content-Language` header wins, then stop-word scoring, English fallback). If no template is linked, the section's inline multilingual fields are used.
- **Send when resolved** — when an admin resolves a conversation, an optional per-section template is sent to the customer in the thread's language.
- **Lead acknowledgement** — form submissions get the language-matched acknowledgement template as their reply, recorded in the thread.

Admin management lives under **Admin → Communication → Email Templates** (`/admin/email/templates`, category-filtered editor) and per-section links on **Email Sections**.

## 17. Error Handling

- Public users never see provider errors
- Form success does not depend on email success
- Email failures are logged with safe context
- Missing configuration skips email without failing the business operation

## 18. Security

- Resend keys remain server-side
- Webhook signatures are verified
- Service-role access is used only for event logging
- No secrets are logged
- No arbitrary email construction from public input

## 19. Testing

Cover at minimum:

- Template validation
- Idempotency (no duplicate sends)
- Webhook signature verification
- Event status mapping
- Send failure logging
- Missing-configuration behavior

## 20. Related Documentation

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/CMS.md
AGENTS.md
```
