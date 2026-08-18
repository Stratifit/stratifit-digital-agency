# Requirements — Stratifit Communication Engine

## Functional Requirements

### FR-1 Multilingual templates
- The engine SHALL ship 39 templates (23 auto-replies, 16 manual), each with
  `en`, `de`, `fr`, `es` subject and body content.
- Templates SHALL be stored in the database and editable in the CMS.
- Unknown/empty languages SHALL fall back to English.

### FR-2 Sending
- All email SHALL be sent through Nodemailer using AWS SES SMTP credentials
  (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
- The sender SHALL support a configurable `from` ("reply as") address,
  chosen by the admin in the dashboard.
- Every send SHALL be recorded in `email_logs` with status, language,
  template key, sender, recipient, and timestamps.
- Sending MUST NOT fail the primary flow (lead submission, thread reply)
  — failures are logged.

### FR-3 Language detection and selection
- Incoming message language SHALL be detected (en/de/fr/es) from subject and
  body; English SHALL be the fallback.
- Auto-replies SHALL be rendered in the detected (or thread) language.

### FR-4 Auto-fill
- Templates SHALL support `{{placeholders}}` for name, email, project name,
  project stage, invoice amount, due date, payment status, issue
  description, meeting date, admin name, and section name.
- Incoming messages SHALL extract and store the sender name/email; replies
  SHALL pre-fill the composer with them.

### FR-5 Triggers
- `automation_triggers` SHALL map event types to template keys and SHALL be
  togglable by admins.
- Triggered sends SHALL detect language and auto-fill variables.

### FR-6 Admin dashboard
- Template library: list, filter (auto/manual, category, language), preview
  in all 4 languages, edit, duplicate, enable/disable.
- Composer: choose template + language + reply-as, see auto-filled values,
  preview, send.
- Logs: recent sends with status.
- Schedules: create + list scheduled sends.
- Triggers: list + toggle.

### FR-7 Conversation inbox
- Threads/messages continue to work; admin replies and auto-replies are sent
  through the new engine and recorded as outbound messages.

## Non-Functional Requirements

- No secrets in code; credentials come from environment variables.
- Validation via Zod on every server action.
- RLS enabled on all new tables (admin-only).
- Lint, typecheck, tests, and production build pass.
