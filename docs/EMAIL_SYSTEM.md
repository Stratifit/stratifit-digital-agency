# EMAIL_SYSTEM.md — Stratifit Communication Engine

**Project:** Stratifit Digital Agency
**Document type:** Communication engine specification
**Status:** Supersedes the Resend-era email system (2026-08-18 rebuild)
**Primary references:** `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/CMS.md`, `openspec/changes/2026-08-18-communication-engine/`, `AGENTS.md`

---

## 1. Purpose

This document defines the Stratifit Communication Engine — the unified
multilingual email system for automatic and manual customer communication.

It specifies:

- Email provider usage (Nodemailer over AWS SES SMTP)
- Multilingual templates (en, de, fr, es)
- Language detection and template selection
- Auto-fill of customer data
- Server-only sender boundaries
- Idempotency and logging
- Delivery webhooks
- Automation triggers
- Schedules
- Admin dashboard (non-technical friendly)
- Security and abuse prevention
- Testing

The engine powers the lead, project lifecycle, payment, inbound-email, and
admin workflows without exposing the system to open-relay abuse.

---

## 2. Goals

The Communication Engine must:

- Send reliable transactional and operational emails in all four languages
- Detect the visitor's language and reply in that language
- Auto-fill customer name/email/project data into every template
- Keep all provider credentials server-side
- Let non-technical admins preview, edit, and send from the dashboard
- Never send silently — failures surface in the UI and the logs
- Support "Reply as:" address selection per send

---

## 3. Architecture Overview

```
Template library (email_templates, 4 languages)
        │
        ▼
Admin dashboard / trigger / schedule / webhook
        │
        ▼
sendTemplateEmail (send-template.ts)
  1. Load template (key or inline object)
  2. Render subject + body with {{placeholders}} auto-filled
  3. Wrap in branded HTML shell (renderer.ts)
  4. Send via Nodemailer → AWS SES SMTP (sender.ts)
  5. Log to email_logs (idempotent by idempotency_key)
  6. Optionally record outbound message on a conversation thread
```

Module layout (`src/features/communication/`):

| File | Responsibility |
| --- | --- |
| `types.ts` | Supported languages, template/log/schedule/trigger types |
| `schemas.ts` | Zod validation for template/log/schedule/trigger input |
| `language.ts` | Language detection (stop words) + translation picking |
| `auto-fill.ts` | `{{placeholder}}` replacement + sender-header parsing |
| `renderer.ts` | HTML/text rendering with shared partials |
| `sender.ts` | Nodemailer + AWS SES SMTP transport |
| `send-template.ts` | Orchestration: load → render → send → log → thread |
| `triggers.ts` | Event → template mapping (admin-configurable) |
| `lead-notifications.ts` | Lead acknowledgement + admin notification |
| `queries.ts` / `mutations.ts` | Admin data access and server actions |
| `templates/partials.ts` | Header/footer/signature/brand-intro partials |

The inbox (`src/features/email-inbox/`) re-exports the send pipeline and adds
threading, section routing, and language-aware auto-replies on top.

---

## 4. Provider: Nodemailer + AWS SES SMTP

All email leaves the app through `sender.ts`:

- Nodemailer transport over AWS SES SMTP (587/TLS, or 465/SSL)
- Credentials from environment variables (server-only)

Required environment variables:

```text
SMTP_HOST
SMTP_PORT          # default 587
SMTP_USER
SMTP_PASS
COMMUNICATION_FROM_EMAIL   # default sender (must be SES-verified)
COMMUNICATION_REPLY_AS     # optional comma-separated reply-as addresses
COMMUNICATION_WEBHOOK_SECRET  # optional delivery-webhook secret
```

Behavior:

- When SMTP or the from-address is not configured, `sendEmail` returns
  `{ ok: false, error }` — it never silently succeeds.
- Admins choose "Reply as:" from the configured `COMMUNICATION_REPLY_AS`
  list (defaults to contact/sales/info/support@stratifit.com).

