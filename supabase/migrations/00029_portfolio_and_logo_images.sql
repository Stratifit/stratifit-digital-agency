-- =============================================================================
-- Description: Add direct image_url support to portfolio_projects and
--              trusted_logos so case studies and trust logos can render real
--              imagery without a populated media library.
-- =============================================================================

-- Portfolio projects: allow a direct cover image URL (media library still works).
ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.portfolio_projects.image_url
  IS 'Optional direct cover image URL. Preferred over featured_media_id when set.';

-- Trusted logos: allow a direct logo URL; media_id becomes optional.
ALTER TABLE public.trusted_logos
  ADD COLUMN IF NOT EXISTS image_url text;

ALTER TABLE public.trusted_logos
  ALTER COLUMN media_id DROP NOT NULL;

COMMENT ON COLUMN public.trusted_logos.image_url
  IS 'Optional direct logo image URL. Preferred over media_id when set.';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.portfolio_projects DROP COLUMN IF EXISTS image_url;
-- ALTER TABLE public.trusted_logos DROP COLUMN IF EXISTS image_url;
-- ALTER TABLE public.trusted_logos ALTER COLUMN media_id SET NOT NULL;
