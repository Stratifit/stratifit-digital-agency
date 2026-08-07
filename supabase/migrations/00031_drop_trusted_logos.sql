-- Migration: 00031_drop_trusted_logos
-- Description: Drop the orphaned trusted_logos table. The public Trusted By
--              section and its admin editor were removed from the product
--              (2026-08-07); the table, its RLS policies, and its trigger are
--              no longer used.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Trusted Logos
-- =============================================================================

DROP TABLE IF EXISTS public.trusted_logos;

-- Dropping the table also removes:
--   - RLS policies ("public can read visible trusted_logos",
--     "admins can manage trusted_logos" from 00012_rls_policies.sql)
--   - Trigger set_trusted_logos_updated_at
--   - Foreign key trusted_logos_media_id_fkey

-- Rollback (recreates the original table from 00006_marketing_collections.sql):
-- CREATE TABLE public.trusted_logos (
--   id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   name           text NOT NULL,
--   media_id       uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
--   href           text,
--   display_order  integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
--   is_visible     boolean NOT NULL DEFAULT true,
--   is_verified    boolean NOT NULL DEFAULT false,
--   created_at     timestamptz NOT NULL DEFAULT now(),
--   updated_at     timestamptz NOT NULL DEFAULT now()
-- );
