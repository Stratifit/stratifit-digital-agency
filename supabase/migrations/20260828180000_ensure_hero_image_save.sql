-- Ensure Hero image persistence is available on every deployment.
ALTER TABLE public.hero
  ADD COLUMN IF NOT EXISTS media_id uuid;

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

CREATE INDEX IF NOT EXISTS idx_hero_media_id ON public.hero (media_id);

-- Keep the singleton table writable by the existing authenticated admin policy.
-- No new access is granted here; the policy from 00012 remains authoritative.
