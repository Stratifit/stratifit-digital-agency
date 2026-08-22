-- Migration: 20260822193500_service_page_dash_cleanup
-- Description: Removes remaining em-dashes from service_pages prose fields
--              (hero/why/capabilities descriptions and CTA subtitle) for the
--              ai-automation and website-development pages.

UPDATE public.service_pages
SET
  hero_description_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(hero_description_translations)
  ),
  why_description_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(why_description_translations)
  ),
  capabilities_description_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(capabilities_description_translations)
  ),
  cta_subtitle_translations = (
    SELECT COALESCE(jsonb_object_agg(key, CASE WHEN value LIKE '%—%' THEN replace(value, ' — ', ', ') ELSE value END), '{}'::jsonb)
    FROM jsonb_each_text(cta_subtitle_translations)
  )
WHERE slug IN ('ai-automation', 'website-development')
  AND jsonb_path_exists(to_jsonb(service_pages), '$.** ? (@ like_regex "—")');
