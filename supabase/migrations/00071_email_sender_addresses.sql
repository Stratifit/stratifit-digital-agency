-- Email sender addresses (reply-as / send-from addresses).
--
-- Admins manage the addresses that appear in the "Reply as" picker on the
-- Send Email page and in the inbox reply composer. Previously the list came
-- only from the COMMUNICATION_REPLY_AS env var; the table is the source of
-- truth now (env still acts as a fallback when the table is empty).

create table public.email_sender_addresses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  label text,
  is_enabled boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_sender_addresses_email_unique unique (email)
);

comment on table public.email_sender_addresses is
  'Admin-managed send-from / reply-as email addresses for the Communication Engine.';

create trigger set_email_sender_addresses_updated_at
  before update on public.email_sender_addresses
  for each row execute function public.set_updated_at();

-- Only one default address at a time.
create unique index email_sender_addresses_single_default
  on public.email_sender_addresses ((true))
  where is_default;

-- Admin-only access (same helper used by the other admin-managed tables).
alter table public.email_sender_addresses enable row level security;

create policy "admins can manage email_sender_addresses"
  on public.email_sender_addresses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Seed the standard Stratifit mailbox addresses (all @stratifit.com are
-- valid senders once the domain identity is verified in SES).
insert into public.email_sender_addresses (email, label, is_enabled, is_default) values
  ('contact@stratifit.com', 'General', true, true),
  ('hello@stratifit.com', 'General', true, false),
  ('info@stratifit.com', 'Information', true, false),
  ('sales@stratifit.com', 'Sales', true, false),
  ('support@stratifit.com', 'Support', true, false)
on conflict (email) do nothing;
