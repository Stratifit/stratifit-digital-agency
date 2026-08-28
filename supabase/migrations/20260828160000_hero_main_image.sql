-- Hero already has a dedicated media reference from the initial media model.
-- This migration adds the explicit foreign-key constraint if a deployment is
-- missing it, allowing the existing Admin upload flow to persist hero images.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'hero_media_id_fkey'
      AND conrelid = 'public.hero'::regclass
  ) THEN
    ALTER TABLE public.hero
      ADD CONSTRAINT hero_media_id_fkey
      FOREIGN KEY (media_id) REFERENCES public.media_assets(id)
      ON DELETE SET NULL;
  END IF;
END $$;

COMMENT ON COLUMN public.hero.media_id IS
  'Media-library reference for the Hero main image, managed from Admin.';
