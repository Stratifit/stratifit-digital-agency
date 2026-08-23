-- =============================================================================
-- Description: Adds an explicit display `year` to portfolio_projects so the
--              case study facts bar shows an editable year without depending
--              on published_at (which also drives card ordering). Existing
--              rows are backfilled from published_at; the public page falls
--              back to the published_at year when `year` is still null.
-- Stratifit Digital Agency Platform
-- =============================================================================

ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS year integer;

UPDATE public.portfolio_projects
SET year = EXTRACT(YEAR FROM published_at)::int
WHERE year IS NULL AND published_at IS NOT NULL;

COMMENT ON COLUMN public.portfolio_projects.year
  IS 'Display year for the case study facts bar. Falls back to the published_at year when null.';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.portfolio_projects DROP COLUMN IF EXISTS year;
