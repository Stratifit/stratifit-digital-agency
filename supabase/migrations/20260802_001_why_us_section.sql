-- ============================================================================
-- Stratifit Digital Agency — Why Us Section Tables
-- Migration: 20260802_001_why_us_section
-- Description: Dedicated tables for the CMS-driven multilingual Why Us section.
-- ============================================================================

-- ============================================================================
-- 1. WHY US SECTION
-- ============================================================================
create table if not exists why_us_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_why_us_section_display_order on why_us_section (display_order);

-- ============================================================================
-- 2. WHY US FEATURES
-- ============================================================================
create table if not exists why_us_features (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references why_us_section(id) on delete cascade,
    icon                     text not null default '',
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    stat                     text not null default '',
    stat_label_translations  jsonb not null default '{}'::jsonb,
    display_order            integer not null default 0,
    active                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_why_us_features_parent_section on why_us_features (parent_section);
create index if not exists idx_why_us_features_display_order on why_us_features (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_why_us_section_updated_at on why_us_section;
create trigger set_why_us_section_updated_at
    before update on why_us_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_why_us_features_updated_at on why_us_features;
create trigger set_why_us_features_updated_at
    before update on why_us_features
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table why_us_section enable row level security;
alter table why_us_features enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read why_us_section" on why_us_section;
create policy "Public can read why_us_section"
    on why_us_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read why_us_features" on why_us_features;
create policy "Public can read why_us_features"
    on why_us_features
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert why_us_section" on why_us_section;
create policy "Admins can insert why_us_section"
    on why_us_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update why_us_section" on why_us_section;
create policy "Admins can update why_us_section"
    on why_us_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete why_us_section" on why_us_section;
create policy "Admins can delete why_us_section"
    on why_us_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert why_us_features" on why_us_features;
create policy "Admins can insert why_us_features"
    on why_us_features
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update why_us_features" on why_us_features;
create policy "Admins can update why_us_features"
    on why_us_features
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete why_us_features" on why_us_features;
create policy "Admins can delete why_us_features"
    on why_us_features
    for delete
    to authenticated
    using (public.is_admin());
