-- ============================================================================
-- Stratifit Digital Agency — How We Work Section Tables
-- Migration: 20260801_001_how_we_work_section
-- Description: Dedicated tables for the CMS-driven multilingual How We Work section.
-- ============================================================================

-- ============================================================================
-- 1. HOW WE WORK SECTION
-- ============================================================================
create table if not exists how_we_work_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_how_we_work_section_display_order on how_we_work_section (display_order);

-- ============================================================================
-- 2. HOW WE WORK STEPS
-- ============================================================================
create table if not exists how_we_work_steps (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references how_we_work_section(id) on delete cascade,
    step_number              integer not null default 1,
    icon                     text not null default '',
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    display_order            integer not null default 0,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_how_we_work_steps_parent_section on how_we_work_steps (parent_section);
create index if not exists idx_how_we_work_steps_display_order on how_we_work_steps (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_how_we_work_section_updated_at on how_we_work_section;
create trigger set_how_we_work_section_updated_at
    before update on how_we_work_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_how_we_work_steps_updated_at on how_we_work_steps;
create trigger set_how_we_work_steps_updated_at
    before update on how_we_work_steps
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table how_we_work_section enable row level security;
alter table how_we_work_steps enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read how_we_work_section" on how_we_work_section;
create policy "Public can read how_we_work_section"
    on how_we_work_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read how_we_work_steps" on how_we_work_steps;
create policy "Public can read how_we_work_steps"
    on how_we_work_steps
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert how_we_work_section" on how_we_work_section;
create policy "Admins can insert how_we_work_section"
    on how_we_work_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update how_we_work_section" on how_we_work_section;
create policy "Admins can update how_we_work_section"
    on how_we_work_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete how_we_work_section" on how_we_work_section;
create policy "Admins can delete how_we_work_section"
    on how_we_work_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert how_we_work_steps" on how_we_work_steps;
create policy "Admins can insert how_we_work_steps"
    on how_we_work_steps
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update how_we_work_steps" on how_we_work_steps;
create policy "Admins can update how_we_work_steps"
    on how_we_work_steps
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete how_we_work_steps" on how_we_work_steps;
create policy "Admins can delete how_we_work_steps"
    on how_we_work_steps
    for delete
    to authenticated
    using (public.is_admin());
