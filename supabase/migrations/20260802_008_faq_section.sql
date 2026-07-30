-- ============================================================================
-- Stratifit Digital Agency — FAQ Section Tables
-- Migration: 20260802_008_faq_section
-- Description: Dedicated tables for the CMS-driven multilingual FAQ section.
-- ============================================================================

-- ============================================================================
-- 1. FAQ SECTION
-- ============================================================================
create table if not exists faq_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_faq_section_display_order on faq_section (display_order);

-- ============================================================================
-- 2. FAQ ITEMS
-- ============================================================================
create table if not exists faq_items (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references faq_section(id) on delete cascade,
    question_translations    jsonb not null default '{}'::jsonb,
    answer_translations      jsonb not null default '{}'::jsonb,
    display_order            integer not null default 0,
    active                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_faq_items_parent_section on faq_items (parent_section);
create index if not exists idx_faq_items_display_order on faq_items (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_faq_section_updated_at on faq_section;
create trigger set_faq_section_updated_at
    before update on faq_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_faq_items_updated_at on faq_items;
create trigger set_faq_items_updated_at
    before update on faq_items
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table faq_section enable row level security;
alter table faq_items enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read faq_section" on faq_section;
create policy "Public can read faq_section"
    on faq_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read faq_items" on faq_items;
create policy "Public can read faq_items"
    on faq_items
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert faq_section" on faq_section;
create policy "Admins can insert faq_section"
    on faq_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update faq_section" on faq_section;
create policy "Admins can update faq_section"
    on faq_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete faq_section" on faq_section;
create policy "Admins can delete faq_section"
    on faq_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert faq_items" on faq_items;
create policy "Admins can insert faq_items"
    on faq_items
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update faq_items" on faq_items;
create policy "Admins can update faq_items"
    on faq_items
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete faq_items" on faq_items;
create policy "Admins can delete faq_items"
    on faq_items
    for delete
    to authenticated
    using (public.is_admin());
