-- ============================================================================
-- Stratifit Digital Agency — Services Section Tables
-- Migration: 20260731_003_services_section
-- Description: Dedicated tables for the CMS-driven multilingual services section.
-- ============================================================================

-- ============================================================================
-- 1. SERVICES SECTION
-- ============================================================================
create table if not exists services_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    services                 jsonb not null default '[]'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_services_section_display_order on services_section (display_order);

-- ============================================================================
-- 2. SERVICE CARDS
-- ============================================================================
create table if not exists service_cards (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references services_section(id) on delete cascade,
    icon                     text not null default '',
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    deliverables             jsonb not null default '[]'::jsonb,
    url                      text not null default '',
    display_order            integer not null default 0,
    active                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_service_cards_parent_section on service_cards (parent_section);
create index if not exists idx_service_cards_display_order on service_cards (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_services_section_updated_at on services_section;
create trigger set_services_section_updated_at
    before update on services_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_service_cards_updated_at on service_cards;
create trigger set_service_cards_updated_at
    before update on service_cards
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table services_section enable row level security;
alter table service_cards enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read services_section" on services_section;
create policy "Public can read services_section"
    on services_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read service_cards" on service_cards;
create policy "Public can read service_cards"
    on service_cards
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert services_section" on services_section;
create policy "Admins can insert services_section"
    on services_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update services_section" on services_section;
create policy "Admins can update services_section"
    on services_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete services_section" on services_section;
create policy "Admins can delete services_section"
    on services_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert service_cards" on service_cards;
create policy "Admins can insert service_cards"
    on service_cards
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update service_cards" on service_cards;
create policy "Admins can update service_cards"
    on service_cards
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete service_cards" on service_cards;
create policy "Admins can delete service_cards"
    on service_cards
    for delete
    to authenticated
    using (public.is_admin());
