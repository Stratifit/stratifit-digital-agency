-- Migration: 20260827130000_clenqo_launch_description
-- Description: Adds the approved CLENQO "Brand Rollout" section description to
--              the Launch & Activation phase document (launch_translations
--              JSONB) in every locale — introducing the refreshed identity
--              rollout across all core brand channels. Per-locale JSONB merges
--              preserve every other field.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET launch_translations = (
  SELECT jsonb_object_agg(
    locale,
    COALESCE(launch_translations -> locale, '{}'::jsonb)
      || jsonb_build_object('description', v.description)
  )
  FROM (VALUES
    ('en', 'Introduce CLENQO’s refreshed identity across all core brand channels, ensuring a consistent and confident transition into the new system.'),
    ('de', 'Führen Sie CLENQOs erneuerte Identität über alle zentralen Markenkanäle ein und sorgen Sie für einen konsistenten und selbstbewussten Übergang in das neue System.'),
    ('fr', 'Présentez l’identité renouvelée de CLENQO sur l’ensemble des canaux de marque, garantissant une transition cohérente et confiante vers le nouveau système.'),
    ('es', 'Presenta la identidad renovada de CLENQO en todos los canales de marca principales, garantizando una transición consistente y segura hacia el nuevo sistema.')
  ) AS v(locale, description)
)
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.portfolio_projects
-- SET launch_translations = (
--   SELECT jsonb_object_agg(
--     locale,
--     COALESCE(launch_translations -> locale, '{}'::jsonb) - 'description'
--   )
--   FROM (VALUES ('en'), ('de'), ('fr'), ('es')) AS v(locale)
-- )
-- WHERE slug = 'aura-cosmetics-identity';
