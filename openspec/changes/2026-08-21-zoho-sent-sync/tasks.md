# Tasks — Zoho Mail Sent Folder Two-Way Sync

## 1. Configuration
- [x] `email-imap/config.ts` — add `sentFolder` (default `Sent`), `syncSent`
      (`IMAP_SYNC_SENT`), `mirrorSent` (`IMAP_SENT_MIRROR`) to `ImapConfig` +
      resolution; update `config.test.ts`
- [x] `.env.example` — document `IMAP_SENT_FOLDER`, `IMAP_SYNC_SENT`,
      `IMAP_SENT_MIRROR`

## 2. Outbound Message-ID capture
- [x] `communication/sender.ts` — optional `messageId` input, passed to
      Nodemailer; result gains `rfcMessageId`
- [x] `communication/send-template.ts` — generate RFC Message-ID, pass to
      sender, store in outbound headers, invoke `mirrorSentToZoho` after a
      successful send
- [x] `communication/send-template.ts` — `recordOutboundMessage` persists
      `headers.message_id`

## 3. Mirror (dashboard → Zoho Sent)
- [x] `email-imap/sent-mirror.ts` — config gate + from-address gate + raw
      render (streamTransport) + IMAP APPEND; best-effort result type
- [x] `email-imap/parse.ts` — pure `isFromSelf` helper + tests

## 4. Sent sweep (Zoho → dashboard)
- [x] `email-imap/fetch.ts` — sweep `IMAP_SENT_FOLDER` when `IMAP_SYNC_SENT`;
      skip non-self senders; mark \Seen after storage
- [x] `email-imap/store.ts` — `storeImapSentMessage`: dedupe by header or
      provider message-id, thread resolve on recipient, outbound insert,
      thread update, attachment upload (shared helper with inbound)

## 5. Admin surface
- [x] `email-imap/status.ts` + `components/admin/imap-status-panel.tsx` —
      report sent sync / mirror state and sent folder

## 6. Verification + docs
- [x] Tests: config flags, `isFromSelf`; baseline `npm run lint`,
      `npx tsc --noEmit`, `npm test`, `npm run build`
- [x] Update `docs/IMAP_INBOX.md`, `docs/EMAIL_SYSTEM.md`

## Out of scope
- Zoho SMTP replacement, Zoho Mail API, flag/read-state sync, mirroring
  non-conversation `sendEmail()` calls