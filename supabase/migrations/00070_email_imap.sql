-- Migration: 00070_email_imap
-- IMAP inbox (Zoho Mail) support on top of the email-inbox conversation tables:
--   1. Allow email_threads.source = 'imap'
--   2. email_attachments table for parsed IMAP attachments
--   3. Private storage bucket for attachment bytes
--   4. GIN index on email_messages.headers for message-id threading lookups

-- =============================================================================
-- 1. Thread source: allow 'imap'
-- =============================================================================

alter table public.email_threads
  drop constraint email_threads_source_check;

alter table public.email_threads
  add constraint email_threads_source_check
  check (source in ('inbound_email', 'contact_form', 'acquisition_form', 'manual', 'imap'));

-- =============================================================================
-- 2. Attachments table
-- =============================================================================

create table public.email_attachments (
  id             uuid primary key default gen_random_uuid(),
  message_id     uuid not null references public.email_messages(id) on delete cascade,
  name           text not null,
  mime_type      text,
  size_bytes     integer not null default 0,
  storage_bucket text not null,
  storage_path   text not null,
  content_id     text,
  width          integer,
  height         integer,
  created_at     timestamptz not null default now()
);

comment on table public.email_attachments is
  'Files attached to inbound email messages (from IMAP or webhook ingestion).';

create index email_attachments_message_id_idx
  on public.email_attachments (message_id);

alter table public.email_attachments enable row level security;

create policy "admins can manage email_attachments"
  on public.email_attachments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 3. Private storage bucket for attachment bytes
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('email-attachments', 'email-attachments', false)
on conflict (id) do nothing;

-- Admins read attachment bytes through the app (admin-authed download route),
-- never via public storage URLs.
create policy "admins can read email-attachments"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'email-attachments' and public.is_admin());

create policy "admins can write email-attachments"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'email-attachments' and public.is_admin());

-- Service-role writes bypass RLS (fetch worker uses the service-role client).

-- =============================================================================
-- 4. Index for message-id threading lookups (headers->>message_id)
-- =============================================================================

create index email_messages_headers_gin
  on public.email_messages using gin (headers jsonb_path_ops);

-- =============================================================================
-- Rollback
-- =============================================================================
-- DROP POLICY IF EXISTS "admins can write email-attachments" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can read email-attachments" ON storage.objects;
-- DELETE FROM storage.buckets WHERE id = 'email-attachments';
-- DROP TABLE IF EXISTS public.email_attachments;
-- ALTER TABLE public.email_threads DROP CONSTRAINT email_threads_source_check;
-- ALTER TABLE public.email_threads ADD CONSTRAINT email_threads_source_check
--   CHECK (source in ('inbound_email', 'contact_form', 'acquisition_form', 'manual'));
-- DROP INDEX IF EXISTS email_messages_headers_gin;
