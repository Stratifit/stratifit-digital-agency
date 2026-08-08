-- Migration: 00051_seo_metadata_columns
-- Description: Makes page-level SEO metadata (title + description) editable in
--              the CMS. `services`, `insights`, and `portfolio_projects`
--              already carry `seo_title_translations` / `seo_description_translations`;
--              this adds the same columns to `section_settings` (section pages),
--              `about_page`, and `detail_pages` (legal pages), seeded with the
--              values that were previously hardcoded in page metadata so the
--              frontend renders identical content while admins gain control.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Columns
-- =============================================================================

ALTER TABLE public.section_settings
  ADD COLUMN seo_title_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN seo_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.about_page
  ADD COLUMN seo_title_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN seo_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.detail_pages
  ADD COLUMN seo_title_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN seo_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

-- =============================================================================
-- Seed section pages (only when still empty so admin edits are preserved)
-- =============================================================================

UPDATE public.section_settings SET
  seo_title_translations = '{"en": "Our Work — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Selected case studies and projects by Stratifit across web, brand, and growth."}'::jsonb
WHERE section_key = 'portfolio' AND seo_title_translations = '{}'::jsonb;

UPDATE public.section_settings SET
  seo_title_translations = '{"en": "Services — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Explore Stratifit''s core services: brand design, website development, AI & automation, and growth marketing."}'::jsonb
WHERE section_key = 'services' AND seo_title_translations = '{}'::jsonb;

UPDATE public.section_settings SET
  seo_title_translations = '{"en": "Testimonials — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Don''t take our word for it — hear from the brands we''ve helped scale."}'::jsonb
WHERE section_key = 'testimonials' AND seo_title_translations = '{}'::jsonb;

UPDATE public.section_settings SET
  seo_title_translations = '{"en": "Insights — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Insights and expertise from the Stratifit team on design, development, AI, and growth."}'::jsonb
WHERE section_key = 'insights' AND seo_title_translations = '{}'::jsonb;

UPDATE public.section_settings SET
  seo_title_translations = '{"en": "Contact — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Get in touch with Stratifit. We reply to every enquiry within 24 hours."}'::jsonb
WHERE section_key = 'contact' AND seo_title_translations = '{}'::jsonb;

UPDATE public.section_settings SET
  seo_title_translations = '{"en": "Buy a Business — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Skip the startup grind. Browse our curated marketplace of profitable, turnkey businesses across seven high-demand niches."}'::jsonb
WHERE section_key = 'acquisition' AND seo_title_translations = '{}'::jsonb;

-- =============================================================================
-- Seed About page
-- =============================================================================

UPDATE public.about_page SET
  seo_title_translations = '{"en": "About — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Learn about Stratifit, a premium digital agency for web, brand, AI, and growth."}'::jsonb
WHERE seo_title_translations = '{}'::jsonb;

-- =============================================================================
-- Seed legal / detail pages
-- =============================================================================

UPDATE public.detail_pages SET
  seo_title_translations = '{"en": "Privacy Policy — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "How Stratifit collects, uses, and protects personal data."}'::jsonb
WHERE slug = 'privacy' AND seo_title_translations = '{}'::jsonb;

UPDATE public.detail_pages SET
  seo_title_translations = '{"en": "Terms of Service — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Terms and conditions for using the Stratifit website."}'::jsonb
WHERE slug = 'terms-conditions' AND seo_title_translations = '{}'::jsonb;

UPDATE public.detail_pages SET
  seo_title_translations = '{"en": "Cookie Policy — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "How Stratifit uses cookies."}'::jsonb
WHERE slug = 'cookie-policy' AND seo_title_translations = '{}'::jsonb;

UPDATE public.detail_pages SET
  seo_title_translations = '{"en": "Imprint — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Imprint and legal information for Stratifit."}'::jsonb
WHERE slug = 'imprint' AND seo_title_translations = '{}'::jsonb;

UPDATE public.detail_pages SET
  seo_title_translations = '{"en": "Careers — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Join the Stratifit team. We hire strategists, designers, engineers, and marketers."}'::jsonb
WHERE slug = 'careers' AND seo_title_translations = '{}'::jsonb;

UPDATE public.detail_pages SET
  seo_title_translations = '{"en": "We''re Hiring — Stratifit"}'::jsonb,
  seo_description_translations = '{"en": "Open roles at Stratifit. We hire strategists, designers, engineers, and marketers on a rolling basis."}'::jsonb
WHERE slug = 'hiring' AND seo_title_translations = '{}'::jsonb;

-- =============================================================================
-- Align homepage default_seo with the previous hardcoded homepage metadata so
-- wiring the homepage to read default_seo does not silently change the copy.
-- Guarded: only rewrites when still empty or still carrying the original seed
-- value, so any admin-authored SEO is preserved.
-- =============================================================================

UPDATE public.site_settings
SET default_seo = jsonb_set(
  default_seo,
  '{en}',
  '{"title": "Stratifit — Digital Agency", "description": "Stratifit is a premium multilingual digital agency delivering websites, web applications, e-commerce, and AI solutions."}'::jsonb
)
WHERE singleton_key = true
  AND (
    default_seo = '{}'::jsonb
    OR default_seo #>> '{en,title}' = 'Stratifit | Premium Digital Agency'
  );

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.detail_pages DROP COLUMN seo_title_translations, DROP COLUMN seo_description_translations;
-- ALTER TABLE public.about_page DROP COLUMN seo_title_translations, DROP COLUMN seo_description_translations;
-- ALTER TABLE public.section_settings DROP COLUMN seo_title_translations, DROP COLUMN seo_description_translations;
