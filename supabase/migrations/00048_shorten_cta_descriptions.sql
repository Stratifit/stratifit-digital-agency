-- Shorten closing CTA descriptions so the premium CTA card stays compact.
-- Applies to the four service pages and the acquisition-cta section setting.

UPDATE public.service_pages
SET cta_subtitle_translations = '{
  "en": "Free consultation. A clear roadmap for your brand.",
  "de": "Kostenlose Beratung. Eine klare Roadmap für Ihre Marke.",
  "fr": "Consultation gratuite. Une feuille de route claire pour votre marque.",
  "es": "Consulta gratuita. Una hoja de ruta clara para tu marca."
}'::jsonb
WHERE slug = 'brand-design';

UPDATE public.service_pages
SET cta_subtitle_translations = '{
  "en": "A practical path from manual work to intelligent automation.",
  "de": "Ein praktischer Weg von manueller Arbeit zu intelligenter Automatisierung.",
  "fr": "Un chemin concret du travail manuel vers l''automatisation intelligente.",
  "es": "Un camino práctico del trabajo manual a la automatización inteligente."
}'::jsonb
WHERE slug = 'ai-automation';

UPDATE public.service_pages
SET cta_subtitle_translations = '{
  "en": "A clear path from idea to launch.",
  "de": "Ein klarer Weg von der Idee bis zum Launch.",
  "fr": "Un chemin clair de l''idée au lancement.",
  "es": "Un camino claro desde la idea hasta el lanzamiento."
}'::jsonb
WHERE slug = 'website-development';

UPDATE public.service_pages
SET cta_subtitle_translations = '{
  "en": "A clear, measurable growth plan for your brand.",
  "de": "Ein klarer, messbarer Wachstumsplan für Ihre Marke.",
  "fr": "Un plan de croissance clair et mesurable pour votre marque.",
  "es": "Un plan de crecimiento claro y medible para tu marca."
}'::jsonb
WHERE slug = 'growth-marketing';

UPDATE public.section_settings
SET description_translations = '{
  "en": "We''ll guide you from due diligence to transition.",
  "de": "Wir begleiten Sie von der Due Diligence bis zum Übergang.",
  "fr": "Nous vous accompagnons de la due diligence à la transition.",
  "es": "Te guiamos desde la debida diligencia hasta la transición."
}'::jsonb
WHERE section_key = 'acquisition-cta';
