-- ============================================================================
-- Stratifit Digital Agency — Portfolio Section Tables
-- Migration: 20260802_004_portfolio_section
-- Description: Dedicated tables for the CMS-driven multilingual portfolio section.
-- ============================================================================

-- ============================================================================
-- 1. PORTFOLIO SECTION
-- ============================================================================
create table if not exists portfolio_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    view_all_url             text not null default '',
    view_all_label_translations jsonb not null default '{}'::jsonb,
    view_case_study_label_translations jsonb not null default '{}'::jsonb,
    filters                  jsonb not null default '[]'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_portfolio_section_display_order on portfolio_section (display_order);

-- ============================================================================
-- 2. PORTFOLIO ITEMS
-- ============================================================================
create table if not exists portfolio_items (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references portfolio_section(id) on delete cascade,
    image_url                text not null default '',
    category                 text not null default '',
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    link_url                 text not null default '',
    display_order            integer not null default 0,
    active                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_portfolio_items_parent_section on portfolio_items (parent_section);
create index if not exists idx_portfolio_items_display_order on portfolio_items (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_portfolio_section_updated_at on portfolio_section;
create trigger set_portfolio_section_updated_at
    before update on portfolio_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_portfolio_items_updated_at on portfolio_items;
create trigger set_portfolio_items_updated_at
    before update on portfolio_items
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table portfolio_section enable row level security;
alter table portfolio_items enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read portfolio_section" on portfolio_section;
create policy "Public can read portfolio_section"
    on portfolio_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read portfolio_items" on portfolio_items;
create policy "Public can read portfolio_items"
    on portfolio_items
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert portfolio_section" on portfolio_section;
create policy "Admins can insert portfolio_section"
    on portfolio_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update portfolio_section" on portfolio_section;
create policy "Admins can update portfolio_section"
    on portfolio_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete portfolio_section" on portfolio_section;
create policy "Admins can delete portfolio_section"
    on portfolio_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert portfolio_items" on portfolio_items;
create policy "Admins can insert portfolio_items"
    on portfolio_items
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update portfolio_items" on portfolio_items;
create policy "Admins can update portfolio_items"
    on portfolio_items
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete portfolio_items" on portfolio_items;
create policy "Admins can delete portfolio_items"
    on portfolio_items
    for delete
    to authenticated
    using (public.is_admin());
