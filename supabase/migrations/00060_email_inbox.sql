-- Migration: 00060_email_inbox
-- Description: Email Inbox — sections, threads, and messages for the
--   Resend inbound email conversation system (design: openspec/changes/
--   2026-08-18-email-inbox). Admin-only data; the inbound webhook writes
--   through the service-role client.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Email Inbox Sections
-- =============================================================================

create table public.email_inbox_sections (
  id                              uuid primary key default gen_random_uuid(),
  slug                            text not null unique,
  name_translations               jsonb not null default '{}'::jsonb,
  enabled                         boolean not null default true,
  routing_addresses               text[] not null default '{}'::text[],
  form_source_key                 text,
  from_address                    text,
  auto_reply_enabled              boolean not null default false,
  auto_reply_subject_translations jsonb not null default '{}'::jsonb,
  auto_reply_body_translations    jsonb not null default '{}'::jsonb,
  display_order                   integer not null default 0,
  created_at                      timestamptz not null default now(),
  updated_at                      timestamptz not null default now(),
  constraint email_inbox_sections_form_source_key_unique unique (form_source_key)
);

comment on table public.email_inbox_sections is
  'Admin-managed email inbox categories with routing addresses and auto-reply.';

create trigger set_email_inbox_sections_updated_at
  before update on public.email_inbox_sections
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Email Threads
-- =============================================================================

create table public.email_threads (
  id               uuid primary key default gen_random_uuid(),
  section_id       uuid not null references public.email_inbox_sections(id) on delete restrict,
  customer_email   text not null,
  customer_name    text,
  subject          text not null,
  status           text not null default 'needs_reply'
                   check (status in ('needs_reply', 'waiting_on_customer', 'resolved', 'archived')),
  source           text not null default 'inbound_email'
                   check (source in ('inbound_email', 'contact_form', 'acquisition_form', 'manual')),
  lead_id          uuid references public.leads(id) on delete set null,
  assigned_to      uuid references auth.users(id) on delete set null,
  last_inbound_at  timestamptz,
  last_outbound_at timestamptz,
  last_message_at  timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.email_threads is
  'One email conversation with a customer, grouped under a section.';

create trigger set_email_threads_updated_at
  before update on public.email_threads
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Email Messages
-- =============================================================================

create table public.email_messages (
  id                  uuid primary key default gen_random_uuid(),
  thread_id           uuid not null references public.email_threads(id) on delete cascade,
  direction           text not null check (direction in ('inbound', 'outbound')),
  from_email          text not null,
  to_email            text not null,
  subject             text not null,
  text_content        text not null,
  html_content        text,
  provider_message_id text,
  in_reply_to         text,
  "references"       text,
  headers             jsonb not null default '{}'::jsonb,
  attachments         jsonb not null default '[]'::jsonb,
  status              text not null check (status in ('received', 'sent', 'failed')),
  error_message       text,
  sent_at             timestamptz,
  created_at          timestamptz not null default now()
);

comment on table public.email_messages is
  'Individual inbound or outbound email messages within a thread.';

-- =============================================================================
-- Indexes
-- =============================================================================

create unique index email_messages_provider_message_id_key
  on public.email_messages (provider_message_id)
  where provider_message_id is not null;

create index email_threads_section_status_idx
  on public.email_threads (section_id, status, last_message_at desc);

create index email_threads_customer_email_idx
  on public.email_threads (customer_email);

create index email_messages_thread_created_idx
  on public.email_messages (thread_id, created_at);

-- =============================================================================
-- Row Level Security (admin-only; webhook writes via service-role)
-- =============================================================================

alter table public.email_inbox_sections enable row level security;
alter table public.email_threads enable row level security;
alter table public.email_messages enable row level security;

create policy "admins can manage email_inbox_sections"
  on public.email_inbox_sections for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can manage email_threads"
  on public.email_threads for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can manage email_messages"
  on public.email_messages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- Seed: default sections
-- =============================================================================

insert into public.email_inbox_sections (slug, name_translations, enabled, routing_addresses, form_source_key, from_address, display_order)
values
  ('contact',
   '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb,
   true,
   '{"contact@stratifit.com", "hello@stratifit.com"}'::text[],
   'contact_form',
   'hello@stratifit.com',
   1),
  ('brand-design',
   '{"en": "Brand Design", "de": "Markengestaltung", "fr": "Design de marque", "es": "Diseño de marca"}'::jsonb,
   true,
   '{"branding@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   2),
  ('website-development',
   '{"en": "Website Development", "de": "Webentwicklung", "fr": "Développement web", "es": "Desarrollo web"}'::jsonb,
   true,
   '{"web@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   3),
  ('ai-automation',
   '{"en": "AI & Automation", "de": "KI & Automatisierung", "fr": "IA & Automatisation", "es": "IA y automatización"}'::jsonb,
   true,
   '{"ai@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   4),
  ('acquisition',
   '{"en": "Acquisition", "de": "Unternehmenskauf", "fr": "Acquisition", "es": "Adquisición"}'::jsonb,
   true,
   '{"acquisition@stratifit.com"}'::text[],
   'acquisition_form',
   'hello@stratifit.com',
   5),
  ('support',
   '{"en": "Support", "de": "Support", "fr": "Support", "es": "Soporte"}'::jsonb,
   true,
   '{"support@stratifit.com"}'::text[],
   null,
   'hello@stratifit.com',
   6),
  ('other',
   '{"en": "Other", "de": "Sonstiges", "fr": "Autre", "es": "Otro"}'::jsonb,
   true,
   '{}'::text[],
   null,
   'hello@stratifit.com',
   99)
on conflict (slug) do nothing;

-- Rollback:
-- DROP POLICY IF EXISTS "admins can manage email_messages" ON public.email_messages;
-- DROP POLICY IF EXISTS "admins can manage email_threads" ON public.email_threads;
-- DROP POLICY IF EXISTS "admins can manage email_inbox_sections" ON public.email_inbox_sections;
-- DROP TABLE IF EXISTS public.email_messages;
-- DROP TABLE IF EXISTS public.email_threads;
-- DROP TABLE IF EXISTS public.email_inbox_sections;
