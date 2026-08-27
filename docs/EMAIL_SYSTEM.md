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
  3. Render branded React Email shell via @react-email/render (renderer.ts)
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
| `renderer.ts` | HTML/text rendering (React Email via `@react-email/render`) |
| `templates/stratifit-email.tsx` | Branded React Email template component |
| `sender.ts` | Nodemailer + AWS SES SMTP transport |
| `smtp-config.ts` | SMTP host classification + `SES_SMTP_*` env resolution |
| `smtp-test.ts` | Live relay probe (banner + credentials, no send) |
| `dns-verify.ts` | Live DNS check (MX / SPF / DKIM / DMARC) |
| `send-template.ts` | Orchestration: load → render → send → log → thread |
| `triggers.ts` | Event → template mapping (admin-configurable) |
| `process-schedules.ts` | Due-schedule processor (cron worker) |
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

Required environment variables (canonical `SES_SMTP_*` names; the legacy
`SMTP_*` names are still accepted as a fallback so existing deployments keep
working):

```text
SES_SMTP_HOST          # e.g. email-smtp.eu-north-1.amazonaws.com
SES_SMTP_PORT          # default 587
SES_SMTP_USER          # SES SMTP username (console > SMTP settings)
SES_SMTP_PASS          # SES SMTP password
COMMUNICATION_FROM_EMAIL   # default sender (must be SES-verified)
COMMUNICATION_REPLY_AS     # fallback reply-as addresses (DB table wins)
COMMUNICATION_WEBHOOK_SECRET  # optional delivery-webhook secret
COMMUNICATION_CRON_SECRET  # optional bearer secret for the schedule-processor route
ZOHO_MAIL_DOMAIN       # inbound domain (Zoho Mail EU) — informational
ZOHO_DKIM_KEY          # TXT value for zoho._domainkey — informational
IMAP_SENT_FOLDER       # folder that holds sent mail (default "Sent")
IMAP_SYNC_SENT         # import Zoho-sent mail into the dashboard (1/true)
IMAP_SENT_MIRROR       # mirror dashboard sends into the Zoho Sent folder (1/true)
```

Behavior:

- When SMTP or the from-address is not configured, `sendEmail` returns
  `{ ok: false, error }` — it never silently succeeds.
- Admins choose "Reply as:" from the **Sender Addresses** table
  (`email_sender_addresses`, managed at `/admin/communication/addresses`).
  The table is seeded with contact/hello/info/sales/support@stratifit.com.
  `COMMUNICATION_REPLY_AS` is only a fallback when the table is empty, and
  the built-in defaults cover the same addresses when both are empty.
- The sender address is set per send: the Send Email composer and the inbox
  reply composer both expose a "Reply as" picker fed by the table.
- Every address at the verified SES domain works as a sender, so new
  addresses can be added from the dashboard without touching env vars.

### 4.1 SMTP endpoint requirement (important)

`SMTP_HOST` must be the **AWS SES SMTP endpoint**:

```text
email-smtp.<region>.amazonaws.com        # standard
email-smtp-fips.<region>.amazonaws.com   # FIPS
```

with SMTP credentials created in the SES console (Identities → SMTP
settings → Create SMTP credentials). Do **not** point `SMTP_HOST` at an AWS
Mail Manager ingress endpoint (`*.mail-manager-smtp.amazonaws.com`, SMTP
usernames prefixed `inp-`). Mail Manager ingress endpoints are **inbound-only**:
they accept outbound mail with `250 OK` and silently drop it (ruleset default),
so `email_logs` stays "Sent" forever and nothing is delivered. The admin
Communication dashboard detects this configuration (`smtp-config.ts`,
`EmailConfigStatus`) and shows a red warning banner.

Real SES SMTP credentials never authenticate against Mail Manager hosts, and
Mail Manager ingress credentials (`inp-…`) fail with `EAUTH` on every real
`email-smtp.<region>.amazonaws.com` endpoint — a quick way to tell the two
apart.

### 4.2 Region

The Stratifit production setup targets the **eu-north-1 (Stockholm)** SES
region:

```text
SES_SMTP_HOST=email-smtp.eu-north-1.amazonaws.com
SES_SMTP_PORT=587
```

