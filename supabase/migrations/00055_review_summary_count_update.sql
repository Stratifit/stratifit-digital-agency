-- Migration: 00055_review_summary_count_update
-- Description: Updates the testimonials review summary verified-review count
--              to 57 to match the approved frontend copy. The count remains
--              CMS-editable afterwards (Sections → Testimonials).
-- Stratifit Digital Agency Platform

UPDATE public.section_settings
SET review_summary = jsonb_set(
  COALESCE(review_summary, '{}'::jsonb),
  '{verifiedReviews}',
  '57'::jsonb
)
WHERE section_key = 'testimonials';