---

## 5. Multilingual Templates

The library lives in the `email_templates` table (23 auto-replies + 16 manual
templates, each with en/de/fr/es subject and body translations). Template
content is stored in the database so non-technical admins can edit it from the
CMS without a redeploy.

Template fields:

| Column | Purpose |
| --- | --- |
| `key` | Stable identifier (`new_inquiry`, `proposal`, …) |
| `template_type` | `auto` or `manual` |
| `category` | `auto_reply`, `lifecycle`, `follow_up`, `billing`, `custom` |
| `name_translations` | Display name in all 4 languages |
| `subject_translations` | Subject in all 4 languages |
| `body_translations` | Body in all 4 languages (`{{placeholders}}` allowed) |
| `description` | Plain-language help text for admins |
| `trigger_event` | Suggested trigger (`manual`, `on_lead`, `on_inbound_email`, …) |
| `is_enabled` | Whether the template may be sent |
| `display_order` | Sort order in the dashboard |

Auto-replies (23): new inquiry, service request, coming soon, quote request,
support, project start, milestone reached, delay notification, problem
detected, revision requested, project completed, invoice sent, payment
received, payment failed, upcoming payment reminder, overdue payment, meeting
reminder, document needed, approval needed, inactive client follow-up, email
received, file upload, form submission.

Manual templates (16): proposal, contract, onboarding welcome, kickoff
meeting, weekly update, design delivery, development update, testing phase,
launch announcement, invoice, payment reminder, overdue payment, refund, bug
report response, feature request response, general support response.

---

## 6. Language Detection & Selection

`language.ts` detects the language of an inbound message:

1. `Content-Language` header when it is in the supported set.
2. Stop-word scoring over subject + text (most hits wins, ties → en).
3. Default: English.

Translation picking (`pickTranslation`) falls back to English for missing
keys, then to the first available key. Detection and selection are automatic:

- Incoming email → language detected → auto-reply sent in that language.
- Manual reply → template preview shown in the thread's language.
- Unknown language → English.

---

## 7. Auto-Fill

`auto-fill.ts` replaces `{{placeholders}}` in template content:

| Placeholder | Source |
| --- | --- |
| `{{name}}` | customer name |
| `{{customer_email}}` | customer email |
| `{{section_name}}` | inbox section / service name |
| `{{company}}` | customer company |
| `{{project_name}}` / `{{project_stage}}` | CRM project data |
| `{{amount}}` / `{{due_date}}` / `{{invoice_number}}` | billing data |
| `{{payment_status}}` | payment state |
| `{{issue_description}}` | support context |
| `{{meeting_date}}` | scheduled meeting |
| `{{admin_name}}` | signed-in admin |

Inbound messages populate name/email automatically (sender-header parsing);
manual replies pre-fill from the conversation so the admin only reviews before
sending.

---

## 8. Idempotency & Logging

Every send is logged to `email_logs` (idempotent by `idempotency_key` when
provided — webhook retries and double-clicks do not double-send):

| Column | Purpose |
| --- | --- |
| `template_key` | Template used (null for free-form replies) |
| `recipient_email` / `sender_email` | Envelope |
| `subject` / `language` | Rendered output |
| `status` | `queued` `sent` `failed` `delivered` `bounced` `complained` |
| `provider_message_id` | SES message id |
| `error_message` | Failure detail (safe, never secrets) |
| `related_type` / `related_id` | e.g. `lead` → lead uuid, `email_thread` → thread |
| `idempotency_key` | Dedupe key (unique) |

Failed sends are recorded as `failed` with the error — the UI surfaces
"could not be sent" instead of a phantom success.

---

## 9. Delivery Webhooks

SES delivery/bounce/complaint notifications (via SNS → HTTPS endpoint) POST to:

```text
POST /api/webhooks/email
```

