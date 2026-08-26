-- Migration: 20260826120000_portfolio_palette_description
-- Description: Adds the approved CLENQO palette description to the existing
--              brand-system content without changing the JSON shape elsewhere.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET brand_system_translations = jsonb_set(
  COALESCE(brand_system_translations, '{}'::jsonb),
  '{en,palette_description}',
  to_jsonb('Introduce a refined palette built around clean neutrals and eco‑driven accents. The colors reinforce trust, clarity, and sustainability while improving contrast and accessibility across all touchpoints.'::text),
  true
)
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.portfolio_projects
-- SET brand_system_translations = brand_system_translations #- '{en,palette_description}'
-- WHERE slug = 'aura-cosmetics-identity';
