# IMAP_INBOX.md — Zoho Mail IMAP Inbox

**Project:** Stratifit Digital Agency
**Document type:** Inbox ingestion spec
**Status:** Current
**Primary references:** `docs/EMAIL_SYSTEM.md`, `docs/DATABASE.md`, `AGENTS.md`

---

## 1. Purpose

The IMAP inbox pulls customer replies from the Zoho Mail EU mailbox
(`imap.zoho.eu:993`) into the admin dashboard's conversation inbox. It
complements the SES webhook inbound path: SES delivers outbound mail, customer
replies land in Zoho Mail, and the IMAP fetch worker syncs them into the same
`email_threads` / `email_messages` tables that power `/admin/email/inbox`.

It also provides **two-way Sent-folder sync** with the same Zoho mailbox:

- **Dashboard → Zoho Sent**: every successful conversation send is mirrored
  into the Zoho **Sent** folder (IMAP APPEND), so mail sent from the
  dashboard appears in Zoho Mail's Sent section.
- **Zoho → Dashboard**: messages sent from Zoho (webmail, mobile) are swept
  from the **Sent** folder and imported as `outbound` messages on the matching
  conversation thread.

Outbound delivery stays on AWS SES; Zoho is used for reception and the Sent
mirror only.

---

## 2. Architecture

```
Zoho Mail EU mailbox (imap.zoho.eu:993, TLS)
        │  imapflow — fetch recent messages (source)
        ▼
mailparser — MIME parse (text, html, attachments, headers)
        ▼
email-imap/store.ts — thread resolve + idempotent insert
        │
        ├─► email_threads / email_messages (Supabase, RLS admin-only)
        └─► email_attachments + Storage bucket "email-attachments" (private)
        │
        ▼
Admin dashboard (/admin/email/inbox) + API routes

Dashboard sends (SES SMTP) ──► email-imap/sent-mirror.ts ──► Zoho Sent (APPEND)
Zoho Sent ──► IMAP sweep ──► storeImapSentMessage ──► outbound messages on threads
```

Module layout (`src/features/email-imap/`):

| File | Responsibility |
| --- | --- |
| `config.ts` | IMAP env resolution (pure) |
| `parse.ts` | Message-id extraction, threading resolver, HTML→text, attachment summary, `isFromSelf` (pure) |
| `store.ts` | Thread resolution + idempotent message insert (inbound + Sent-folder outbound) + attachment upload |
| `fetch.ts` | `runImapFetch()` — imapflow worker (INBOX/Junk sweep + optional Sent sweep) |
| `sent-mirror.ts` | Mirror dashboard sends into the Zoho Sent folder (best-effort) |
| `route-auth.ts` | Admin session check for route handlers |
| `actions.ts` | Dashboard "Sync IMAP inbox" server action |

---

## 3. Environment Variables

```text
IMAP_HOST=imap.zoho.eu
IMAP_PORT=993
IMAP_USER=your-zoho-email@stratifit.com   # mailbox login
IMAP_PASS=your-zoho-app-password          # Zoho app password, NOT the login password
IMAP_MAILBOX=INBOX
IMAP_MAILBOXES=INBOX, Junk                # folders swept per run (Junk catches filtered replies)
IMAP_SYNC_SINCE_DAYS=7                    # fetch window (clamped 1–90)
IMAP_SENT_FOLDER=Sent                     # folder that holds sent mail
IMAP_SYNC_SENT=1                          # import Zoho-sent mail into the dashboard
IMAP_SENT_MIRROR=1                        # mirror dashboard sends into the Zoho Sent folder
IMAP_SYNC_SECRET=…                        # bearer secret for POST /api/inbox/fetch
```

Zoho Mail requires an **app password**: Zoho Mail → Profile → App Passwords
(IMAP access must be enabled for the account). All values are server-only.

### 3.1 Receiving replies on every reply-as address

The IMAP worker authenticates as a **single Zoho account** (`IMAP_USER`) and
sweeps the folders in `IMAP_MAILBOXES`. For a customer reply to be received
it must land in that account's mailbox, which means:

