-- Description: Add editable brand-guidelines document to portfolio_projects
-- so brand-design case studies can carry their own logo, variants, clearspace
-- rules, colour palette, typography, and UI components (filled from the CMS).

ALTER TABLE public.portfolio_projects
  ADD COLUMN brand_guidelines jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.portfolio_projects.brand_guidelines IS
  'Editable brand-guidelines document for brand-design case studies: logo, logo variants, clearspace rules, colour palette, typography weights, and UI components with icons.';
