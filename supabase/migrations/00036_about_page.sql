-- Migration: 00036_about_page
-- Description: Purpose-built singleton table for the public About page:
--              hero intro, stats band, mission, story, values, team, and CTA.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- About Page (Singleton)
-- =============================================================================

CREATE TABLE public.about_page (
  singleton_key                   boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  eyebrow_translations            jsonb NOT NULL DEFAULT '{}'::jsonb,
  title_translations              jsonb NOT NULL DEFAULT '{}'::jsonb,
  highlight_translations          jsonb NOT NULL DEFAULT '{}'::jsonb,
  intro_translations              jsonb NOT NULL DEFAULT '{}'::jsonb,
  stats                           jsonb NOT NULL DEFAULT '[]'::jsonb,
  mission_translations            jsonb NOT NULL DEFAULT '{}'::jsonb,
  story_translations              jsonb NOT NULL DEFAULT '{}'::jsonb,
  values                          jsonb NOT NULL DEFAULT '[]'::jsonb,
  team_translations               jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_title_translations          jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_highlight_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_description_translations    jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_label_translations          jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_url                         text,
  is_visible                      boolean NOT NULL DEFAULT true,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.about_page IS 'Singleton table for the public About page content.';

CREATE TRIGGER set_about_page_updated_at
  BEFORE UPDATE ON public.about_page
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read visible about_page"
  ON public.about_page FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "admins can manage about_page"
  ON public.about_page FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Seed (current About page copy)
-- =============================================================================

INSERT INTO public.about_page (
  singleton_key,
  eyebrow_translations,
  title_translations,
  highlight_translations,
  intro_translations,
  stats,
  mission_translations,
  story_translations,
  values,
  team_translations,
  cta_title_translations,
  cta_highlight_translations,
  cta_description_translations,
  cta_label_translations,
  cta_url,
  is_visible
)
VALUES (
  true,
  '{"en": "About"}'::jsonb,
  '{"en": "About "}'::jsonb,
  '{"en": "Stratifit"}'::jsonb,
  '{"en": "We are a premium digital agency that builds brands, scales businesses, and engineers growth through strategy, design, and technology."}'::jsonb,
  '[
    {"icon": "bolt", "value": "120+", "label_translations": {"en": "Projects Delivered"}},
    {"icon": "users", "value": "45+", "label_translations": {"en": "Team Members"}},
    {"icon": "globe", "value": "18", "label_translations": {"en": "Countries Served"}},
    {"icon": "chart", "value": "98%", "label_translations": {"en": "Client Retention"}}
  ]'::jsonb,
  '{"en": "To empower ambitious brands with the strategy, design, and technology they need to dominate their markets."}'::jsonb,
  '{"en": "Founded with a vision to bridge the gap between premium branding and technical execution, Stratifit has grown from a boutique design studio into a full-scale digital agency. Today, we partner with startups and enterprises alike — delivering brand identities, web platforms, AI automation systems, and growth engines that transform how businesses operate and scale."}'::jsonb,
  '[
    {"icon": "sparkles", "title_translations": {"en": "Precision"}, "description_translations": {"en": "Every pixel, every line of code, every strategy — executed with meticulous attention to detail."}},
    {"icon": "bolt", "title_translations": {"en": "Innovation"}, "description_translations": {"en": "We push boundaries with emerging technologies and creative approaches that set you apart."}},
    {"icon": "users", "title_translations": {"en": "Partnership"}, "description_translations": {"en": "We integrate as an extension of your team, aligned with your vision and committed to your success."}},
    {"icon": "chart", "title_translations": {"en": "Results"}, "description_translations": {"en": "We measure everything. Every engagement is tied to real KPIs and tangible business outcomes."}}
  ]'::jsonb,
  '{"en": "We are strategists, designers, engineers, and marketers who share a common obsession: building exceptional digital experiences. Our team brings together decades of combined expertise from top agencies, startups, and Fortune 500 companies — united by a passion for craftsmanship and a commitment to client success."}'::jsonb,
  '{"en": "Ready to Work "}'::jsonb,
  '{"en": "Together?"}'::jsonb,
  '{"en": "Let''s build something exceptional."}'::jsonb,
  '{"en": "Start Your Project"}'::jsonb,
  '/contact',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  intro_translations = EXCLUDED.intro_translations,
  stats = EXCLUDED.stats,
  mission_translations = EXCLUDED.mission_translations,
  story_translations = EXCLUDED.story_translations,
  values = EXCLUDED.values,
  team_translations = EXCLUDED.team_translations,
  cta_title_translations = EXCLUDED.cta_title_translations,
  cta_highlight_translations = EXCLUDED.cta_highlight_translations,
  cta_description_translations = EXCLUDED.cta_description_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP POLICY IF EXISTS "admins can manage about_page" ON public.about_page;
-- DROP POLICY IF EXISTS "public can read visible about_page" ON public.about_page;
-- DROP TRIGGER IF EXISTS set_about_page_updated_at ON public.about_page;
-- DROP TABLE IF EXISTS public.about_page;
