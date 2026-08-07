-- Migration: 00035_service_cta_style
-- Description: Add per-service CTA style control for homepage service cards.
--              'full'    = full-width amber button (current default)
--              'compact' = compact left-aligned button
-- Stratifit Digital Agency Platform

ALTER TABLE public.services
  ADD COLUMN cta_style text NOT NULL DEFAULT 'full'
  CHECK (cta_style IN ('full', 'compact'));

COMMENT ON COLUMN public.services.cta_style IS 'Homepage card CTA presentation: full-width (full) or compact left-aligned (compact).';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.services DROP COLUMN cta_style;
