-- ============================================================================
-- Stratifit Digital Agency — Hero Section Table
-- Migration: 20260731_001_hero_section
-- Description: Dedicated table for the CMS-driven multilingual hero section.
-- ============================================================================

-- 1. Hero Section Table
-- --------------------------------------------------------------------------
create table if not exists hero_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    sticky                    boolean not null default false,
    subtitle_translations     jsonb not null default '{}'::jsonb,
    title_translations        jsonb not null default '{}'::jsonb,
    title_highlight_translations jsonb not null default '{}'::jsonb,
    description_translations  jsonb not null default '{}'::jsonb,
    ctas                     jsonb not null default '[]'::jsonb,
    trust_badges             jsonb not null default '[]'::jsonb,
    tech_stack               jsonb not null default '{}'::jsonb,
    url                      text default '',
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

-- 2. Indexes
-- --------------------------------------------------------------------------
create index if not exists idx_hero_section_display_order on hero_section (display_order);

-- 3. Auto-update updated_at
-- --------------------------------------------------------------------------
create or replace function public.update_hero_section_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_hero_section_updated_at on hero_section;
create trigger set_hero_section_updated_at
    before update on hero_section
    for each row execute function public.update_hero_section_updated_at();

-- 4. Row Level Security (RLS)
-- --------------------------------------------------------------------------
alter table hero_section enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read hero_section" on hero_section;
create policy "Public can read hero_section"
    on hero_section
    for select
    to anon, authenticated
    using (true);

-- Only admins can write
-- --------------------------------------------------------------------------
drop policy if exists "Only admins can insert hero_section" on hero_section;
create policy "Only admins can insert hero_section"
    on hero_section
    for insert
    to authenticated
    with check (auth.uid() in (
        select user_id from profiles where role = 'admin'
    ));

drop policy if exists "Only admins can update hero_section" on hero_section;
create policy "Only admins can update hero_section"
    on hero_section
    for update
    to authenticated
    using (auth.uid() in (
        select user_id from profiles where role = 'admin'
    ))
    with check (auth.uid() in (
        select user_id from profiles where role = 'admin'
    ));

drop policy if exists "Only admins can delete hero_section" on hero_section;
create policy "Only admins can delete hero_section"
    on hero_section
    for delete
    to authenticated
    using (auth.uid() in (
        select user_id from profiles where role = 'admin'
    ));
