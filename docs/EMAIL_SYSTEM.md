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
```

Each key has a Zod schema in `src/features/email/templates.ts`.

The system rejects unknown template keys.

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

## 11. Webhook Route

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

## 12. Public Routes and Abuse Prevention

Public routes must not accept arbitrary:

- Recipient
- Subject
- Sender
- Body
- Reply-to

Only the approved send functions may construct emails.

This prevents open-relay behavior.

## 13. Notifications

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

## 14. Retry Behavior

The system does not retry automatically.

Failed sends remain visible in `email_events` with status `failed` and an error message.

This avoids duplicate sends and keeps the flow predictable.

Controlled retry can be added later if justified.

## 15. Multilingual Behavior

Templates are currently English copy.

A `locale` field is stored in template data and event metadata to support future multilingual templates.

Supported languages: `en`, `de`, `fr`, `es`.

## 16. Error Handling

- Public users never see provider errors
- Form success does not depend on email success
- Email failures are logged with safe context
- Missing configuration skips email without failing the business operation

## 17. Security

- Resend keys remain server-side
- Webhook signatures are verified
- Service-role access is used only for event logging
- No secrets are logged
- No arbitrary email construction from public input

## 18. Testing

Cover at minimum:

- Template validation
- Idempotency (no duplicate sends)
- Webhook signature verification
- Event status mapping
- Send failure logging
- Missing-configuration behavior

## 19. Related Documentation

```text
docs/PROJECT.md
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/CMS.md
AGENTS.md
```
