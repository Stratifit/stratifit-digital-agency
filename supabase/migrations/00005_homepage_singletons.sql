-- Migration: 00005_homepage_singletons
-- Description: Create homepage singleton tables: hero, why_choose_us,
--              acquisition_section, final_cta.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Hero (Singleton)
-- =============================================================================

CREATE TABLE public.hero (
  singleton_key                      boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  eyebrow_translations               jsonb NOT NULL DEFAULT '{}'::jsonb,
  title_translations                 jsonb NOT NULL DEFAULT '{}'::jsonb,
  highlight_translations             jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations           jsonb NOT NULL DEFAULT '{}'::jsonb,
  primary_cta_label_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  primary_cta_url                    text,
  secondary_cta_label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  secondary_cta_url                  text,
  media_id                           uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  metrics                            jsonb NOT NULL DEFAULT '[]'::jsonb,
  variant                            text NOT NULL DEFAULT 'default',
  animation_preset                   text NOT NULL DEFAULT 'default',
  is_visible                         boolean NOT NULL DEFAULT true,
  created_at                         timestamptz NOT NULL DEFAULT now(),
  updated_at                         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.hero IS 'Singleton table for homepage hero section.';

CREATE TRIGGER set_hero_updated_at
  BEFORE UPDATE ON public.hero
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Why Choose Us (Singleton)
-- =============================================================================

CREATE TABLE public.why_choose_us (
  singleton_key            boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  eyebrow_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  title_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  items                    jsonb NOT NULL DEFAULT '[]'::jsonb,
  media_id                 uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  variant                  text NOT NULL DEFAULT 'default',
  is_visible               boolean NOT NULL DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.why_choose_us IS 'Singleton table for Why Choose Us section.';

CREATE TRIGGER set_why_choose_us_updated_at
  BEFORE UPDATE ON public.why_choose_us
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Acquisition Section (Singleton)
-- =============================================================================

CREATE TABLE public.acquisition_section (
  singleton_key            boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  title_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  benefits                 jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_url                  text,
  media_id                 uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  variant                  text NOT NULL DEFAULT 'default',
  is_visible               boolean NOT NULL DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.acquisition_section IS 'Singleton table for acquisition (Buy a Business) section.';

CREATE TRIGGER set_acquisition_section_updated_at
  BEFORE UPDATE ON public.acquisition_section
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Final CTA (Singleton)
-- =============================================================================

CREATE TABLE public.final_cta (
  singleton_key                      boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  title_translations                 jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations           jsonb NOT NULL DEFAULT '{}'::jsonb,
  primary_cta_label_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  primary_cta_url                    text,
  secondary_cta_label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  secondary_cta_url                  text,
  variant                            text NOT NULL DEFAULT 'default',
  is_visible                         boolean NOT NULL DEFAULT true,
  created_at                         timestamptz NOT NULL DEFAULT now(),
  updated_at                         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.final_cta IS 'Singleton table for final call-to-action section.';

CREATE TRIGGER set_final_cta_updated_at
  BEFORE UPDATE ON public.final_cta
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS set_final_cta_updated_at ON public.final_cta;
-- DROP TABLE IF EXISTS public.final_cta;
-- DROP TRIGGER IF EXISTS set_acquisition_section_updated_at ON public.acquisition_section;
-- DROP TABLE IF EXISTS public.acquisition_section;
-- DROP TRIGGER IF EXISTS set_why_choose_us_updated_at ON public.why_choose_us;
-- DROP TABLE IF EXISTS public.why_choose_us;
-- DROP TRIGGER IF EXISTS set_hero_updated_at ON public.hero;
-- DROP TABLE IF EXISTS public.hero;
