-- Migration: 00056_testimonials_source
-- Description: Adds a source column ('website' | 'google') to testimonials so
--              the testimonial card can show a Google icon on reviews that came
--              from Google (only on some cards, not all). The admin editor
--              (Content → Testimonials) controls the value per testimonial.
-- Stratifit Digital Agency Platform

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website';

ALTER TABLE public.testimonials
  DROP CONSTRAINT IF EXISTS testimonials_source_check;

ALTER TABLE public.testimonials
  ADD CONSTRAINT testimonials_source_check
  CHECK (source IN ('website', 'google'));

COMMENT ON COLUMN public.testimonials.source IS
  'Where the review came from: website or google. Controls whether the testimonial card shows the Google icon.';

-- Mark a selection of seeded reviews as Google-sourced so some (not all) cards
-- show the Google icon.
UPDATE public.testimonials
SET source = 'google'
WHERE id IN (
  '33333333-3333-4333-8333-333333333312', -- Marcus Weber
  '33333333-3333-4333-8333-333333333314', -- Daniel Okafor
  '33333333-3333-4333-8333-333333333315', -- Emma Lindqvist
  '33333333-3333-4333-8333-333333333316'  -- James Carter
);