SMTP credentials must be created in the same region's SES console, and the
sender identity (`COMMUNICATION_FROM_EMAIL`) must be verified there (domain or
address). The SES MAIL FROM bounce MX also lives in eu-north-1
(`feedback-smtp.eu-north-1.amazonses.com`).

### 4.3 DNS records (domain authentication)

The Stratifit setup combines **AWS SES** (outbound sending) with **Zoho Mail
EU** (inbound mailbox that receives customer replies). The following records
must be published for `stratifit.com` (Vercel DNS unless the domain is
registered elsewhere):

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| MX | `@` (10) | `mx.zoho.eu` | Inbound mail → Zoho Mail EU |
| MX | `@` (20) | `mx2.zoho.eu` | Inbound mail → Zoho Mail EU (backup) |
| MX | `@` (50) | `mx3.zoho.eu` | Inbound mail → Zoho Mail EU (backup) |
| MX | `bounce` (10) | `feedback-smtp.eu-north-1.amazonses.com` | SES custom MAIL FROM (optional) |
| TXT | `bounce` | `v=spf1 include:amazonses.com ~all` | SPF for the SES MAIL FROM domain (AWS requires it) |
| TXT | `@` | `v=spf1 include:amazonses.com include:zoho.eu -all` | SPF — authorizes SES + Zoho senders |
| TXT | `zoho._domainkey` | `<ZOHO_DKIM_KEY>` from the Zoho admin console | DKIM — signs Zoho-sent mail |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:postmaster@stratifit.com; ruf=mailto:postmaster@stratifit.com; fo=1` | DMARC policy |

Wait up to 24h for propagation. The admin dashboard has a **"Run DNS check"**
panel (`DnsCheckPanel`) that resolves these records live and reports what is
published, missing, or misconfigured.

Since the fix in `sender.ts` (`getSendBlockError`), `sendEmail` **refuses to
send at all** when the configured relay is a Mail Manager ingress endpoint: it
returns `{ ok: false, error }` with an actionable message instead of logging a
fake "Sent". The admin Communication dashboard also has a **"Test SMTP
connection"** probe (`SmtpConnectionProbe`) that connects to the configured
host live, shows the relay's greeting banner, classifies it (SES SMTP vs Mail
Manager ingress vs unknown), and verifies the credentials — so the exact relay
in use is visible without sending anything.

---

## 4b. Template Rendering: React Email + Resend Renderer

The HTML shell of every email is a **React Email** template
(`src/features/communication/templates/stratifit-email.tsx`) rendered with
`render()` from **`@react-email/render`** — the Resend renderer — which
produces inline-styled, email-client-safe markup. The layout (dark brand
header with the main logo + round favicon mark, amber accent bars, body, CTA
button, and a dark footer with contact details + social icons) is defined once
in the component; the subject and body remain CMS-editable in
`email_templates`. The footer social icons mirror the site footer (LinkedIn,
Instagram, Facebook, TikTok) and use the same links from site settings
(`social_links`); the renderer resolves them server-side with the service-role
client so cron/webhook sends outside a request context still get them.

```ts
import { render } from "@react-email/render";
import { StratifitEmail } from "./templates/stratifit-email";

