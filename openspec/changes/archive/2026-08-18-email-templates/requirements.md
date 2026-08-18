# Requirements — Email Template Library & Automatic Sends

Normative: SHALL / SHOULD / MAY / MUST.

## R1 — Template library

- R1.1 The admin SHALL be able to list email templates grouped by category,
  with a category dropdown filter.
- R1.2 Each template SHALL store: unique key, category, multilingual name,
  multilingual subject, multilingual body, trigger event, enabled flag, and
  display order.
- R1.3 Template subject/body SHALL be editable for en, de, fr, and es via
  the existing LocaleTabs editor pattern; English is required.
- R1.4 A template SHALL be enabled or disabled without losing its content.
- R1.5 Template keys SHALL be unique and slug-shaped (`[a-z0-9-]+`).
- R1.6 The `other`-style protected rows are not applicable; all templates
  MAY be edited or deleted, but deleting a template SHALL unlink it from
  sections (FK `on delete set null`).

## R2 — Triggers

- R2.1 Each template SHALL declare a trigger event: `manual`,
  `on_lead`, `on_inbound_email`, or `on_thread_resolved`.
- R2.2 `on_inbound_email` templates SHALL be sent as the auto-reply when the
  section has an `auto_reply_template_id` and the template is enabled.
- R2.3 `on_lead` templates SHALL be sent as the contact-form acknowledgement
  when the mapped section has an `auto_reply_template_id`.
- R2.4 `on_thread_resolved` templates SHALL be sent when an admin resolves a
  thread AND the section has `resolved_email_enabled` true and a
  `resolved_template_id`.
- R2.5 Automatic sends SHALL NOT fail the originating operation
  (lead insert / inbound webhook / resolve action) when sending fails.
- R2.6 Sends SHALL remain idempotent (unique idempotency key per
  target message), and the recipient SHALL always be the thread's stored
  customer email.

## R3 — Language matching

- R3.1 Form-originated threads SHALL store the visitor's preferred locale as
  the thread language.
- R3.2 Inbound-email threads SHALL store a language detected from the
  `Content-Language` header or a lightweight subject/body heuristic,
  defaulting to `en`.
- R3.3 Automatic emails SHALL use the template's translation for the thread
  language, falling back to English when missing.
- R3.4 The customer's language SHALL NOT be mixed across languages in one
  email.

## R4 — Placeholders

- R4.1 Template bodies SHALL support `{{name}}`, `{{section_name}}`,
  `{{company}}`, `{{amount}}`, `{{due_date}}`, and `{{invoice_number}}`
  placeholders.
- R4.2 Unknown placeholders SHALL be replaced with an empty string when
  rendering.

## R5 — Seed library

- R5.1 The migration SHALL seed templates for: contact auto-thanks,
  branding/web/AI/acquisition/support auto-replies, project kickoff,
  project complete, follow-up after resolution, payment reminder, and
  invoice ready.
- R5.2 Seeded templates SHALL include subject and body for en, de, fr, and
  es.

## R6 — Verification

- R6.1 WHEN a visitor submits the contact form THEN the acknowledgement is
  sent in the visitor's language using the mapped template (or the current
  fallback) AND the lead flow still succeeds.
- R6.2 WHEN an inbound email arrives in a section with an enabled
  `on_inbound_email` template THEN the auto-reply is sent in the detected
  language AND the webhook returns 200.
- R6.3 WHEN an admin resolves a thread in a section with
  `resolved_email_enabled` THEN the resolved template is sent in the thread
  language AND the thread is marked resolved.
- R6.4 WHEN a template is edited and saved THEN the new subject/body are used
  by subsequent sends without a deploy.
