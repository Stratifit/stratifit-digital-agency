# Design — Stratifit Communication Engine

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│ Admin dashboard (/admin/communication/*)                     │
│  templates · send · logs · schedules · triggers · inbox      │
└───────────────┬─────────────────────────────────────────────┘
                │ server actions (Zod-validated, admin-guarded)
┌───────────────▼─────────────────────────────────────────────┐
│ src/features/communication/                                  │
│  templates/catalog.ts   — 39 template definitions (defaults) │
│  templates/partials.ts  — language-aware email shell parts   │
│  renderer.ts            — render translations → text/HTML    │
│  sender.ts              — Nodemailer + AWS SES SMTP          │
│  send-template.ts       — orchestration: load→render→send→log│
│  language.ts            — detect + pick + labels             │
│  auto-fill.ts           — {{variables}} resolution           │
│  triggers.ts            — event → template mapping           │
│  queries.ts / mutations.ts / schemas.ts / types.ts           │
└───────────────┬─────────────────────────────────────────────┘
                │ service-role writes / server reads
┌───────────────▼─────────────────────────────────────────────┐
│ Supabase tables                                              │
│  email_templates (rebuilt, +template_type)                   │
│  email_logs (replaces email_events)                          │
│  email_schedules · automation_triggers (new)                 │
│  email_inbox_sections / email_threads / email_messages (kept)│
└─────────────────────────────────────────────────────────────┘
```

## Sending pipeline

```text
event (lead / inbound / admin reply / manual send)
  → resolve template key (triggers.ts or explicit)
  → load email_templates row (service-role)
  → detect/pick language (language.ts)
  → auto-fill variables (auto-fill.ts)
  → render subject + text (renderer.ts)
  → wrap in branded HTML shell with partials (renderer.ts)
  → sendEmail via Nodemailer SES SMTP (sender.ts)
  → insert email_logs row + optional email_messages row
```

## Database

- `email_templates`: id, key (unique), template_type ('auto'|'manual'),
  category, name/subject/body_translations (jsonb en/de/fr/es), description,
  trigger_event, is_enabled, display_order, timestamps. Admin-only RLS.
- `email_logs`: id, template_key, recipient_email, sender_email, subject,
  language, status ('queued'|'sent'|'failed'|'delivered'|'bounced'|
  'complained'), error_message, related_type, related_id, timestamps.
  Admin-only RLS.
- `email_schedules`: id, template_key, recipient_email, recipient_name,
  language, send_at, status ('pending'|'sent'|'failed'|'cancelled'), data
  (jsonb variables), timestamps. Admin-only RLS.
- `automation_triggers`: id, event_type (unique), template_key, enabled,
  display_order, timestamps. Admin-only RLS.

## Template content

The 39-template catalog reuses the approved en/de/fr/es content previously
seeded for the Resend-era library (same copy), remapped to the spec's
template names, plus 5 new auto-reply templates (coming soon, quote request,
upcoming payment, document needed, file upload).

## Inbound email

The existing `/api/email/inbound` route is kept and re-pointed at the new
engine. It accepts a JSON email envelope (from/to/subject/text/headers),
detects language, resolves the section/thread, and sends the section's
auto-reply template through the new pipeline. SES inbound delivery (MX +
receipt rule + SNS → adapter) is an owner infra step, out of scope for v1.

## Admin UI

- `/admin/communication` — landing with links + recent logs
- `/admin/communication/templates` — library (filters, language tabs,
  preview, edit, duplicate, enable/disable)
- `/admin/communication/send` — composer (template, language, reply-as,
  recipient, auto-fill preview, send)
- `/admin/communication/logs` — recent email_logs
- `/admin/communication/schedules` — create + list
- `/admin/communication/triggers` — list + toggle
- Existing `/admin/email/inbox[/id]` — conversations, re-wired to the new
  engine (reply-as, template picker)
