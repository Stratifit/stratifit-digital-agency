-- ============================================================================
-- Stratifit — Navigation Header Section
-- Migration: 20260730_002_navigation_header
-- Description: CMS-driven multilingual navigation header (content + translations).
-- ============================================================================

create table if not exists section_navigation_header (
    id              uuid primary key default gen_random_uuid(),
    display_order   integer not null default 0,
    sticky          boolean not null default false,
    content         jsonb not null default '{}'::jsonb,
    translations    jsonb not null default '{}'::jsonb,
    url             text not null default '',
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index if not exists idx_section_navigation_header_display_order
    on section_navigation_header (display_order);

-- updated_at trigger
-- (reusing the existing update_updated_at_column function from the initial migration)

create trigger set_section_navigation_header_updated_at
    before update on section_navigation_header
    for each row execute function public.update_updated_at_column();

-- RLS
alter table section_navigation_header enable row level security;

create policy "Navigation header is publicly readable"
    on section_navigation_header for select using (true);

create policy "Admins can insert navigation header"
    on section_navigation_header for insert with check (public.is_admin());

create policy "Admins can update navigation header"
    on section_navigation_header for update using (public.is_admin());

create policy "Admins can delete navigation header"
    on section_navigation_header for delete using (public.is_admin());
