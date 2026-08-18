-- Migration: 00059_cookie_settings
-- Description: Cookie consent banner configuration singleton.
--   Publicly readable for rendering the banner; admin-managed on/off toggles
--   and multilingual copy. No tracking scripts are gated by this in V1 —
--   it stores consent for future non-essential tracking.
-- Stratifit Digital Agency Platform

create table public.cookie_settings (
  singleton_key                        boolean primary key default true check (singleton_key),
  banner_enabled                       boolean not null default true,
  banner_title_translations            jsonb not null default '{}'::jsonb,
  banner_text_translations             jsonb not null default '{}'::jsonb,
  accept_all_label_translations        jsonb not null default '{}'::jsonb,
  essential_only_label_translations    jsonb not null default '{}'::jsonb,
  settings_label_translations          jsonb not null default '{}'::jsonb,
  save_preferences_label_translations  jsonb not null default '{}'::jsonb,
  policy_url                           text not null default '/cookie-policy',
  categories                           jsonb not null default '[]'::jsonb,
  created_at                           timestamptz not null default now(),
  updated_at                           timestamptz not null default now()
);

comment on table public.cookie_settings is
  'Cookie consent banner configuration. Publicly readable; admin-managed.';

alter table public.cookie_settings enable row level security;

create policy "public can read cookie_settings"
  on public.cookie_settings for select
  to anon, authenticated
  using (true);

create policy "admins can manage cookie_settings"
  on public.cookie_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.cookie_settings (
  singleton_key,
  banner_title_translations,
  banner_text_translations,
  accept_all_label_translations,
  essential_only_label_translations,
  settings_label_translations,
  save_preferences_label_translations,
  policy_url,
  categories
)
values (
  true,
  '{"en": "Cookie Preferences"}'::jsonb,
  '{"en": "We use cookies to enhance your browsing experience, analyze site traffic, and deliver personalized content. By clicking “Accept All”, you consent to our use of cookies. You can learn more in our"}'::jsonb,
  '{"en": "Accept All"}'::jsonb,
  '{"en": "Essential Only"}'::jsonb,
  '{"en": "Settings"}'::jsonb,
  '{"en": "Save Preferences"}'::jsonb,
  '/cookie-policy',
  '[
    {
      "key": "essential",
      "essential": true,
      "enabled": true,
      "name_translations": { "en": "Essential cookies" },
      "description_translations": { "en": "Required for the website to function. Cannot be switched off." }
    },
    {
      "key": "analytics",
      "essential": false,
      "enabled": true,
      "name_translations": { "en": "Analytics cookies" },
      "description_translations": { "en": "Help us understand how visitors interact with the site. All data is aggregated and anonymous." }
    },
    {
      "key": "marketing",
      "essential": false,
      "enabled": false,
      "name_translations": { "en": "Marketing cookies" },
      "description_translations": { "en": "Used to show relevant advertising. Currently not in use unless you consent." }
    }
  ]'::jsonb
)
on conflict (singleton_key) do nothing;

-- Rollback:
-- DROP POLICY IF EXISTS "admins can manage cookie_settings" ON public.cookie_settings;
-- DROP POLICY IF EXISTS "public can read cookie_settings" ON public.cookie_settings;
-- DROP TABLE IF EXISTS public.cookie_settings;
