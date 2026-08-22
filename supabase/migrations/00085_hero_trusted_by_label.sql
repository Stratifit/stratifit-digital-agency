-- =============================================================================
-- 00085_hero_trusted_by_label.sql
-- The hero's trusted-by strip label ("Trusted by Growing Companies") was
-- hardcoded in the component. It now lives in the `hero` table so it can be
-- edited in the CMS (Sections → Hero → Trusted by logos).
--
-- The amber word is marked inline with <angle brackets> (same pattern as the
-- section-header title editor), e.g. "Trusted by <Growing> Companies".
-- =============================================================================

ALTER TABLE public.hero
  ADD COLUMN IF NOT EXISTS trusted_by_label_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.hero
SET trusted_by_label_translations = '{
  "en": "Trusted by <Growing> Companies",
  "de": "Vertraut von <wachsenden> Unternehmen",
  "fr": "Apprécié par des <entreprises> en croissance",
  "es": "Con la confianza de <empresas> en crecimiento"
}'::jsonb
WHERE singleton_key = true;

-- =============================================================================
-- Rollback (if ever needed):
--   ALTER TABLE public.hero DROP COLUMN trusted_by_label_translations;
-- =============================================================================
