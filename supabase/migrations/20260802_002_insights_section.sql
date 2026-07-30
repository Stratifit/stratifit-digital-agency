-- ============================================================================
-- Stratifit Digital Agency — Insights Section Tables
-- Migration: 20260802_002_insights_section
-- Description: Dedicated tables for the CMS-driven multilingual insights section.
-- ============================================================================

-- ============================================================================
-- 1. INSIGHTS SECTION
-- ============================================================================
create table if not exists insights_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    view_all_url             text not null default '',
    view_all_label_translations jsonb not null default '{}'::jsonb,
    read_more_label_translations jsonb not null default '{}'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_insights_section_display_order on insights_section (display_order);

-- ============================================================================
-- 2. INSIGHT CARDS
-- ============================================================================
create table if not exists insight_cards (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references insights_section(id) on delete cascade,
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

create index if not exists idx_insight_cards_parent_section on insight_cards (parent_section);
create index if not exists idx_insight_cards_display_order on insight_cards (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_insights_section_updated_at on insights_section;
create trigger set_insights_section_updated_at
    before update on insights_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_insight_cards_updated_at on insight_cards;
create trigger set_insight_cards_updated_at
    before update on insight_cards
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table insights_section enable row level security;
alter table insight_cards enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read insights_section" on insights_section;
create policy "Public can read insights_section"
    on insights_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read insight_cards" on insight_cards;
create policy "Public can read insight_cards"
    on insight_cards
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert insights_section" on insights_section;
create policy "Admins can insert insights_section"
    on insights_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update insights_section" on insights_section;
create policy "Admins can update insights_section"
    on insights_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete insights_section" on insights_section;
create policy "Admins can delete insights_section"
    on insights_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert insight_cards" on insight_cards;
create policy "Admins can insert insight_cards"
    on insight_cards
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update insight_cards" on insight_cards;
create policy "Admins can update insight_cards"
    on insight_cards
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete insight_cards" on insight_cards;
create policy "Admins can delete insight_cards"
    on insight_cards
    for delete
    to authenticated
    using (public.is_admin());
