-- ============================================================================
-- Stratifit Digital Agency — Testimonials Section Tables
-- Migration: 20260802_006_testimonials_section
-- Description: Dedicated tables for the CMS-driven multilingual testimonials section.
-- ============================================================================

-- ============================================================================
-- 1. TESTIMONIALS SECTION
-- ============================================================================
create table if not exists testimonials_section (
    id                       uuid primary key default gen_random_uuid(),
    display_order            integer not null default 0,
    subtitle_translations    jsonb not null default '{}'::jsonb,
    title_translations       jsonb not null default '{}'::jsonb,
    description_translations jsonb not null default '{}'::jsonb,
    view_all_url             text not null default '',
    view_all_label_translations jsonb not null default '{}'::jsonb,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_testimonials_section_display_order on testimonials_section (display_order);

-- ============================================================================
-- 2. TESTIMONIAL CARDS
-- ============================================================================
create table if not exists testimonial_cards (
    id                       uuid primary key default gen_random_uuid(),
    parent_section           uuid not null references testimonials_section(id) on delete cascade,
    initials                 text not null default '',
    name_translations        jsonb not null default '{}'::jsonb,
    role_translations        jsonb not null default '{}'::jsonb,
    quote_translations       jsonb not null default '{}'::jsonb,
    rating                   integer not null default 5,
    display_order            integer not null default 0,
    active                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

create index if not exists idx_testimonial_cards_parent_section on testimonial_cards (parent_section);
create index if not exists idx_testimonial_cards_display_order on testimonial_cards (display_order);

-- ============================================================================
-- 3. AUTO-UPDATE TRIGGERS
-- ============================================================================
drop trigger if exists set_testimonials_section_updated_at on testimonials_section;
create trigger set_testimonials_section_updated_at
    before update on testimonials_section
    for each row execute function public.update_updated_at_column();

drop trigger if exists set_testimonial_cards_updated_at on testimonial_cards;
create trigger set_testimonial_cards_updated_at
    before update on testimonial_cards
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================
alter table testimonials_section enable row level security;
alter table testimonial_cards enable row level security;

-- Public read access
-- --------------------------------------------------------------------------
drop policy if exists "Public can read testimonials_section" on testimonials_section;
create policy "Public can read testimonials_section"
    on testimonials_section
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Public can read testimonial_cards" on testimonial_cards;
create policy "Public can read testimonial_cards"
    on testimonial_cards
    for select
    to anon, authenticated
    using (true);

-- Admin write access
-- --------------------------------------------------------------------------
drop policy if exists "Admins can insert testimonials_section" on testimonials_section;
create policy "Admins can insert testimonials_section"
    on testimonials_section
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update testimonials_section" on testimonials_section;
create policy "Admins can update testimonials_section"
    on testimonials_section
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete testimonials_section" on testimonials_section;
create policy "Admins can delete testimonials_section"
    on testimonials_section
    for delete
    to authenticated
    using (public.is_admin());

drop policy if exists "Admins can insert testimonial_cards" on testimonial_cards;
create policy "Admins can insert testimonial_cards"
    on testimonial_cards
    for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can update testimonial_cards" on testimonial_cards;
create policy "Admins can update testimonial_cards"
    on testimonial_cards
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete testimonial_cards" on testimonial_cards;
create policy "Admins can delete testimonial_cards"
    on testimonial_cards
    for delete
    to authenticated
    using (public.is_admin());
