-- Migration: 00049_review_summary_settings
-- Description: Adds an editable review summary (client rating, verified review
--              count, Google rating/count, Google reviews link) to
--              section_settings so the /testimonials review summary band is
--              CMS-editable instead of hardcoded in the frontend.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- section_settings.review_summary
-- =============================================================================

ALTER TABLE public.section_settings
  ADD COLUMN IF NOT EXISTS review_summary jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.section_settings.review_summary IS
  'Optional review summary band: { rating: text, verifiedReviews: int, googleRating: text, googleReviews: int, googleReviewsUrl: text }. Consumed by the /testimonials page (testimonials section settings).';

-- =============================================================================
-- Seed the default review summary for the testimonials section (idempotent)
-- =============================================================================

UPDATE public.section_settings
SET review_summary = '{
  "rating": "4.9",
  "verifiedReviews": 47,
  "googleRating": "4.9",
  "googleReviews": 18,
  "googleReviewsUrl": "https://www.google.com/maps/search/?api=1&query=Stratifit"
}'::jsonb
WHERE section_key = 'testimonials'
  AND review_summary = '{}'::jsonb;
