-- Dedicated section media for portfolio case studies.
-- Each key stores { main: { media_id, image_url }, thumbnails: [{ media_id, image_url }] }.
ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS case_study_section_media jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.portfolio_projects.case_study_section_media IS
  'Dedicated media per case-study section: overview, discovery, concept, identity-assets, visual-applications, launch, and brand-in-action.';