1. **Enable IMAP** for the account (Zoho Mail → Settings → Mail Accounts →
   POP/IMAP → enable IMAP Access) — the sync fails with
   "You are yet to enable IMAP for your account" until this is on.
2. **Every reply-as address must exist in Zoho** as the account itself or as
   an **alias** of it: Zoho Mail → Settings → Mail Accounts → Aliases (or the
   admin console for org accounts). Replies sent to an address that is not a
   mailbox/alias of `IMAP_USER` are silently lost.
3. The sender list managed at `/admin/communication/addresses` (hello@,
   info@, sales@, support@, contact@, …) is exactly the set of addresses that
   must be covered. The dashboard IMAP status panel lists them and flags
   missing coverage.
4. `IMAP_MAILBOXES=INBOX, Junk` keeps spam-filtered replies visible in the
   dashboard too.

---

## 4. Fetch Worker

`runImapFetch()` (`fetch.ts`):

1. Resolve config; fail loudly when `IMAP_HOST/USER/PASS` are missing.
2. Connect via `imapflow` (TLS on 993, never plaintext; 20s connect timeout).
3. Lock each mailbox, search `{ since: now - sinceDays }` (recent window; the
   "unread" requirement is covered by the window + idempotency, and messages
   are marked `\Seen` only after they are stored safely).
4. For each message: `mailparser.simpleParser(source)` → sender, subject,
   date, message-id, `In-Reply-To`, `References`, text/html, attachments.
5. Store via `storeImapMessage` (below); mark `\Seen` on success.
6. When `IMAP_SYNC_SENT` is on, sweep `IMAP_SENT_FOLDER` the same way, keeping
   only messages sent by the Zoho mailbox (`isFromSelf`) and storing them via
   `storeImapSentMessage` as outbound messages.
7. Return a summary (`{ scanned, inserted, duplicates, failed, newThreads,
   skipped }`).

Per-message errors are logged and counted — one bad message never aborts the
sweep.

---

## 5. Storage

`storeImapMessage` (`store.ts`):

- **Idempotent** by RFC message-id (`email_messages.provider_message_id`
  unique partial index; fallback synthetic id `imap:<user>:<uid>`).
- **Threading** (mirrors the webhook inbound rules):
  1. `In-Reply-To` / `References` message-ids → stored message
     (`headers->>message_id` GIN index) → its thread.
  2. Customer email + normalized subject on open threads (30-day window).
  3. Otherwise a new thread (`source = 'imap'`) in the `other` section.
- Attachments are uploaded to the private `email-attachments` bucket
  (`<messageId>/<sanitized-name>`) and recorded in `email_attachments`, plus a
  compact summary on `email_messages.attachments`.

### 5b. Sent-folder sync (two-way)

**Dashboard → Zoho Sent** (`email-imap/sent-mirror.ts`, called from
`sendTemplateEmail` after a successful send):

- Gate: IMAP configured, `IMAP_SENT_MIRROR` on, an RFC Message-ID exists, and
  the `from` address is the synced Zoho mailbox or one of its aliases /
  configured sender addresses (otherwise it is skipped, never an error).
- The RFC 5322 source is rendered locally with Nodemailer `streamTransport`
  (same from/to/subject/html/text/Message-ID/threading headers — nothing is
  sent), then `APPEND`ed into `IMAP_SENT_FOLDER`.
- Best-effort: a mirror failure only logs a warning; it never fails the email,
  never changes `email_logs`, and never changes the send outcome.
- Because the copy keeps the same Message-ID as the dashboard's stored
  outbound record (`headers.message_id`), a later Sent-folder sweep recognizes
  it as a duplicate (no double records).

**Zoho → Dashboard** (`storeImapSentMessage` in `store.ts`, run by the
Sent-folder sweep):

- Keeps only messages sent by the Zoho mailbox (`isFromSelf` vs `IMAP_USER` +
  sender addresses); anything else is skipped.
- **Idempotent** by RFC message-id, matching either `provider_message_id`
  (Zoho-native sends) or `headers->>message_id` (mirrored dashboard sends).
- **Threading on the recipient**: reference message-ids first, then recipient
  email + normalized subject on open threads (30 days), else a new `imap`
  thread in the `other` section.
