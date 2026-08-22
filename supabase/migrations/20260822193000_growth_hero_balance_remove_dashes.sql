-- Migration: 20260822193000_growth_hero_balance_remove_dashes
-- Description: 1) Rebalances the growth-marketing hero into two full lines
--              per locale so no line ends with a dangling word.
--              2) Removes em-dashes from public prose copy (services
--              descriptions, testimonials description, acquisition niche
--              texts). SEO titles ("Services — Stratifit") and admin labels
--              are intentionally kept.

-- ---------------------------------------------------------------------------
-- 1) Growth-marketing hero: two balanced lines
-- ---------------------------------------------------------------------------
UPDATE public.service_pages
SET
  hero_title_translations = $${
    "en": "Turn visibility into",
    "de": "Machen Sie aus Sichtbarkeit",
    "fr": "Transformez votre visibilité",
    "es": "Convierta la visibilidad"
  }$$::jsonb,
  hero_highlight_translations = $${
    "en": "measurable growth.",
    "de": "messbares Wachstum.",
    "fr": "en croissance mesurable.",
    "es": "en crecimiento medible."
  }$$::jsonb
WHERE slug = 'growth-marketing';

-- ---------------------------------------------------------------------------
-- 2) Em-dash cleanup in prose (" — " becomes ", ")
-- ---------------------------------------------------------------------------

-- Service descriptions
UPDATE public.services
SET full_description_translations = (
  SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
  FROM jsonb_each_text(full_description_translations)
)
WHERE slug IN ('ai-automation', 'website-development');

-- Testimonials section description
UPDATE public.section_settings
SET description_translations = (
  SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
  FROM jsonb_each_text(description_translations)
)
WHERE section_key = 'testimonials';

-- Acquisition niches (scalar description objects)
UPDATE public.acquisition_niches
SET
  description_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(description_translations)
  ),
  why_description_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(why_description_translations)
  )
WHERE slug IN ('agency', 'ai-tools', 'personal-brand');

-- Portfolio projects: scalar story fields
UPDATE public.portfolio_projects
SET
  summary_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(summary_translations)
  ),
  challenge_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(challenge_translations)
  ),
  approach_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(approach_translations)
  ),
  solution_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(solution_translations)
  ),
  results_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(results_translations)
  )
WHERE jsonb_path_exists(to_jsonb(portfolio_projects), '$.** ? (@ like_regex "—")');
