-- Migration: 00057_tech_stack_section
-- Description: Moves the hero tech-stack marquee into its own CMS-editable
--              homepage section placed between the hero and Services. Adds a
--              jsonb tech_stack column to section_settings, admits the
--              'tech-stack' section_key, and seeds the row with the marquee
--              items that previously lived on the hero singleton.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Schema
-- =============================================================================

ALTER TABLE public.section_settings ADD COLUMN IF NOT EXISTS tech_stack jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.section_settings.tech_stack IS 'Tech-stack marquee items ({name, icon}) for the tech-stack section.';

ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;

ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check
  CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','acquisition','contact','acquisition-niches','acquisition-cta','tech-stack'));

-- =============================================================================
-- Seed (idempotent)
-- =============================================================================

INSERT INTO public.section_settings
  (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, tech_stack, is_visible, display_order)
VALUES (
  'tech-stack',
  'Tech Stack',
  '{"en": "", "de": "", "fr": "", "es": ""}'::jsonb,
  '{"en": "Our", "de": "Unser", "fr": "Notre", "es": "Nuestro"}'::jsonb,
  '{"en": "Tech Stack", "de": "Tech-Stack", "fr": "stack technique", "es": "stack tecnológico"}'::jsonb,
  '{"en": "We build with trusted, modern technologies.", "de": "Wir bauen mit vertrauenswürdigen, modernen Technologien.", "fr": "Nous construisons avec des technologies modernes et éprouvées.", "es": "Construimos con tecnologías modernas y confiables."}'::jsonb,
  '[{"name": "Next.js", "icon": "code"}, {"name": "React", "icon": "atom"}, {"name": "TypeScript", "icon": "code"}, {"name": "Tailwind CSS", "icon": "brush"}, {"name": "Supabase", "icon": "zap"}, {"name": "GSAP", "icon": "zap"}, {"name": "shadcn/ui", "icon": "brush"}, {"name": "Lucide", "icon": "code"}, {"name": "Zod", "icon": "zap"}, {"name": "React Hook Form", "icon": "code"}, {"name": "Vercel", "icon": "atom"}, {"name": "Nodemailer", "icon": "zap"}]'::jsonb,
  true,
  5
)
ON CONFLICT (section_key) DO UPDATE SET
  label = EXCLUDED.label,
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  tech_stack = EXCLUDED.tech_stack,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DELETE FROM public.section_settings WHERE section_key = 'tech-stack';
-- ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
-- ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check
--   CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','acquisition','contact','acquisition-niches','acquisition-cta'));
-- ALTER TABLE public.section_settings DROP COLUMN IF EXISTS tech_stack;