Payload: `{ "messageId": "…", "eventType": "delivered"|"bounced"|"complained"|"failed", … }`

- Updates `email_logs` by `provider_message_id`.
- When `COMMUNICATION_WEBHOOK_SECRET` is set, requests must carry it in the
  `x-communication-secret` header.
- Unknown events are acknowledged without error (safe to retry).

---

## 10. Inbound Email & Auto-Replies

Inbound email (SES inbound → adapter → app) POSTs to:

```text
POST /api/email/inbound
```

Processing (`src/features/email-inbox/inbound.ts`):

1. Validate the received-email payload.
2. Idempotency check by provider message id.
3. Detect the customer's language.
4. Resolve the inbox section by routing address + language.
5. Resolve or create the conversation thread (threading headers first,
   then customer email + subject within 30 days).
6. Persist the inbound message; reopen resolved threads.
7. Send the language-matched auto-reply:
   - section `auto_reply_template_id` template when configured (customer's
     language), else the inline section auto-reply fields (English).
   - Threading headers (`In-Reply-To`, `References`) are included so replies
     stay in the same thread.

---

## 11. Automation Triggers

`automation_triggers` maps business events to templates:

| Column | Purpose |
| --- | --- |
| `event_type` | `lead_created`, `inbound_email`, `project_started`, `milestone_reached`, `project_delayed`, `problem_detected`, `revision_requested`, `project_completed`, `invoice_sent`, `payment_received`, `payment_failed`, `payment_upcoming`, `payment_overdue`, `meeting_scheduled`, `document_needed`, `approval_needed`, `inactive_client`, `file_uploaded`, `form_submitted` |
| `template_key` | Template sent for the event |
| `enabled` | Whether the trigger is active |

Seed defaults map every event to a sensible template. Admins can override per
event in the dashboard; disabling a row disables the event. When a business
event fires, the engine detects the customer's language, auto-fills their
data, and sends the matching template.

---

## 12. Schedules

`email_schedules` holds scheduled template sends:

| Column | Purpose |
| --- | --- |
| `template_key` / `recipient_email` / `recipient_name` | Target |
| `language` | Template language |
| `send_at` | When to send |
| `status` | `pending` `sent` `failed` `cancelled` |
| `data` | Auto-fill context JSON |
| `error_message` | Failure detail |

A scheduler worker marks due schedules as sent; the admin dashboard can create
and cancel schedules.

---

## 13. Admin Dashboard

The **Communication** section in the CMS (`/admin/communication`) is built for
non-technical admins:

- **Templates** — grouped by auto/manual + category, editable in a simple
  form (name, subject, body per language), previewable in all 4 languages.
- **Send** — composer with template picker, language picker, "Reply as:",
  auto-filled name/email preview, and subject/body overrides.
- **Logs** — searchable send history with status and errors.
- **Schedules** — upcoming/past scheduled sends.
- **Triggers** — event → template mapping table.

Workflow: open a conversation → suggested template in the right language →
"Use template" → preview with name/email filled → choose "Reply as:" → Send.

Legacy `/admin/email` routes redirect to the new Communication section.

---

## 14. Security & Abuse Prevention

- SMTP credentials are server-only (never `NEXT_PUBLIC_`, never in the
  browser bundle).
- Public routes never accept arbitrary recipient/subject/body/from — replies
  always target the stored customer email of the thread.
- All mutations validate with Zod and enforce admin authorization server-side.
- RLS stays enabled; admin tables are admin-only.
- Secrets are never logged; `error_message` holds safe failure text.

---

## 15. Testing

- `src/features/email-inbox/reply.test.ts` — admin reply path end-to-end
  (mocked Supabase + sender): subject derivation, threading headers, outbound
  record, failure propagation.
- `src/features/email-inbox/inbound.test.ts` — inbound processing with mocked
  Supabase.
- `src/features/email-inbox/language.test.ts` — language detection.
- Baseline: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`.
