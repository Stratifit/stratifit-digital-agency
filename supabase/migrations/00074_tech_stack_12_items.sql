-- Migration: 00074_tech_stack_12_items
-- Description: Expands the tech-stack section from the original 6 marquee
--              items to the 12 approved Stratifit technologies (AGENTS.md §4).
--              Only overwrites when the row still holds the untouched seed
--              value, so admin-customized lists are left alone.
-- Stratifit Digital Agency Platform

UPDATE public.section_settings
SET tech_stack = '[{"name": "Next.js", "icon": "code"}, {"name": "React", "icon": "atom"}, {"name": "TypeScript", "icon": "code"}, {"name": "Tailwind CSS", "icon": "brush"}, {"name": "Supabase", "icon": "zap"}, {"name": "GSAP", "icon": "zap"}, {"name": "shadcn/ui", "icon": "brush"}, {"name": "Lucide", "icon": "code"}, {"name": "Zod", "icon": "zap"}, {"name": "React Hook Form", "icon": "code"}, {"name": "Vercel", "icon": "atom"}, {"name": "Nodemailer", "icon": "zap"}]'::jsonb
WHERE section_key = 'tech-stack'
  AND tech_stack = '[{"name": "Tailwind CSS", "icon": "brush"}, {"name": "Framer Motion", "icon": "zap"}, {"name": "GSAP", "icon": "zap"}, {"name": "Next.js", "icon": "code"}, {"name": "React", "icon": "atom"}, {"name": "TypeScript", "icon": "code"}]'::jsonb;

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.section_settings
-- SET tech_stack = '[{"name": "Tailwind CSS", "icon": "brush"}, {"name": "Framer Motion", "icon": "zap"}, {"name": "GSAP", "icon": "zap"}, {"name": "Next.js", "icon": "code"}, {"name": "React", "icon": "atom"}, {"name": "TypeScript", "icon": "code"}]'::jsonb
-- WHERE section_key = 'tech-stack'
--   AND jsonb_array_length(tech_stack) = 12;
