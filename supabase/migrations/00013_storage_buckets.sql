-- Migration: 00013_storage_buckets
-- Description: Create Supabase Storage buckets and policies for media management.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Storage Buckets
-- =============================================================================

-- Create public buckets for media storage
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('logos', 'logos', true),
  ('portfolio-images', 'portfolio-images', true),
  ('insights-images', 'insights-images', true),
  ('general-media', 'general-media', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Storage Policies — Public Read
-- =============================================================================

CREATE POLICY "public can read logos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'logos');

CREATE POLICY "public can read portfolio-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "public can read insights-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'insights-images');

CREATE POLICY "public can read general-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'general-media');

-- =============================================================================
-- Storage Policies — Admin-Only Upload
-- =============================================================================

CREATE POLICY "admins can upload to logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'logos' AND public.is_admin());

CREATE POLICY "admins can upload to portfolio-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND public.is_admin());

CREATE POLICY "admins can upload to insights-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'insights-images' AND public.is_admin());

CREATE POLICY "admins can upload to general-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'general-media' AND public.is_admin());

-- =============================================================================
-- Storage Policies — Admin-Only Delete
-- =============================================================================

CREATE POLICY "admins can delete from logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'logos' AND public.is_admin());

CREATE POLICY "admins can delete from portfolio-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.is_admin());

CREATE POLICY "admins can delete from insights-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'insights-images' AND public.is_admin());

CREATE POLICY "admins can delete from general-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'general-media' AND public.is_admin());

-- =============================================================================
-- Storage Policies — Admin-Only Update
-- =============================================================================

CREATE POLICY "admins can update in logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'logos' AND public.is_admin())
  WITH CHECK (bucket_id = 'logos' AND public.is_admin());

CREATE POLICY "admins can update in portfolio-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio-images' AND public.is_admin());

CREATE POLICY "admins can update in insights-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'insights-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'insights-images' AND public.is_admin());

CREATE POLICY "admins can update in general-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'general-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'general-media' AND public.is_admin());

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP POLICY IF EXISTS "admins can update in general-media" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can update in insights-images" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can update in portfolio-images" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can update in logos" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can delete from general-media" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can delete from insights-images" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can delete from portfolio-images" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can delete from logos" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can upload to general-media" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can upload to insights-images" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can upload to portfolio-images" ON storage.objects;
-- DROP POLICY IF EXISTS "admins can upload to logos" ON storage.objects;
-- DROP POLICY IF EXISTS "public can read general-media" ON storage.objects;
-- DROP POLICY IF EXISTS "public can read insights-images" ON storage.objects;
-- DROP POLICY IF EXISTS "public can read portfolio-images" ON storage.objects;
-- DROP POLICY IF EXISTS "public can read logos" ON storage.objects;
-- DELETE FROM storage.buckets WHERE id IN ('logos', 'portfolio-images', 'insights-images', 'general-media');
