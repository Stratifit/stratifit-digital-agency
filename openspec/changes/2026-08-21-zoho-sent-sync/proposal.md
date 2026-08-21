# Proposal — Zoho Mail Sent Folder Two-Way Sync

## Why

The Stratifit dashboard sends email through AWS SES SMTP and receives inbound
replies from the Zoho Mail EU mailbox over IMAP. Today the two sides of the
"Sent" story are disconnected:

- Emails sent from the dashboard (SES) never appear in Zoho Mail's **Sent**
  folder, so an admin working in Zoho Mail has no record of them.
- Emails sent from Zoho Mail (webmail, mobile, Zoho CRM) never appear in the
  Stratifit dashboard, so conversation threads miss outbound messages that did
  not originate from the app.

The owner requires two-way visibility:

1. **Dashboard → Zoho**: a successful send from the dashboard should show in
   Zoho Mail's Sent section.
2. **Zoho → Dashboard**: a message sent from Zoho Mail should show in the
   dashboard, attached to its conversation thread.

Owner decision (2026-08-21): **keep AWS SES as the outbound provider** and
mirror a copy of each dashboard send into the Zoho Sent folder via IMAP APPEND;
**import Zoho-sent mail** into conversation threads via the existing IMAP
worker. No provider replacement, no migration of the sending stack.

## Scope

**Build**

- `src/features/email-imap/sent-mirror.ts` — after a successful SES send,
  render the raw RFC message and `APPEND` it into the Zoho Sent folder
  (best-effort, never fails the primary send).
- Sent-folder sweep in the IMAP worker (`fetch.ts` + `store.ts`): messages
  sent by the Zoho mailbox are stored as `direction: 'outbound'` messages on
  the matching conversation thread (dedupe by RFC message-id).
- Capture and persist the RFC Message-ID on outbound sends
  (`sender.ts`, `send-template.ts`, `recordOutboundMessage` headers) so
  mirrored copies are recognized as duplicates on re-sweep.
- New env-driven config: `IMAP_SENT_FOLDER`, `IMAP_SYNC_SENT`,
  `IMAP_SENT_MIRROR` (+ `.env.example`, admin IMAP status panel).

**Keep**
- AWS SES SMTP remains the outbound delivery path (`sender.ts`,
  `EMAIL_SYSTEM.md` provider section).
- The existing inbound IMAP sweep (`INBOX`, `Junk`) is unchanged.

## Out of scope (v1)

- Replacing SES with Zoho SMTP.
- Zoho Mail API (OAuth) integration — IMAP covers both directions.
- Mirroring free-form `sendEmail()` calls that are not conversation sends
  (e.g. the internal admin lead notification).
- Bidirectional flag/star/read-state sync.