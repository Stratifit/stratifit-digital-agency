-- Migration: 20260826100000_portfolio_build_logo_system_copy
-- Description: Updates the CLENQO Build phase copy for the Logo System heading
--              and its approved description.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET brand_story_translations = jsonb_set(
  COALESCE(brand_story_translations, '{}'::jsonb),
  '{en}',
  to_jsonb('Develop a confident, scalable mark that reflects CLENQO’s professionalism and eco‑focused values. The logo system includes primary, secondary, and compact variations to ensure consistency across digital and physical applications.'::text),
  true
)
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- Restore the previous English brand story from migration
-- 20260823150000_portfolio_brand_story.sql if required.
