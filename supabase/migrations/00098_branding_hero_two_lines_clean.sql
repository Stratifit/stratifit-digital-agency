-- Migration: 00098_branding_hero_two_lines_clean
-- Description: Sets the branding hero to a clean two-line layout where
--              line 1 is the white title and line 2 uses highlightLastWord
--              so only the final word (trust.) appears in amber.
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
    "de": "erkennt und der man vertraut.",
    "fr": "on reconnaît et en qui l'\''on a confiance.",
    "es": "reconozca y en la que confíen."
  }'::jsonb
WHERE slug = 'brand-design';
