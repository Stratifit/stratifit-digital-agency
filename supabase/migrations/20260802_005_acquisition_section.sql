-- ============================================================================
-- Stratifit Digital Agency — Acquisition / Buy a Business Section Tables
-- Migration: 20260802_005_acquisition_section
-- Description: Dedicated tables for the CMS-driven multilingual acquisition section.
-- ============================================================================

-- ============================================================================
-- 1. ACQUISITION SECTION
-- ============================================================================
create table if not exists acquisition_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    view_all_url             text not null default '',
    view_all_label_translations jsonb not null default '{}'::jsonb,
    view_detail_label_translations jsonb not null default '{}'::jsonb,
    visit_site_label_translations jsonb not null default '{}'::jsonb,
    buy_business_label_translations jsonb not null default '{}'::jsonb,
    filters                  jsonb not null default '[]'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_acquisition_section_display_order on acquisition_section (display_order);

-- ============================================================================
-- 2. ACQUISITION CARDS
-- ============================================================================
create table if not exists acquisition_cards (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references acquisition_section(id) on delete cascade,
    url                      text not null default '',
    category                 text not null default '',
    category_color           text not null default '',
    category_border_radius   text not null default '',
    nav_emoji                text not null default '',
    nav_title                text not null default '',
    bg_image_url             text not null default '',
    overlay_color            text not null default '',
    icon_radius              text not null default '',
    icon_border              text not null default '',
    icon_shadow              text not null default '',
    main_emoji               text not null default '',
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    tags                     jsonb not null default '[]'::jsonb,
    grid_emojis              jsonb not null default '[]'::jsonb,
    button_text_translations jsonb not null default '{}'::jsonb,
    trust_badges             jsonb not null default '[]'::jsonb,
    price                    text not null default '',
    link_url                 text not null default '',
    visit_link_url           text not null default '',
    display_order            integer not null default 0,
    active                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_acquisition_cards_parent_section on acquisition_cards (parent_section);
create index if not exists idx_acquisition_cards_display_order on acquisition_cards (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_acquisition_section_updated_at on acquisition_section;
create trigger set_acquisition_section_updated_at
    before update on acquisition_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_acquisition_cards_updated_at on acquisition_cards;
create trigger set_acquisition_cards_updated_at
    before update on acquisition_cards
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table acquisition_section enable row level security;
alter table acquisition_cards enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read acquisition_section" on acquisition_section;
create policy "Public can read acquisition_section"
    on acquisition_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read acquisition_cards" on acquisition_cards;
create policy "Public can read acquisition_cards"
    on acquisition_cards
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert acquisition_section" on acquisition_section;
create policy "Admins can insert acquisition_section"
    on acquisition_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update acquisition_section" on acquisition_section;
create policy "Admins can update acquisition_section"
    on acquisition_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete acquisition_section" on acquisition_section;
create policy "Admins can delete acquisition_section"
    on acquisition_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert acquisition_cards" on acquisition_cards;
create policy "Admins can insert acquisition_cards"
    on acquisition_cards
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update acquisition_cards" on acquisition_cards;
create policy "Admins can update acquisition_cards"
    on acquisition_cards
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete acquisition_cards" on acquisition_cards;
create policy "Admins can delete acquisition_cards"
    on acquisition_cards
    for delete
    to authenticated
    using (public.is_admin());
