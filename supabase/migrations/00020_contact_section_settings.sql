-- Migration: 00020_contact_section_settings
-- Description: Contact section heading (Let's Talk) in section_settings.
-- Stratifit Digital Agency Platform

ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','final-cta','trusted-by','acquisition','contact'));

INSERT INTO public.section_settings (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, is_visible, display_order)
VALUES (
  'contact',
  'Contact',
  '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb,
  '{"en": "Let''s Talk", "de": "Sprechen wir", "fr": "Parlons-en", "es": "Hablemos"}'::jsonb,
  '{}'::jsonb,
  '{"en": "Ready to start your project? Fill out the form and we''ll get back to you within 24 hours.", "de": "Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus – wir melden uns innerhalb von 24 Stunden.", "fr": "Prêt à lancer votre projet ? Remplissez le formulaire et nous vous répondrons sous 24 heures.", "es": "¿Listo para empezar su proyecto? Complete el formulario y le responderemos en 24 horas."}'::jsonb,
  true,
  95
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
-- ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
-- ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','final-cta','trusted-by','acquisition'));
-- DELETE FROM public.section_settings WHERE section_key = 'contact';
