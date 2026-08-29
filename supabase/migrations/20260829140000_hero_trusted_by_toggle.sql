-- Migration: 20260829140000_hero_trusted_by_toggle
-- Description: Adds a CMS toggle to show or hide the trusted-by logo strip
--              at the bottom of the hero. The public hero only renders the
--              strip when trusted_by_enabled is true (default true).
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Schema
-- =============================================================================

ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS trusted_by_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.hero.trusted_by_enabled IS 'Toggles whether the trusted-by logo strip is shown in the hero.';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.hero DROP COLUMN IF EXISTS trusted_by_enabled;