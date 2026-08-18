# Design — Email Template Library & Automatic Sends

## Context

The Email Inbox (archived `2026-08-18-email-inbox`) persists threads and
messages, auto-replies per section from two inline translation fields, and
sends a hardcoded English contact acknowledgement after form leads. This
change introduces a CMS-managed multilingual template library and makes the
automatic sends language-matched and template-driven.

## Goals

- One place (the email section in the CMS) to design every customer email.
- Auto-replies and the contact acknowledgement read from templates.
- Automatic send when a conversation is finished (resolved) per section.
- The customer always receives emails in their language (en/de/fr/es),
  falling back to English.

## Non-Goals

- Timed/cron scheduling (trigger field reserved; lifecycle events only).
- Billing systems (payment/invoice templates are drafts).
- Bulk/marketing sends.
- Rich HTML templates (body renders as paragraphs in the branded shell).

## Architecture

```
/ admin/email/templates  (library: category dropdown + multilingual editor)
        │ create/update/delete (admin-guarded server actions)
        ▼
   email_templates (key, category, name/subject/body translations,
                    trigger_event, enabled, display_order)
        ▲                                  │ selected by section
        │                                  ▼
   email_inbox_sections.auto_reply_template_id / resolved_template_id
        │                                  │
        │ on inbound email                 │ on admin resolve
        ▼                                  ▼
   inbound.ts (language detection)    mutations.resolveEmailThread
        │                                  │
        └─────────── renderTemplate(template, language, vars) ─────────┘
                              │
                              ▼
                   sendEmail("email_inbox_template", {subject, body},
                             threading headers, idempotency)
```

### Rendering

`renderTemplate(template, language, vars)`:
- picks `subject_translations[language]` / `body_translations[language]`,
  falling back to `en`;
- replaces `{{key}}` placeholders from `vars` (unknown → empty string).

The new template key `email_inbox_template` renders `{subject, body}` with
no greeting prepend (the template body is the complete email), inside the
existing branded shell.

### Language detection (inbound email)

1. `Content-Language` header when present and in the supported set.
2. Lightweight stop-word heuristic over subject + first text lines
   (fr: bonjour/merci/veuillez/…, de: hallo/danke/bitte/…,
   es: hola/gracias/por favor/…), taking the language with the most hits.
3. Default `en`.

The thread stores the resulting language; form threads store
`preferred_locale`. All automatic sends use it.

### Table changes

```sql
create table public.email_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  category text not null default 'custom',
  name_translations jsonb not null default '{}'::jsonb,
  subject_translations jsonb not null default '{}'::jsonb,
  body_translations jsonb not null default '{}'::jsonb,
  description text,
  trigger_event text, -- null (manual) | 'on_lead' | 'on_inbound_email' | 'on_thread_resolved'
  is_enabled boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.email_inbox_sections
  add column auto_reply_template_id uuid references public.email_templates(id) on delete set null,
  add column resolved_template_id uuid references public.email_templates(id) on delete set null,
  add column resolved_email_enabled boolean not null default false;

alter table public.email_threads
  add column language text not null default 'en'
    check (language in ('en','de','fr','es'));
```

RLS: admins manage `email_templates` (ALL via `is_admin()`); no anon
policies. Inbound webhook reads templates via the service-role client.

### Backward compatibility

- Sections without a selected template keep the existing inline
  auto-reply subject/body fields (English at send time, as today).
- Lead flow without a mapped template keeps the hardcoded
  `contact_acknowledgement`.

## Key Decisions

1. **Templates live on sections via FK, not a separate mapping table** —
   one dropdown per section, matches "dropdown section for each section".
2. **`on_thread_resolved` email is opt-in per section**
   (`resolved_email_enabled`) — resolving a conversation is a common action;
   surprise emails are worse than no emails. Templates are seeded disabled.
3. **Trigger stored but V1 fires lifecycle events only** — no cron; the
   field is the seam where scheduling can hook in later.
4. **Language detection heuristic** — no external service; Content-Language
   + stop-word scoring is deterministic and testable. Documented as
   best-effort with English fallback.

## Security

- `email_templates` is admin-only RLS; service-role only in the webhook.
- Recipient is always the thread's customer email.
- Idempotency keys: `email_inbox_template:{thread_id}:{message_id}` for
  auto-replies, `email_inbox_template:resolved:{thread_id}` for resolved
  sends, `email_inbox_template:lead:{lead_id}` for form acknowledgements.
- Sends never fail their originating operation.

## Migration Plan

1. Write `00061_email_templates.sql` (table, columns, RLS, seed templates +
   section links).
2. Update `supabase/seed.sql`; `supabase db push`; regenerate types.
3. Implement rendering + language detection, rewire inbound/forms/resolve.
4. Admin UI: `/admin/email/templates` + editor, sections editor dropdowns,
   nav.
5. Lint, typecheck, tests, build; docs; archive change.
