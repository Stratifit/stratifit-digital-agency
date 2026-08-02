-- Migration: 00021_hero_tech_stack
-- Description: Editable tech stack marquee content for the hero section.
-- Stratifit Digital Agency Platform

ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS tech_stack jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS tech_stack_heading_translations jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS tech_stack_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.hero SET
  tech_stack = '[{"name": "Tailwind CSS", "icon": "brush"}, {"name": "Framer Motion", "icon": "zap"}, {"name": "GSAP", "icon": "zap"}, {"name": "Next.js", "icon": "code"}, {"name": "React", "icon": "atom"}, {"name": "TypeScript", "icon": "code"}]'::jsonb,
  tech_stack_heading_translations = '{"en": "Our Tech Stack", "de": "Unser Tech-Stack", "fr": "Notre stack technique", "es": "Nuestro stack tecnológico"}'::jsonb,
  tech_stack_description_translations = '{"en": "We build with trusted, modern technologies.", "de": "Wir bauen mit vertrauenswürdigen, modernen Technologien.", "fr": "Nous construisons avec des technologies modernes et éprouvées.", "es": "Construimos con tecnologías modernas y confiables."}'::jsonb
WHERE singleton_key = true;

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.hero DROP COLUMN IF EXISTS tech_stack;
-- ALTER TABLE public.hero DROP COLUMN IF EXISTS tech_stack_heading_translations;
-- ALTER TABLE public.hero DROP COLUMN IF EXISTS tech_stack_description_translations;
