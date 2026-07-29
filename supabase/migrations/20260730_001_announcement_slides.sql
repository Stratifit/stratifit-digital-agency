-- ============================================================================
-- Stratifit — Announcement Slides
-- Migration: 20260730_001_announcement_slides
-- Description: Announcement bar slides with multilingual message support.
-- ============================================================================

create table if not exists announcement_slides (
    id                  uuid primary key default gen_random_uuid(),
    display_order       integer not null default 0,
    sticky              boolean not null default false,
    url                 text not null default '',
    message_translations jsonb not null default '{}'::jsonb
                        check (jsonb_typeof(message_translations) = 'object'),
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

create index idx_announcement_slides_display_order
    on announcement_slides (display_order);

-- Trigger for updated_at
create trigger set_announcement_slides_updated_at
    before update on announcement_slides
    for each row execute function public.update_updated_at_column();

-- RLS
alter table announcement_slides enable row level security;

create policy "Announcement slides are publicly readable"
    on announcement_slides for select using (true);

create policy "Admins can insert announcement_slides"
    on announcement_slides for insert with check (public.is_admin());

create policy "Admins can update announcement_slides"
    on announcement_slides for update using (public.is_admin());

create policy "Admins can delete announcement_slides"
    on announcement_slides for delete using (public.is_admin());
