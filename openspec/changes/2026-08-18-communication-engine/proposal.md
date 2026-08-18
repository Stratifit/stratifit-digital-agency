# Proposal — Stratifit Communication Engine (rebuild)

## Why

The current email system was built around Resend (API sending, `email_events`
delivery tracking, received-email API) with templates stored as JSONB
translations. The product now requires:

- **Nodemailer + AWS SES SMTP** as the sending provider (per explicit owner
  decision; Resend is removed)
- A unified, non-technical-friendly **Communication Engine** in the dashboard
- **39+ templates** (23 auto-replies, 16 manual) fully translated in
  en/de/fr/es, DB-stored and CMS-editable (per owner decision)
- Language detection, name/email auto-fill, reply-as selection, schedules,
  and automation triggers
- Clean separation of renderer / sender / auto-fill / triggers / language

## Scope

**Delete**
- `src/features/email/*` (Resend client, send pipeline, template registry)
- `email_events` table (Resend delivery tracking → replaced by `email_logs`)
- Old `email_templates` table (recreated with `template_type`)

**Keep**
- Conversation storage (`email_inbox_sections`, `email_threads`,
  `email_messages`) — the dashboard spec requires conversations; the engine
  builds on them rather than deleting them.

**Build**
- `src/features/communication/` — engine: `sender` (Nodemailer + AWS SES
  SMTP), `renderer` (branded HTML + text with language-aware partials),
  `language` (detection + selection), `auto-fill`, `triggers`, template
  catalog, schemas, queries, mutations
- Tables: `email_templates` (rebuilt), `email_logs`, `email_schedules`,
  `automation_triggers`
- Admin dashboard: Communication section (template library, composer with
  reply-as, logs, schedules, triggers) plus the existing inbox wired to the
  new engine

## Out of scope (v1)

- SES inbound receipt-rule setup (MX + SNS delivery) — infra step for the
  owner; the inbound route keeps the existing JSON email adapter
- Cron scheduling worker — schedules are stored and listed; a scheduler
  can be added when the deployment supports cron
