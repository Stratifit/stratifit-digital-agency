-- Migration: 00097_branding_hero_revert_to_default
-- Description: Reverts the branding service hero to its original single-line
--              title (no highlight split), matching the 00086 default.
-- Stratifit Digital Agency Platform

UPDATE public.service_pages
SET
  hero_title_translations = '{
    "en": "Build a brand people recognize and trust.",
    "de": "Eine Marke, die wiedererkannt wird und Vertrauen schafft.",
    "fr": "Créez une marque que l''on reconnaît et qui inspire confiance.",
    "es": "Cree una marca que las personas reconozcan y en la que confíen."
  }'::jsonb,
  hero_highlight_translations = '{}'::jsonb
WHERE slug = 'brand-design';
