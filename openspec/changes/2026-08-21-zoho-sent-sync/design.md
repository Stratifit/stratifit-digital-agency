# Design — Zoho Mail Sent Folder Two-Way Sync

## Architecture

```text
┌────────────────────────────┐         ┌──────────────────────────────┐
│ Dashboard send             │         │ Zoho Mail EU (imap.zoho.eu)  │
│ (sendTemplateEmail)        │         │  INBOX / Junk  → inbound sync│
└────────────┬───────────────┘         │  Sent          → sent sweep  │
             │ SES SMTP (unchanged)    └──────────────▲───────────────┘
             ▼                         APPEND (copy)  │
      { ok } ── mirrorSentToZoho() ────────────────────┘
             │                      email-imap/sent-mirror.ts
             ▼
  email_logs / email_messages (outbound, headers.message_id)
             ▲
  email-imap/fetch.ts (Sent sweep) ── storeImapSentMessage() ──┘
```

Two directions, one IMAP account (`IMAP_USER`), no provider change.

## Sending pipeline change (dashboard → Zoho Sent)

`sendTemplateEmail` already funnels every conversation send. Changes:

1. `sender.ts` — `SendEmailInput` gains optional `messageId` (RFC 5322
   Message-ID). It is passed to Nodemailer as the `messageId` option so
   `info.messageId` (and the wire headers) carry the same id. `SendEmailResult`
   keeps `messageId` = SES provider message id (webhook matching unchanged)
   and gains `rfcMessageId`.
2. `send-template.ts` — generates `<uuid@<sender-domain>>` before sending,
   passes it to `sendEmail`, stores it in the outbound message record
   (`headers: { message_id }`), and after a successful send calls
   `mirrorSentToZoho(...)` with the rendered content.
3. `recordOutboundMessage` — persists `headers.message_id` so a later re-sweep
   of the Zoho Sent folder recognizes the mirrored copy as a duplicate.

## Mirror (sent-mirror.ts)

`mirrorSentToZoho(input)`:

- Resolves `resolveImapConfig(process.env)`.
- No-ops (returns `mirrored: false` + reason) when IMAP is unconfigured,
  `IMAP_SENT_MIRROR` is off, no RFC message-id exists, or the `from` address
  is not the `IMAP_USER` mailbox nor one of the configured sender addresses.
- Renders the RFC 5322 source with **Nodemailer streamTransport** (same
  from/to/subject/html/text/headers/Message-ID) — no new dependency.
- `ImapFlow` connect → `client.append(IMAP_SENT_FOLDER, raw, [], date)`.
- Never throws to the caller; returns `{ mirrored, skipped?, error? }`.
- The send path logs mirror failures as warnings only.

## Sent sweep (fetch.ts + store.ts)

- `runImapFetch()` — after the inbound mailboxes, when `config.syncSent`, locks
  `config.sentFolder` and fetches the same `{ since }` window.
- Each message parsed with `mailparser`; when `isFromSelf(from, config.user,
  senderAddresses)` is false it is skipped (counted), otherwise
  `storeImapSentMessage()` is called, then marked `\Seen` on success.
- `isFromSelf` is a pure helper in `parse.ts` (testable).

### storeImapSentMessage (store.ts)

1. **Dedupe** — existing row where `headers->>message_id = rfcId` **or**
   `provider_message_id = rfcId` → `duplicate`.
2. **Threading** — reuse `resolveThreadId` with `customerEmail = to_email`
   (the recipient): reference message-ids → stored threads (GIN on
   `headers->>message_id`); else recipient + normalized subject on open
   threads (30 days); else new thread in the `other` section with
   `source = 'imap'`, status `waiting_on_customer`, `customer_email = to`,
   `last_outbound_at = date`.
3. **Insert** — `direction: 'outbound'`, `provider_message_id = rfcId`,
   `headers: { message_id: rfcId }`, status `sent`, `sent_at = date`.
4. **Update thread** — `status: 'waiting_on_customer'`, `last_outbound_at`,
   `last_message_at`.
5. **Attachments** — same upload flow as inbound (shared helper).

## Configuration

```text
IMAP_SENT_FOLDER=Sent      # folder that holds sent mail (default Sent)
IMAP_SYNC_SENT=1           # import Zoho-sent mail into the dashboard
IMAP_SENT_MIRROR=1         # mirror dashboard sends into Zoho Sent
```

Defaults are off/`Sent` so existing deployments are unaffected.

## Admin surface

- `imap-status-panel.tsx` reports: sent sync enabled/disabled, sent folder
  name, mirror enabled/disabled (from `ImapStatus`).
- The existing "Sync IMAP inbox" button + cron sweep both directions.

## Database

No migration required. Existing columns: `email_messages.headers` (jsonb,
GIN-indexed), `provider_message_id` (unique partial), `direction`, and
`email_threads.source in (... 'imap')` cover the new flow.