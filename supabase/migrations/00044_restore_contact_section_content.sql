-- Migration: 00044_restore_contact_section_content
-- Description: Restores the Contact section header title ("Let's Talk") and
--              description when the section_settings.contact row has empty
--              translations. The eyebrow renders from eyebrow_translations even
--              when title/description are blank, which made the header look
--              broken (empty <h2>, missing description). This migration
--              re-seeds the missing fields in all 4 languages without touching
--              any manually-overridden translations that are already present.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Restore missing Contact title + description (idempotent)
-- =============================================================================

-- Title: fill only when the stored translations have no usable value.
UPDATE public.section_settings
SET title_translations = '{"en":"Let''s Talk","de":"Sprechen wir","fr":"Parlons-en","es":"Hablemos"}'::jsonb
WHERE section_key = 'contact'
  AND (
    title_translations IS NULL
    OR title_translations = '{}'::jsonb
    OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(title_translations) WHERE btrim(value) <> '')
  );

-- Description: fill only when the stored translations have no usable value.
UPDATE public.section_settings
SET description_translations = '{"en":"Ready to start your project? Fill out the form and we''ll get back to you within 24 hours.","de":"Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus – wir melden uns innerhalb von 24 Stunden.","fr":"Prêt à lancer votre projet ? Remplissez le formulaire et nous vous répondrons sous 24 heures.","es":"¿Listo para empezar su proyecto? Complete el formulario y le responderemos en 24 horas."}'::jsonb
WHERE section_key = 'contact'
  AND (
    description_translations IS NULL
    OR description_translations = '{}'::jsonb
    OR NOT EXISTS (SELECT 1 FROM jsonb_each_text(description_translations) WHERE btrim(value) <> '')
  );

-- =============================================================================
-- Rollback
-- =============================================================================
-- No destructive change is made (only empty translations are replaced), so no
-- rollback is required.
