-- ============================================================================
-- Stratifit — Backfill service iconId for existing navigation header rows
-- ============================================================================

UPDATE section_navigation_header
SET content = jsonb_set(
  content,
  '{services}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN svc->>'id' = 'brand' THEN svc || '{"iconId": "brand"}'::jsonb
        WHEN svc->>'id' = 'web' THEN svc || '{"iconId": "web"}'::jsonb
        WHEN svc->>'id' = 'marketing' THEN svc || '{"iconId": "marketing"}'::jsonb
        WHEN svc->>'id' = 'seo' THEN svc || '{"iconId": "seo"}'::jsonb
        ELSE svc || '{"iconId": "brand"}'::jsonb
      END
    )
    FROM jsonb_array_elements(content->'services') AS svc
  ),
  true
)
WHERE jsonb_typeof(content->'services') = 'array';
