# Requirements — Zoho Mail Sent Folder Two-Way Sync

## Functional Requirements

### FR-1 Dashboard → Zoho Sent (mirror)
- A successful send through `sendTemplateEmail` (manual sends, admin replies,
  auto-replies, schedules, lead acknowledgements) SHALL be mirrored as a copy
  into the Zoho Mail Sent folder when:
  - IMAP is configured (`IMAP_HOST/USER/PASS`), and
  - `IMAP_SENT_MIRROR` is enabled, and
  - the send carried a concrete RFC 5322 Message-ID.
- The mirror SHALL copy every conversation send regardless of the `from`
  address; the copy is appended to the synced mailbox's Sent folder, and the
  Sent-folder sweep only imports mailbox-owned sends, so foreign-address
  copies can never create dashboard duplicates.
- The Sent folder SHALL be located robustly: the configured
  `IMAP_SENT_FOLDER` when it exists, else the RFC 6154 `\Sent` special-use
  flag, else common localized sent-folder names, else the configured value.
- The mirrored copy SHALL preserve the original Message-ID, subject, from,
  to, In-Reply-To, References, HTML and text content.
- Mirroring SHALL be best-effort: a mirror failure MUST NOT fail the email
  send, MUST NOT change `email_logs` status, and SHALL be logged without
  secrets.
- The mirror outcome (mirrored / skipped / failed) SHALL be returned to the
  caller and surfaced in the admin UI (composer and inbox reply) so operators
  can see why a copy did not appear in Zoho Sent.
- Mirroring SHALL NOT produce duplicate copies when a send is retried
  (idempotency is inherited: a retried idempotent send returns early).

### FR-2 Zoho Sent → Dashboard (sweep)
- When `IMAP_SYNC_SENT` is enabled, the IMAP worker SHALL additionally sweep
  the configured `IMAP_SENT_FOLDER` (default `Sent`).
- Messages in the Sent folder whose `From` matches the configured Zoho
  mailbox SHALL be stored as `direction: 'outbound'` messages.
- Messages in the Sent folder not sent by the Zoho mailbox SHALL be skipped.
- Imported sent messages SHALL join the matching conversation thread:
  threading headers first (In-Reply-To/References), then recipient email +
  normalized subject on open threads within 30 days, otherwise a new thread
  (`source = 'imap'`, status `waiting_on_customer`) in the `other` section.
- Importing SHALL update the matched thread: status `waiting_on_customer`,
  `last_outbound_at`, `last_message_at`.
- Importing SHALL be idempotent: a message whose RFC message-id is already
  stored (either as `headers->>message_id` — mirrored dashboard sends — or as
  `provider_message_id` — Zoho-native sends) MUST NOT be inserted twice.
- Attachments on Zoho-sent messages SHALL be stored like inbound attachments.

### FR-3 Configuration
- `IMAP_SENT_FOLDER` — IMAP folder holding sent mail (default `Sent`).
- `IMAP_SYNC_SENT` — import Zoho-sent mail into the dashboard. **On by
  default** when IMAP is configured; `0`/`false` disables.
- `IMAP_SENT_MIRROR` — mirror dashboard sends into Zoho Sent. **On by
  default** when IMAP is configured; `0`/`false` disables.
- All three MUST be documented in `.env.example` and in the admin IMAP status
  panel so operators can see the effective state.

## Non-Functional Requirements

- No secrets in code; credentials come from environment variables.
- Mirror calls are server-side only (service-role/`server-only`).
- No new database columns are required; `email_messages.headers`,
  `provider_message_id`, `email_messages` direction, and `email_threads`
  source `'imap'` already cover it.
- Sent-message `store` logic reuses the existing threading helpers
  (`email-imap/parse.ts`).
- Lint, typecheck, tests, and production build pass.