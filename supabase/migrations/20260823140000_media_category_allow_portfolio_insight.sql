-- =============================================================================
-- Description: Extends the media_assets category CHECK constraint to include
--              'portfolio' and 'insight'. The shared upload action
--              (src/features/media/mutations.ts) maps the portfolio-images and
--              insights-images buckets to those categories; the original
--              constraint from migration 00016 only allowed the generic
--              set, so every upload to those buckets failed with error 23514
--              ("Failed to save media metadata") after the file reached
--              storage. This restores the intended taxonomy.
-- Stratifit Digital Agency Platform
-- =============================================================================

ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS media_assets_category_check;

ALTER TABLE public.media_assets
  ADD CONSTRAINT media_assets_category_check
  CHECK (
    category IN (
      'general', 'image', 'video', 'document', 'icon', 'logo', 'banner',
      'portfolio', 'insight'
    )
  );

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.media_assets
--   DROP CONSTRAINT IF EXISTS media_assets_category_check;
-- ALTER TABLE public.media_assets
--   ADD CONSTRAINT media_assets_category_check
--   CHECK (category IN ('general', 'image', 'video', 'document', 'icon', 'logo', 'banner'));
