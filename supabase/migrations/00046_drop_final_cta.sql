-- Migration: 00046_drop_final_cta
-- Description: Removes the Final CTA section from the platform. The section
--              (card with "Ready to Transform Your Digital Presence?" + CTAs)
--              was removed from the homepage, registry, and admin; this drops
--              the backing table.
-- Stratifit Digital Agency Platform

DROP TABLE IF EXISTS public.final_cta;

-- =============================================================================
-- Rollback
-- =============================================================================
-- CREATE TABLE public.final_cta (
--   singleton_key               boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
--   title_translations          jsonb NOT NULL DEFAULT '{}'::jsonb,
--   description_translations    jsonb NOT NULL DEFAULT '{}'::jsonb,
--   primary_cta_label_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
--   primary_cta_url             text,
--   secondary_cta_label_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
--   secondary_cta_url           text,
--   variant                     text NOT NULL DEFAULT 'default',
--   is_visible                  boolean NOT NULL DEFAULT true,
--   created_at                  timestamptz NOT NULL DEFAULT now(),
--   updated_at                  timestamptz NOT NULL DEFAULT now()
-- );
-- ALTER TABLE public.final_cta ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "public can read visible final_cta" ON public.final_cta FOR SELECT TO anon, authenticated USING (is_visible = true);
-- CREATE POLICY "admins can manage final_cta" ON public.final_cta FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
