-- Migration: 00073_announcement_final_copy
-- Description: Replace announcement bar copy with the final two messages
--   (en/de/fr/es) and point the CTA at the contact page.

UPDATE public.announcement_bar SET
  slides = '[
    {"en": "Elevate your digital presence.", "de": "Stärken Sie Ihren digitalen Auftritt.", "fr": "Renforcez votre présence numérique.", "es": "Impulse su presencia digital."},
    {"en": "Now accepting new projects.", "de": "Wir nehmen neue Projekte an.", "fr": "Nous acceptons de nouveaux projets.", "es": "Aceptamos nuevos proyectos."}
  ]'::jsonb,
  message_translations = '{"en": "Elevate your digital presence.", "de": "Stärken Sie Ihren digitalen Auftritt.", "fr": "Renforcez votre présence numérique.", "es": "Impulse su presencia digital."}'::jsonb,
  link_url = '/contact',
  updated_at = now()
WHERE singleton_key = true;
