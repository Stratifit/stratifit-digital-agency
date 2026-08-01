-- Migration: 00003_media_assets
-- Description: Create media_assets table for Supabase Storage metadata tracking.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Media Assets Table
-- =============================================================================

CREATE TABLE public.media_assets (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name       text NOT NULL,
  storage_path      text NOT NULL,
  original_filename text NOT NULL,
  mime_type         text NOT NULL,
  file_size_bytes   bigint NOT NULL CHECK (file_size_bytes >= 0),
  width             integer CHECK (width IS NULL OR width > 0),
  height            integer CHECK (height IS NULL OR height > 0),
  alt_text_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  caption_translations    jsonb NOT NULL DEFAULT '{}'::jsonb,
  category          text NOT NULL DEFAULT 'general',
  uploaded_by       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket_name, storage_path)
);

COMMENT ON TABLE public.media_assets IS 'Tracks metadata for Supabase Storage objects.';

-- Apply updated_at trigger
CREATE TRIGGER set_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS set_media_assets_updated_at ON public.media_assets;
-- DROP TABLE IF EXISTS public.media_assets;
