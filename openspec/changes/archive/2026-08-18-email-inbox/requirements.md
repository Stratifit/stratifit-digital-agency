# Requirements — Email Inbox

Normative requirements for the Email Inbox capability.

Definitions:

- **Section** — an admin-managed inbox category (e.g., Contact, Brand
  Design, Website Development, AI & Automation, Acquisition, Support,
  Other) with routing addresses, a form-source mapping, and an optional
  auto-reply.
- **Thread** — one email conversation with a customer, grouped under a
  section.
- **Message** — a single inbound or outbound email within a thread.
- **Inbound email** — an email received by Resend Inbound and forwarded to
  `POST /api/email/inbound`.
- **Form submission** — a contact or acquisition form submission that
  creates a lead and an email thread.

## 1. Sections

- SHALL provide an admin-managed fixed list of sections.
- SHALL include seeded default sections: `contact`, `brand-design`,
  `website-development`, `ai-automation`, `acquisition`, `support`,
  `other`.
- SHALL support multilingual names for `en`, `de`, `fr`, `es` with English
  fallback.
- SHALL support enabling/disabling a section. A disabled section SHALL NOT
  receive new messages; existing threads remain visible but cannot accept
  new messages (any routed message falls back to `other`).
- SHALL support configuring routing addresses (email addresses) per
  section. An inbound email addressed to a routing address SHALL be routed
  to that section; unmatched addresses SHALL route to `other`.
- SHALL support mapping at most one form source key per section
  (`contact_form`, `acquisition_form`). A form submission SHALL create its
  thread in the section mapped to its source key; when no section maps the
  key, the thread SHALL be created in `other`.
- SHALL support a per-section auto-reply toggle and multilingual subject
  and body.
- SHALL NOT allow deleting the `other` section.
- SHALL support ordering sections for display.

## 2. Inbound Email Ingestion

- WHEN Resend sends an `email.received` webhook to `POST /api/email/inbound`,
  THEN the handler SHALL verify the Svix signature using
  `resend.webhooks.verify` with `RESEND_WEBHOOK_SIGNING_SECRET`.
- WHEN the signature is invalid, THEN the handler SHALL respond `401` and
  SHALL NOT store anything.
- WHEN verification passes, THEN the handler SHALL fetch the full email
  (headers, text, html, attachments metadata) from Resend's Received emails
  API using `data.email_id`.
- WHEN the email is already stored (same `message_id`), THEN the handler
  SHALL respond `200` without duplicating the message (idempotency).
- WHEN the email is new, THEN the handler SHALL:
  - resolve the section from the `to` / `received_for` addresses;
  - resolve the thread by `in-reply-to` / `references` matching an existing
    message's `message_id`, then by customer email + normalized subject
    within 30 days, then by creating a new thread;
  - store the inbound message with direction `inbound` and status
    `received`;
  - update the thread (subject, `last_message_at`, status `needs_reply`);
  - when the section's auto-reply is enabled, send the section auto-reply
    (multilingual fields resolved to `en` in V1) with `In-Reply-To` and
    `References` set to the inbound message, and log the send through the
    existing email-event idempotency flow.
- WHEN the handler fails after storing, THEN it SHALL still return `200` so
  Resend does not retry a duplicate (or SHALL be safe to retry via
  idempotency).
- WHEN Resend cannot fetch the full email, THEN the handler SHALL log the
  failure and respond `200` (message metadata may be re-fetched on Resend's
  retry).

## 3. Threads

- A thread SHALL have exactly one section, one customer email, a subject,
  a status, a source, and timestamps.
- Approved thread statuses SHALL be: `needs_reply`, `waiting_on_customer`,
  `resolved`, `archived`.
- WHEN a new inbound message arrives on a `resolved` thread, THEN the
  thread SHALL reopen to `needs_reply`.
- WHEN an admin sends a reply, THEN the thread SHALL become
  `waiting_on_customer`.
- WHEN the customer replies again, THEN the thread SHALL become
  `needs_reply`.
