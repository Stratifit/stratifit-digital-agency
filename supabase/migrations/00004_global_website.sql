-- Migration: 00004_global_website
-- Description: Create global website tables: site_settings, announcement_bar,
--              navigation_items, footer_groups, footer_links.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Site Settings (Singleton)
-- =============================================================================

CREATE TABLE public.site_settings (
  singleton_key              boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  site_name                  text NOT NULL DEFAULT 'Stratifit',
  site_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  contact_email              text,
  contact_phone              text,
  address_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  social_links               jsonb NOT NULL DEFAULT '{}'::jsonb,
  default_locale             text NOT NULL DEFAULT 'en',
  supported_locales          text[] NOT NULL DEFAULT ARRAY['en', 'de', 'fr', 'es'],
  default_seo                jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.site_settings IS 'Singleton table for public and operational site defaults.';

CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Announcement Bar (Singleton)
-- =============================================================================

CREATE TABLE public.announcement_bar (
  singleton_key          boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  message_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  link_label_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  link_url               text,
  is_enabled             boolean NOT NULL DEFAULT false,
  starts_at              timestamptz,
  ends_at                timestamptz,
  variant                text NOT NULL DEFAULT 'primary' CHECK (variant IN ('primary', 'neutral', 'ai')),
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.announcement_bar IS 'Singleton table for site-wide announcement bar.';

CREATE TRIGGER set_announcement_bar_updated_at
  BEFORE UPDATE ON public.announcement_bar
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Navigation Items
-- =============================================================================

CREATE TABLE public.navigation_items (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location             text NOT NULL CHECK (location IN ('header', 'footer')),
  parent_id            uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  href                 text NOT NULL,
  is_external          boolean NOT NULL DEFAULT false,
  open_in_new_tab      boolean NOT NULL DEFAULT false,
  display_order        integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_visible           boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.navigation_items IS 'Navigation links for header and footer.';

CREATE TRIGGER set_navigation_items_updated_at
  BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Footer Groups
-- =============================================================================

CREATE TABLE public.footer_groups (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_order        integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_visible           boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.footer_groups IS 'Groups of footer links.';

CREATE TRIGGER set_footer_groups_updated_at
  BEFORE UPDATE ON public.footer_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Footer Links
-- =============================================================================

CREATE TABLE public.footer_links (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id             uuid NOT NULL REFERENCES public.footer_groups(id) ON DELETE CASCADE,
  label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  href                 text NOT NULL,
  is_external          boolean NOT NULL DEFAULT false,
  display_order        integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_visible           boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.footer_links IS 'Individual links within footer groups.';

CREATE TRIGGER set_footer_links_updated_at
  BEFORE UPDATE ON public.footer_links
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS set_footer_links_updated_at ON public.footer_links;
-- DROP TABLE IF EXISTS public.footer_links;
-- DROP TRIGGER IF EXISTS set_footer_groups_updated_at ON public.footer_groups;
-- DROP TABLE IF EXISTS public.footer_groups;
-- DROP TRIGGER IF EXISTS set_navigation_items_updated_at ON public.navigation_items;
-- DROP TABLE IF EXISTS public.navigation_items;
-- DROP TRIGGER IF EXISTS set_announcement_bar_updated_at ON public.announcement_bar;
-- DROP TABLE IF EXISTS public.announcement_bar;
-- DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
-- DROP TABLE IF EXISTS public.site_settings;
