# Proposal — Email Template Library & Automatic Sends

## Business Reason

The Email Inbox (archived change `2026-08-18-email-inbox`) lets customers
email Stratifit and admins reply by email, with a per-section auto-reply.
Today the auto-reply copy is two inline fields per section, English-only at
send time, and the contact-form acknowledgement is hardcoded English. The
agency needs a library of custom, reusable email templates for every
activity (auto-replies per service, onboarding, follow-ups, payment
reminders, invoices), editable in the CMS across all four languages
(en/de/fr/es), with automatic sends that match the customer's language.

## What Changes

- New `email_templates` table: admin-managed templates with multilingual
  subject/body, a category, a trigger event (manual, on lead, on inbound
  email, on thread resolved), enabled flag, and display order.
- `email_inbox_sections` gains `auto_reply_template_id` (dropdown in the
  sections editor) and `resolved_template_id` + `resolved_email_enabled`
  (automatic send when a section is finished/resolved).
- `email_threads` gains a `language` column (from the form's preferred
  locale, or detected from the inbound email) so every automatic email is
  sent in the customer's language, falling back to English.
- The inbound auto-reply and the contact-form acknowledgement become
  template-driven: the section's selected template is rendered with
  `{{name}}`/`{{section_name}}`-style placeholders in the thread language.
- New admin page `/admin/email/templates` — the template library with a
  category dropdown, per-template multilingual editor, enable/disable, and
  trigger selection; plus template dropdowns in `/admin/email/sections`.
- A seeded starter library covering: contact/branding/web/AI/acquisition/
  support auto-replies, project kickoff, project complete, follow-up after
  resolution, payment reminder, and invoice ready — all four languages.

## New Capabilities

- CMS-editable multilingual template library (dropdown + editor) in the
  email section.
- Language-matched automatic sends (reply in the customer's language).
- Automatic send when a section's conversation is resolved (on/off per
  section, template per section).
- Template-driven contact-form acknowledgement in the visitor's language.

## Modified Capabilities

- Section auto-reply: existing inline subject/body fields stay as a
  fallback; a selected template takes precedence.
- Lead email flow: the contact acknowledgement is sent from the mapped
  section's template when one is selected (fallback: current hardcoded
  acknowledgement).

## Non-Goals

- Billing/invoicing systems (templates exist as ready drafts only).
- Scheduled sends with a cron/timer (manual + lifecycle-event triggers only
  in V1; the trigger field is stored so scheduling can hook in later).
- Marketing campaigns or bulk sends.
- AI-generated copy.
- Per-template HTML design editing beyond subject/body paragraphs (branded
  shell stays in code, per CMS rules).

## Impact

- **Database:** new `email_templates` table + two section columns + one
  thread column; migration + seed + regenerated types.
- **Routes:** new `/admin/email/templates` admin page.
- **Email:** new template key `email_inbox_template` (no greeting prepend)
  for rendered library templates.
- **Security:** admin-only RLS on `email_templates`; all sends keep the
  existing idempotency, open-relay prevention, and admin guards.
- **Docs:** `docs/EMAIL_SYSTEM.md`, `docs/ROADMAP.md`.

## References

`docs/EMAIL_SYSTEM.md`, archived change `2026-08-18-email-inbox`,
`AGENTS.md`.
