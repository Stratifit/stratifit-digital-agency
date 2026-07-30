-- ============================================================================
-- Stratifit Digital Agency — Pricing Section Tables
-- Migration: 20260802_007_pricing_section
-- Description: Dedicated tables for the CMS-driven multilingual pricing section.
-- ============================================================================

-- ============================================================================
-- 1. PRICING SECTION
-- ============================================================================
create table if not exists pricing_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_pricing_section_display_order on pricing_section (display_order);

-- ============================================================================
-- 2. PRICING PACKAGES
-- ============================================================================
create table if not exists pricing_packages (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references pricing_section(id) on delete cascade,
    name_translations        jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    price                    text not null default '',
    price_label_translations jsonb not null default '{}'::jsonb,
    is_popular               boolean not null default false,
    button_label_translations jsonb not null default '{}'::jsonb,
    button_action            text not null default '',
    features                 jsonb not null default '[]'::jsonb,
    display_order            integer not null default 0,
    active                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_pricing_packages_parent_section on pricing_packages (parent_section);
create index if not exists idx_pricing_packages_display_order on pricing_packages (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_pricing_section_updated_at on pricing_section;
create trigger set_pricing_section_updated_at
    before update on pricing_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_pricing_packages_updated_at on pricing_packages;
create trigger set_pricing_packages_updated_at
    before update on pricing_packages
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table pricing_section enable row level security;
alter table pricing_packages enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read pricing_section" on pricing_section;
create policy "Public can read pricing_section"
    on pricing_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read pricing_packages" on pricing_packages;
create policy "Public can read pricing_packages"
    on pricing_packages
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert pricing_section" on pricing_section;
create policy "Admins can insert pricing_section"
    on pricing_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update pricing_section" on pricing_section;
create policy "Admins can update pricing_section"
    on pricing_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete pricing_section" on pricing_section;
create policy "Admins can delete pricing_section"
    on pricing_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert pricing_packages" on pricing_packages;
create policy "Admins can insert pricing_packages"
    on pricing_packages
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update pricing_packages" on pricing_packages;
create policy "Admins can update pricing_packages"
    on pricing_packages
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete pricing_packages" on pricing_packages;
create policy "Admins can delete pricing_packages"
    on pricing_packages
    for delete
    to authenticated
    using (public.is_admin());
