-- =============================================================================
-- 00082_contact_master_content.sql
-- Contact section — approved copy (STRATIFIT Content Master)
-- Replaces the header title + description in all 4 languages.
-- Eyebrow ("Contact" / "Kontakt" / "Contact" / "Contacto") and highlight
-- (none) are unchanged.
-- =============================================================================

UPDATE public.section_settings
SET title_translations = '{
  "en": "Let''s Talk",
  "de": "Sprechen wir über Ihr Projekt",
  "fr": "Parlons de votre projet",
  "es": "Hablemos de su proyecto"
}'::jsonb,
    description_translations = '{
  "en": "Ready to move your project forward? Tell us about your goals, challenges, and timeline. We''ll respond within one business day.",
  "de": "Möchten Sie Ihr Projekt voranbringen? Erzählen Sie uns von Ihren Zielen, Herausforderungen und Ihrem Zeitrahmen. Wir antworten innerhalb eines Werktages.",
  "fr": "Vous souhaitez faire avancer votre projet ? Présentez-nous vos objectifs, vos défis et votre calendrier. Nous vous répondrons sous un jour ouvré.",
  "es": "¿Está listo para impulsar su proyecto? Cuéntenos sus objetivos, desafíos y plazos. Responderemos en un día laborable."
}'::jsonb
WHERE section_key = 'contact';

-- =============================================================================
-- Rollback (if ever needed):
--
-- UPDATE public.section_settings
-- SET title_translations = '{
--   "en": "Let''s Talk",
--   "de": "Sprechen wir",
--   "fr": "Parlons-en",
--   "es": "Hablemos"
-- }'::jsonb,
--     description_translations = '{
--   "en": "Ready to start your project? Fill out the form and we''ll get back to you within 24 hours.",
--   "de": "Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus, wir melden uns innerhalb von 24 Stunden.",
--   "fr": "Prêt à lancer votre projet ? Remplissez le formulaire et nous vous répondrons sous 24 heures.",
--   "es": "¿Listo para empezar su proyecto? Complete el formulario y le responderemos en 24 horas."
-- }'::jsonb
-- WHERE section_key = 'contact';
-- =============================================================================