- Admin SHALL be able to resolve, archive, and assign threads.
- Threads SHALL be filterable by section and status in the admin.
- Threads SHALL be readable and writable by admins only (RLS).

## 4. Messages

- A message SHALL have a direction (`inbound` | `outbound`), sender email,
  recipient email, subject, text content, status, and timestamps.
- Inbound messages SHALL store `provider_message_id`, `in_reply_to`,
  `references`, raw headers, and attachment metadata.
- Outbound messages SHALL store the provider message id returned by Resend,
  or a failure error.
- Approved message statuses SHALL be: `received`, `sent`, `failed`.
- Messages SHALL be unique per `provider_message_id` (partial unique index).
- Messages SHALL never be publicly readable (RLS admin-only).

## 5. Admin Reply

- WHEN an admin submits a reply in the thread detail, THEN the system SHALL:
  - validate the body (required, max 10,000 characters) and thread id;
  - resolve the thread's customer email and last inbound `message_id`;
  - send via Resend with `from` = the section's configured from address,
    `subject` prefixed `Re: `, `In-Reply-To` = last inbound `message_id`,
    and `References` accumulated from the thread;
  - store the outbound message (status `sent` on success, `failed`
    otherwise);
  - set the thread to `waiting_on_customer`.
- WHEN Resend is not configured, THEN the action SHALL return a friendly
  error and SHALL NOT mark the message as sent.
- Admin reply SHALL be an authenticated server action, admin-only, and SHALL
  NOT allow arbitrary recipients (the recipient is always the thread's
  customer email).

## 6. Form-created Threads

- WHEN a contact or acquisition form submission succeeds, THEN the system
  SHALL create a thread in the section mapped to the form's source key with
  source = form key, subject = the message excerpt (or a stable label),
  and status `needs_reply`.
- WHEN a form submission's email already has an open thread in the same
  section, THEN the system SHALL append a message to the existing thread
  instead of creating a duplicate.
- Form-created threads SHALL NOT trigger the section auto-reply (the form
  already shows an acknowledgement); auto-reply applies to inbound email
  only.
- The lead creation flow SHALL remain unchanged and SHALL NOT fail when
  thread creation fails.

## 7. Admin UI

- The inbox SHALL show section tabs with unread/needs-reply counts, a
  thread list (customer, subject, last message, time, status), and status
  filters.
- The thread detail SHALL show the full message history (inbound and
  outbound), customer info, section badge, status controls (resolve,
  archive, assign), and a reply editor.
- The sections manager SHALL allow editing name translations, enabled,
  routing addresses, form-source mapping, display order, and the
  auto-reply toggle + subject/body translations.
- All admin pages SHALL be keyboard-navigable, focus-visible, and
  accessible per existing CMS rules.

## 8. Security

- RLS SHALL be enabled on all new tables; only admins (`is_admin()`) read
  or write; the inbound webhook SHALL use the service-role client.
- The webhook SHALL verify signatures before any processing.
- No anon policies SHALL exist on threads, messages, or sections' private
  fields (names/addresses are admin-only).
- No secrets SHALL be stored in database content.
- Rate limiting SHALL apply to admin reply actions and to inbound
  processing where feasible.

## 9. Verification Scenarios

- WHEN a test email is sent to a routing address of an enabled section,
  THEN a new thread with the inbound message appears in that section, an
  auto-reply is sent if enabled, and re-delivering the same webhook does
  not duplicate the message.
- WHEN the admin replies, THEN the customer receives an email with the
  thread subject and the thread becomes `waiting_on_customer`.
- WHEN the customer replies, THEN the message joins the same thread and the
  thread becomes `needs_reply`.
- WHEN a contact form is submitted, THEN a lead and a thread in the
  `contact` section are created.
- WHEN an unauthenticated request hits the admin inbox pages, THEN access
  is denied.
- WHEN an invalid webhook signature is presented, THEN the route returns
  `401`.
