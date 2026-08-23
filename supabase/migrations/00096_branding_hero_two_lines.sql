-- Migration: 00096_branding_hero_two_lines
-- Description: Adjusts the branding service hero title so the first line
--              fits on one line at text-2xl on mobile, resulting in a
--              clean two-line heading: white title + amber highlight.
-- Stratifit Digital Agency Platform

UPDATE public.service_pages
SET
  hero_title_translations = '{
    "en": "Build a brand people",
    "de": "Bauen Sie eine Marke, die",
    "fr": "Créez une marque que",
    "es": "Cree una marca que la gente"
  }'::jsonb,
  hero_highlight_translations = '{
    "en": "recognize and trust.",
    "de": "man erkennt und der man vertraut.",
    "fr": "on reconnaît et en qui l''on a confiance.",
    "es": "reconozca y en la que confíen."
  }'::jsonb
WHERE slug = 'brand-design';
