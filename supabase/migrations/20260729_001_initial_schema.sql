-- ============================================================================
-- Stratifit Digital Agency — Initial Schema
-- Migration: 20260729_001_initial_schema
-- Description: Core tables, indexes, RLS policies, and auth triggers.
-- ============================================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. PROFILES (extends Supabase Auth)
-- ============================================================================
create table if not exists profiles (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade unique,
    role        text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
    display_name text,
    avatar_url  text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (user_id, role, display_name)
    values (new.id, 'viewer', new.raw_user_meta_data ->> 'display_name');
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 2. PAGES
-- ============================================================================
create table if not exists pages (
    id              uuid primary key default gen_random_uuid(),
    slug            text not null,
    title           text not null,
    language        text not null check (language in ('en', 'fr', 'de', 'es')),
    meta_title      text,
    meta_description text,
    published       boolean not null default false,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    unique (slug, language)
);

create index idx_pages_slug on pages (slug);
create index idx_pages_language on pages (language);
create index idx_pages_published on pages (published) where published = true;

create trigger set_pages_updated_at
    before update on pages
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 3. SECTIONS
-- ============================================================================
create table if not exists sections (
    id              uuid primary key default gen_random_uuid(),
    page_id         uuid not null references pages(id) on delete cascade,
    component_type  text not null,
    display_order   integer not null default 0,
    payload         jsonb not null default '{}'::jsonb,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_sections_page_id on sections (page_id);
create index idx_sections_display_order on sections (display_order);
create index idx_sections_component_type on sections (component_type);

create trigger set_sections_updated_at
    before update on sections
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 4. CONTENT BLOCKS
-- ============================================================================
create table if not exists content_blocks (
    id              uuid primary key default gen_random_uuid(),
    section_id      uuid not null references sections(id) on delete cascade,
    block_type      text not null,
    display_order   integer not null default 0,
    payload         jsonb not null default '{}'::jsonb,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_content_blocks_section_id on content_blocks (section_id);
create index idx_content_blocks_display_order on content_blocks (display_order);

create trigger set_content_blocks_updated_at
    before update on content_blocks
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 5. MEDIA
-- ============================================================================
create table if not exists media (
    id          uuid primary key default gen_random_uuid(),
    filename    text not null,
    alt_text    text,
    url         text not null,
    mime_type   text,
    width       integer,
    height      integer,
    created_at  timestamptz not null default now()
);

create index idx_media_mime_type on media (mime_type);

-- ============================================================================
-- 6. TRANSLATIONS
-- ============================================================================
create table if not exists translations (
    id              uuid primary key default gen_random_uuid(),
    entity_type     text not null check (entity_type in ('page', 'section', 'content_block')),
    entity_id       uuid not null,
    language        text not null check (language in ('en', 'fr', 'de', 'es')),
    field_path      text not null,
    translated_text text not null,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    unique (entity_type, entity_id, language, field_path)
);

create index idx_translations_entity on translations (entity_type, entity_id);
create index idx_translations_language on translations (language);

create trigger set_translations_updated_at
    before update on translations
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 7. SETTINGS (structured, not key-value)
-- ============================================================================
create table if not exists settings (
    id                  uuid primary key default gen_random_uuid(),
    site_name           text not null,
    logo_media_id       uuid references media(id) on delete set null,
    primary_language    text not null default 'en' check (primary_language in ('en', 'fr', 'de', 'es')),
    available_languages text[] not null default '{en,fr,de,es}',
    social_links        jsonb not null default '{}'::jsonb,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

create trigger set_settings_updated_at
    before update on settings
    for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 8. AI LOGS (audit trail)
-- ============================================================================
create table if not exists ai_logs (
    id          uuid primary key default gen_random_uuid(),
    prompt      text not null,
    response    text not null,
    model       text not null,
    tokens_used integer,
    duration_ms integer,
    created_at  timestamptz not null default now()
);

create index idx_ai_logs_created_at on ai_logs (created_at desc);

-- ============================================================================
-- RLS — ENABLE ROW LEVEL SECURITY
-- ============================================================================
alter table profiles      enable row level security;
alter table pages         enable row level security;
alter table sections      enable row level security;
alter table content_blocks enable row level security;
alter table media         enable row level security;
alter table translations  enable row level security;
alter table settings      enable row level security;
alter table ai_logs       enable row level security;

-- ============================================================================
-- RLS — PUBLIC READ POLICIES
-- ============================================================================
create policy "Profiles are publicly readable"
    on profiles for select using (true);

create policy "Pages are publicly readable"
    on pages for select using (true);

create policy "Sections are publicly readable"
    on sections for select using (true);

create policy "Content blocks are publicly readable"
    on content_blocks for select using (true);

create policy "Media is publicly readable"
    on media for select using (true);

create policy "Translations are publicly readable"
    on translations for select using (true);

create policy "Settings are publicly readable"
    on settings for select using (true);

-- ============================================================================
-- RLS — ADMIN WRITE POLICIES
-- ============================================================================
-- Helper: returns true if the current user has an admin profile
create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1
        from public.profiles
        where user_id = auth.uid()
          and role = 'admin'
    );
end;
$$ language plpgsql stable security definer;

create policy "Admins can insert profiles"
    on profiles for insert with check (public.is_admin() or user_id = auth.uid());

create policy "Admins can update profiles"
    on profiles for update using (public.is_admin());

create policy "Admins can delete profiles"
    on profiles for delete using (public.is_admin());

create policy "Admins can insert pages"
    on pages for insert with check (public.is_admin());

create policy "Admins can update pages"
    on pages for update using (public.is_admin());

create policy "Admins can delete pages"
    on pages for delete using (public.is_admin());

create policy "Admins can insert sections"
    on sections for insert with check (public.is_admin());

create policy "Admins can update sections"
    on sections for update using (public.is_admin());

create policy "Admins can delete sections"
    on sections for delete using (public.is_admin());

create policy "Admins can insert content_blocks"
    on content_blocks for insert with check (public.is_admin());

create policy "Admins can update content_blocks"
    on content_blocks for update using (public.is_admin());

create policy "Admins can delete content_blocks"
    on content_blocks for delete using (public.is_admin());

create policy "Admins can insert media"
    on media for insert with check (public.is_admin());

create policy "Admins can update media"
    on media for update using (public.is_admin());

create policy "Admins can delete media"
    on media for delete using (public.is_admin());

create policy "Admins can insert translations"
    on translations for insert with check (public.is_admin());

create policy "Admins can update translations"
    on translations for update using (public.is_admin());

create policy "Admins can delete translations"
    on translations for delete using (public.is_admin());

create policy "Admins can insert settings"
    on settings for insert with check (public.is_admin());

create policy "Admins can update settings"
    on settings for update using (public.is_admin());

create policy "Admins can delete settings"
    on settings for delete using (public.is_admin());

-- AI logs: admins can read and insert; no update/delete
create policy "Admins can read ai_logs"
    on ai_logs for select using (public.is_admin());

create policy "Admins can insert ai_logs"
    on ai_logs for insert with check (public.is_admin());
