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
```

Module layout (`src/features/email-imap/`):

| File | Responsibility |
| --- | --- |
| `config.ts` | IMAP env resolution (pure) |
| `parse.ts` | Message-id extraction, threading resolver, HTML→text, attachment summary (pure) |
| `store.ts` | Thread resolution + idempotent message insert + attachment upload |
| `fetch.ts` | `runImapFetch()` — imapflow worker |
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
IMAP_SYNC_SINCE_DAYS=7                    # fetch window (clamped 1–90)
IMAP_SYNC_SECRET=…                        # bearer secret for POST /api/inbox/fetch
```

Zoho Mail requires an **app password**: Zoho Mail → Profile → App Passwords
(IMAP access must be enabled for the account). All values are server-only.

---

## 4. Fetch Worker

`runImapFetch()` (`fetch.ts`):

1. Resolve config; fail loudly when `IMAP_HOST/USER/PASS` are missing.
2. Connect via `imapflow` (TLS on 993, never plaintext; 20s connect timeout).
3. Lock `INBOX`, search `{ since: now - sinceDays }` (recent window; the
   "unread" requirement is covered by the window + idempotency, and messages
   are marked `\Seen` only after they are stored safely).
4. For each message: `mailparser.simpleParser(source)` → sender, subject,
   date, message-id, `In-Reply-To`, `References`, text/html, attachments.
5. Store via `storeImapMessage` (below); mark `\Seen` on success.
6. Return a summary (`{ scanned, inserted, duplicates, failed, newThreads }`).

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

### Schema (migration 00070)

- `email_threads.source` check extended with `'imap'`.
- `email_attachments` — id, message_id (FK cascade), name, mime_type,
  size_bytes, storage_bucket, storage_path, content_id, width, height.
- Storage bucket `email-attachments` (private; admins read via the app).
- GIN index on `email_messages(headers)` for message-id threading lookups.

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

---

## 9. Testing

- `src/features/email-imap/parse.test.ts` — message-id extraction, threading
  resolver, HTML→text, attachment normalization.
- `src/features/email-imap/config.test.ts` — env resolution and clamping.
- Baseline: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`.