const html = await render(
  StratifitEmail({ subject, body, language, adminName, contact }),
  { pretty: true }
);
```

`render()` is async (streams via `react-dom/server`); `renderEmailHtml` in
`renderer.ts` returns a `Promise<string>`. The rendered HTML is then sent
through Nodemailer over SES SMTP — no third-party sending API is involved.

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

## 5b. Inbound Replies via Zoho Mail EU

Outbound emails are sent from a Stratifit address (e.g. `contact@stratifit.com`
— a verified SES identity). When customers hit **Reply**, the reply is
addressed to that sender address and delivered by the domain's MX records to
the **Zoho Mail EU** mailbox (`mx.zoho.eu` / `mx2.zoho.eu` / `mx3.zoho.eu`).

Reply flow:

1. Stratifit sends via SES SMTP with `From: contact@stratifit.com`.
2. The customer replies → MX routes the message to Zoho Mail EU.
3. The reply lands in the Zoho mailbox (subject unchanged, threading
   preserved).
4. The app ingests the reply (the existing inbound pipeline
   `POST /api/email/inbound`, or Zoho Mail API / IMAP polling for fully
   automatic threading) and attaches it to the conversation thread.
5. The admin answers from the dashboard; the answer is sent back through SES
   SMTP, and the loop continues.

SPF includes both `amazonses.com` (outbound) and `zoho.eu` (inbound/internal),
so neither provider's sends are rejected by the other's policy. DMARC
`p=quarantine` protects the domain from spoofing in both directions.

### 5c. Two-Way Sent-Folder Sync with Zoho Mail

The dashboard conversation inbox and the Zoho Mail **Sent** section stay in
sync in both directions (implementation: `src/features/email-imap/`, spec
`openspec/changes/2026-08-21-zoho-sent-sync/`):

**Dashboard → Zoho Sent (mirror).** Every successful conversation send through
`sendTemplateEmail` is mirrored into the Zoho **Sent** folder over IMAP
(`APPEND`) by `email-imap/sent-mirror.ts`, best-effort:

- Gated on IMAP being configured and the send carrying an RFC Message-ID
  (`IMAP_SENT_MIRROR` is **on by default**; set `IMAP_SENT_MIRROR=0` to
  disable). Every conversation send is mirrored regardless of the `from`
  address; the Sent-folder sweep only imports mailbox-owned sends, so
  foreign-address copies can never create dashboard duplicates.
- The Sent folder is located robustly: the configured `IMAP_SENT_FOLDER` when
  it exists, else the RFC 6154 `\Sent` special-use flag, else common localized
  sent-folder names.
- The copy preserves the original Message-ID, subject, from/to, In-Reply-To /
  References, and HTML/text content, so it threads in Zoho exactly like the
  original.
- Failures only log a warning — the SES send, `email_logs`, and the send
  outcome are never affected. The outcome is surfaced in the admin UI (composer
  and inbox reply) so operators can see why a copy did not appear.

**Zoho → Dashboard (sweep).** When `IMAP_SYNC_SENT` is enabled (on by
default), the IMAP fetch worker (see `docs/IMAP_INBOX.md`) additionally sweeps
`IMAP_SENT_FOLDER` (default `Sent`). Messages sent by the Zoho mailbox are
imported as `outbound` messages on the matching conversation thread (threading
headers first, recipient + subject fallback, else a new `imap` thread), the
thread moves to `waiting_on_customer`, and the message is deduplicated by RFC
message-id — which also absorbs the mirrored copies so a dashboard send never
gets recorded twice.

This keeps AWS SES as the outbound provider (delivery webhooks and
`email_logs` status tracking are unchanged) while both UIs see the same sent
mail.

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
| `{{phone}}` | customer phone |
| `{{section_name}}` | inbox section / service name |
| `{{service_name}}` | requested service name |
| `{{company}}` | customer company |
| `{{project_name}}` / `{{project_stage}}` | CRM project data |
| `{{amount}}` / `{{due_date}}` / `{{invoice_number}}` | billing data |
| `{{payment_status}}` | payment state |
| `{{issue_description}}` | support context |
| `{{meeting_date}}` | scheduled meeting |
| `{{admin_name}}` | signed-in admin |
| `{{lead_id}}` | lead identifier |
| `{{date}}` | send date (YYYY-MM-DD; defaults to today) |

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

The route (`src/features/communication/webhook.ts`) accepts two payload
shapes:

1. **Real SES/SNS envelopes** — `SubscriptionConfirmation` (auto-confirmed
   with the `SubscribeURL`) and `Notification` with a nested JSON `Message`
   containing SES event records (`eventType` values `Delivery`, `Bounce`,
   `Complaint`, `Reject`, …) and `mail.messageId` / `mail.commonHeaders`.
2. **Legacy flat payload** — `{ "messageId": "…", "eventType":
   "delivered"|"bounced"|"complained"|"failed", … }`.

- Updates `email_logs` by `provider_message_id` (the SES message id parsed
  from the SMTP `250 OK <id>` response — see `sender.ts`).
- When `COMMUNICATION_WEBHOOK_SECRET` is set, requests must carry it in the
  `x-communication-secret` header.
- Unknown events are acknowledged without error (safe to retry).

To wire it in the AWS console: SES → Configuration sets → create one → Add
SNS destination → new topic → subscribe the **HTTPS** endpoint
`https://<domain>/api/webhooks/email` (use the exact host that serves the
site; SNS does not follow redirects).

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
   - For the `other` section (no per-section auto-reply), the `inbound_email`
     automation trigger template (default `email_received`) provides the
     acknowledgement when the trigger is enabled.
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