- Stored as `direction: 'outbound'`, `status: 'sent'`, with `sent_at` from the
  message date; the thread is set to `waiting_on_customer` with
  `last_outbound_at` / `last_message_at` updated.
- Attachments use the same storage pipeline as inbound.

### Schema (migration 00070)

- `email_threads.source` check extended with `'imap'`.
- `email_attachments` — id, message_id (FK cascade), name, mime_type,
  size_bytes, storage_bucket, storage_path, content_id, width, height.
- Storage bucket `email-attachments` (private; admins read via the app).
- GIN index on `email_messages(headers)` for message-id threading lookups.

No new migration is required for the Sent sync — `headers->>message_id`,
`provider_message_id`, `direction`, and `email_threads.source = 'imap'` already
cover it.

---

## 6. API Routes

| Route | Method | Auth | Purpose |
| --- | --- | --- | --- |
| `/api/inbox/fetch` | POST | cron header, `x-imap-sync-secret`/`?secret=`, or admin session | Run one IMAP sweep |
| `/api/inbox/messages` | GET | admin session | Paginated threads (`section`, `status`, `language`, `page`, `pageSize`) |
| `/api/inbox/message/[id]` | GET | admin session | Thread detail + messages + attachments |
| `/api/inbox/attachments/[id]` | GET | admin session | Download attachment bytes |

All routes run on the Node.js runtime (imapflow needs node:net/tls). The fetch
route is on the Vercel cron (`vercel.json`, daily at 05:30 UTC — Hobby plans
limit crons to once per day, and a more frequent expression fails the whole
deployment). For fast reply visibility, the inbox page also auto-syncs in the
background when an admin opens it (throttled to once per 2 minutes), and the
"Sync IMAP inbox" button runs a sweep on demand.

---

## 7. Dashboard

- **Inbox list** (`/admin/email/inbox`) — sections, status/language filters,
  pagination (25/page), and a **Sync IMAP inbox** button with inline summary.
- **Thread detail** — message history, inbound/outbound styling, **attachment
  viewer** (download links with name + size), reply composer unchanged.
- `source = 'imap'` threads display an **IMAP** badge.
- The **IMAP status panel** reports the Sent-folder configuration: import on/off
  (`IMAP_SYNC_SENT`), mirror on/off (`IMAP_SENT_MIRROR`), and the sent folder
  name, with a hint on how to enable both.

---

## 8. Validation Checklist

1. **Env** — `IMAP_HOST/PORT/USER/PASS` set in `.env.local` and Vercel; create
   the Zoho app password.
2. **Connection** — trigger `POST /api/inbox/fetch` (or the admin Sync button)
   and confirm `ok: true` with `scanned > 0`; failures surface a clear error.
3. **Storage** — new threads appear in the inbox with source `IMAP`; messages
   have text (HTML converted), correct sender/subject/date; message-ids match.
4. **Threading** — reply to an existing conversation lands in the same thread
   (In-Reply-To/References); a fresh subject creates a new thread.
5. **Attachments** — files visible in the thread, download via
   `/api/inbox/attachments/[id]`, bytes stream from private storage.
6. **Idempotency** — re-running the fetch reports `duplicates`, never
   duplicate messages.
7. **Security** — the `/api/inbox/*` routes return 401 without an admin
   session; IMAP credentials are server-only; the storage bucket is private.
8. **Sent sync (dashboard → Zoho)** — send from the dashboard composer with
   `IMAP_SENT_MIRROR=1` and a reply-as address that is the Zoho mailbox or an
   alias; the message appears in Zoho Mail → Sent with the same Message-ID as
   the dashboard record.
9. **Sent sync (Zoho → dashboard)** — send a message from Zoho webmail to a
   customer whose conversation exists in the dashboard; the next Sweep imports
   it as an outbound message on that thread (`waiting_on_customer`). A repeated
   sweep reports it as a duplicate, never twice.

---

## 9. Testing

- `src/features/email-imap/parse.test.ts` — message-id extraction, threading
  resolver, HTML→text, attachment normalization, `isFromSelf`.
- `src/features/email-imap/config.test.ts` — env resolution, clamping, and the
  Sent-folder flags.
- Baseline: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`.
