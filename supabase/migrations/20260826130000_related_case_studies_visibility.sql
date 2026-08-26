-- Migration: 20260826130000_related_case_studies_visibility
-- Description: Adds a CMS-controlled visibility setting for the Similar Case
--              Studies section shown on portfolio work detail pages. The
--              section is opt-in and seeded as hidden.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Allow the work-detail section key
-- =============================================================================

ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;

ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check
  CHECK (section_key IN (
    'services',
    'process',
    'why-choose-us',
    'insights',
    'portfolio',
    'testimonials',
    'pricing',
    'faq',
    'acquisition',
    'contact',
    'acquisition-niches',
    'acquisition-cta',
    'tech-stack',
    'related-case-studies'
  ));

-- =============================================================================
-- Seed the opt-in setting
-- =============================================================================

INSERT INTO public.section_settings (
  section_key,
  label,
  eyebrow_translations,
  title_translations,
  highlight_translations,
  description_translations,
  is_visible,
  display_order
)
VALUES (
  'related-case-studies',
  'Similar Case Studies',
  '{"en":"More Work","de":"Weitere Projekte","fr":"Autres projets","es":"Más proyectos"}'::jsonb,
  '{"en":"Similar","de":"Ähnliche","fr":"Études de","es":"Casos de"}'::jsonb,
  '{"en":"Case Studies","de":"Fallstudien","fr":"cas","es":"estudio similares"}'::jsonb,
  '{"en":"Related case studies shown at the end of a work detail page.","de":"Verwandte Fallstudien am Ende einer Projektdetailseite.","fr":"Études de cas similaires affichées à la fin d’une page projet.","es":"Casos de estudio relacionados al final de una página de proyecto."}'::jsonb,
  false,
  100
)
ON CONFLICT (section_key) DO UPDATE SET
  label = EXCLUDED.label,
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DELETE FROM public.section_settings WHERE section_key = 'related-case-studies';
-- ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
-- ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check
--   CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','acquisition','contact','acquisition-niches','acquisition-cta','tech-stack'));