Wired flows (as of the current implementation):

- `lead_created` → drives the lead acknowledgement template sent to the
  visitor (falls back to `form_submission` when the trigger is disabled or
  no row exists).
- `inbound_email` → fires for inbound email routed to the `other` inbox
  section (which has no per-section auto-reply), defaulting to
  `email_received`.

The remaining events (`payment_failed`, `project_started`, `milestone_reached`,
…) are configured and ready — they fire when their business flow is wired to
`resolveTriggerTemplateKey` in a future step.

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

Due schedules are sent by `processDueSchedules()`
(`src/features/communication/process-schedules.ts`):

1. Selects `pending` schedules with `send_at <= now` (batch of 50).
2. Sends each through the standard pipeline (load template → auto-fill with
   the row's `data` + recipient name → render → SMTP → log).
3. Marks the row `sent` (with `sent_at`) or `failed` (with `error_message`).
4. Idempotent per row (`idempotency_key = schedule:<id>`) — overlapping runs
   never double-send.

Triggered by the Vercel Cron entry in `vercel.json` (daily at 00:00 UTC;
Hobby plans are limited to once per day — Pro+ can tighten the expression):

```text
GET /api/email/schedules/process
```

The route accepts Vercel cron invocations (`x-vercel-cron-schedule` header)
or `Authorization: Bearer $COMMUNICATION_CRON_SECRET`.

The admin dashboard can create and cancel schedules.

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

## 14b. Validation Checklist

Use the admin Communication dashboard (`/admin/communication`) to verify each
layer:

1. **Env vars** — `EmailConfigStatus` shows exactly which keys are set
   (`SES_SMTP_HOST/PORT/USER/PASS`, `COMMUNICATION_FROM_EMAIL`) and lists any
   missing ones.
2. **Relay** — "Test SMTP connection" probes the live host: banner reveals
   real SES SMTP vs a Mail Manager ingress gateway (which silently drops
   outbound mail), and verifies the credentials authenticate.
3. **DNS** — "Run DNS check" resolves MX (Zoho), SPF, DKIM and DMARC and
   flags missing/misconfigured records.
4. **Sender identity** — `COMMUNICATION_FROM_EMAIL` must be a verified SES
   identity (domain or address) in the configured region, and the SES account
   must be out of sandbox for delivery to arbitrary recipients.
5. **Webhook** — SES configuration set → SNS → HTTPS
   `https://www.stratifit.com/api/webhooks/email` so `email_logs` statuses
   become `delivered`/`bounced` instead of staying `sent`.

A mail is fully working when: the relay probe says "AWS SES SMTP + Credentials
OK", the DNS panel says "All required records OK", a test send logs
`delivered` (via the webhook), and the customer's reply lands in the Zoho
mailbox.

---

## 15. Testing

- `src/features/email-inbox/reply.test.ts` — admin reply path end-to-end
  (mocked Supabase + sender): subject derivation, threading headers, outbound
  record, failure propagation.
- `src/features/email-inbox/inbound.test.ts` — inbound processing with mocked
  Supabase.
- `src/features/email-inbox/language.test.ts` — language detection.
- `src/features/communication/auto-fill.test.ts` — placeholder replacement
  and context building (including the customer/lead/date keys).
- `src/features/communication/process-schedules.test.ts` — due-schedule
  processing: send, mark sent, failure marking, idempotency.
- `src/features/communication/renderer.test.ts` — React Email template via
  `@react-email/render`: branding, escaping, localized partials, signature.
- `src/features/communication/dns-verify.test.ts` — MX/SPF/DKIM/DMARC record
  classification.
- `src/features/communication/smtp-config.test.ts` — host classification +
  `SES_SMTP_*` env resolution.
- Baseline: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`.
