-- Migration: 00017_announcement_slides
-- Description: Add slides column to announcement_bar for multi-message carousel.
-- Stratifit Digital Agency Platform

ALTER TABLE public.announcement_bar
  ADD COLUMN IF NOT EXISTS slides jsonb NOT NULL DEFAULT '[]'::jsonb;

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- ALTER TABLE public.announcement_bar DROP COLUMN IF EXISTS slides;
