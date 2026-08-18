# Tasks — Email Template Library & Automatic Sends

## 1. Database

- [x] Write `supabase/migrations/00061_email_templates.sql`:
      `email_templates` table + RLS (admin ALL), section columns
      (`auto_reply_template_id`, `resolved_template_id`,
      `resolved_email_enabled`), thread `language` column, updated-at
      trigger, indexes.
- [x] Seed templates (contact/branding/web/AI/acquisition/support
      auto-replies, project kickoff, project complete, follow-up, payment
      reminder, invoice ready — en/de/fr/es subject+body) and link sections.
- [x] Update `supabase/seed.sql`; apply `supabase db push --linked --yes`.
- [x] Regenerate types into `src/types/database.types.ts`.

## 2. Feature module

- [x] `src/features/email-inbox/template-schemas.ts` — template input schema
      (key, category, translations, trigger, enabled, order).
- [x] `src/features/email-inbox/template-queries.ts` — admin list + single
      template; template render helper (language + placeholders).
- [x] `src/features/email-inbox/template-mutations.ts` — create/update/delete
      (admin-guarded, validated, audit-logged).
- [x] `src/features/email-inbox/language.ts` — inbound language detection
      (Content-Language + stop-word heuristic, default en).
- [x] `src/features/email/templates.ts` + `send.ts` — add
      `email_inbox_template` key (subject/body, no greeting prepend).

## 3. Automatic sends

- [x] `inbound.ts` — store detected language on the thread; send the
      section's `auto_reply_template_id` (enabled + `on_inbound_email`) in
      the thread language with threading headers + idempotency.
- [x] `forms.ts` + lead flow — set thread language from `preferred_locale`;
      send the mapped section's `on_lead` template as the acknowledgement in
      the visitor's language (fallback: current hardcoded
      `contact_acknowledgement`).
- [x] `mutations.ts` — on resolve, when section `resolved_email_enabled`,
      send `resolved_template_id` in the thread language (never fail the
      resolve).
- [x] Regression tests for rendering, language detection, and template
      schema.

## 4. Admin UI

- [x] `/admin/email/templates/page.tsx` — library with category dropdown
      filter, template cards, add/edit forms (LocaleTabs for 4 languages),
      enable toggle, trigger select.
- [x] Sections editor — auto-reply template dropdown + resolved-email
      toggle/dropdown (template options from the library).
- [x] Nav entry "Email Templates" under Communication.

## 5. Verification & docs

- [x] `npx tsc --noEmit`, `npm run lint`, `npm run test`, `npm run build`.
- [x] Live checks: template save persists; language detection unit-tested;
      lead acknowledgement uses the template in the visitor's locale.
- [x] Update `docs/EMAIL_SYSTEM.md` + `docs/ROADMAP.md`; archive change.
