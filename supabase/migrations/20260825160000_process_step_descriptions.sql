-- Migration: 20260825160000_process_step_descriptions
-- Description: Replaces the four process step descriptions with the approved
--              rollout-mock copy in all four locales. Titles, icons, display
--              order, and visibility are left untouched.
-- Stratifit Digital Agency Platform

-- Step 01 — Discovery
UPDATE public.process_steps SET
  description_translations = '{"en": "Goals, audience and challenges form our core foundation.", "de": "Ziele, Zielgruppe und Herausforderungen bilden unser Fundament.", "fr": "Les objectifs, l''audience et les défis constituent notre socle.", "es": "Los objetivos, el público y los desafíos forman nuestra base."}'::jsonb
WHERE step_key = 'discovery';

-- Step 02 — Strategy
UPDATE public.process_steps SET
  description_translations = '{"en": "Map tactical steps to achieve clarity and direction.", "de": "Taktische Schritte festlegen, um Klarheit und Richtung zu schaffen.", "fr": "Planifier des étapes tactiques pour gagner en clarté et en direction.", "es": "Trazar pasos tácticos para lograr claridad y dirección."}'::jsonb
WHERE step_key = 'strategy';

-- Step 03 — Build
UPDATE public.process_steps SET
  description_translations = '{"en": "Brand systems, identity assets & visual applications.", "de": "Markensysteme, Identitäts-Assets und visuelle Anwendungen.", "fr": "Systèmes de marque, actifs d''identité et applications visuelles.", "es": "Sistemas de marca, activos de identidad y aplicaciones visuales."}'::jsonb
WHERE step_key = 'execution';

-- Step 04 — Launch
UPDATE public.process_steps SET
  description_translations = '{"en": "Rolling out the brand across all touchpoints.", "de": "Die Marke über alle Touchpoints hinweg ausrollen.", "fr": "Déployer la marque sur l''ensemble des points de contact.", "es": "Desplegar la marca en todos los puntos de contacto."}'::jsonb
WHERE step_key = 'growth';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.process_steps SET description_translations = '{"en": "We examine your goals, audience, and challenges to establish a clear foundation for every decision.", "de": "Wir analysieren Ihre Ziele, Zielgruppen und Herausforderungen, um eine klare Grundlage für jede Entscheidung zu schaffen.", "fr": "Nous analysons vos objectifs, votre audience et vos défis afin d''établir une base claire pour chaque décision.", "es": "Analizamos sus objetivos, su público y sus desafíos para establecer una base clara para cada decisión."}'::jsonb WHERE step_key = 'discovery';
-- UPDATE public.process_steps SET description_translations = '{"en": "We create an integrated strategy across brand, web, AI, and growth, aligned with your business objectives.", "de": "Wir entwickeln eine integrierte Strategie für Marke, Web, KI und Wachstum, abgestimmt auf Ihre Geschäftsziele.", "fr": "Nous élaborons une stratégie intégrée couvrant la marque, le web, l''IA et la croissance, en accord avec vos objectifs commerciaux.", "es": "Creamos una estrategia integrada que abarca marca, web, IA y crecimiento, alineada con sus objetivos empresariales."}'::jsonb WHERE step_key = 'strategy';
-- UPDATE public.process_steps SET description_translations = '{"en": "We turn strategy into brand systems, websites, applications, automations, and campaigns, all executed with precision.", "de": "Wir setzen die Strategie in Markensysteme, Websites, Anwendungen, Automatisierungen und Kampagnen um. Dabei arbeiten wir präzise und strukturiert.", "fr": "Nous transformons la stratégie en identités de marque, sites web, applications, automatisations et campagnes, le tout réalisé avec précision.", "es": "Convertimos la estrategia en identidades de marca, sitios web, aplicaciones, automatizaciones y campañas, todo ello ejecutado con precisión."}'::jsonb WHERE step_key = 'execution';
-- UPDATE public.process_steps SET description_translations = '{"en": "We launch, measure, and optimize continuously to improve performance and support sustainable growth.", "de": "Wir bringen Ihr Projekt an den Start, messen die Ergebnisse und optimieren kontinuierlich, um die Leistung zu steigern und nachhaltiges Wachstum zu fördern.", "fr": "Nous assurons le lancement, mesurons les résultats et optimisons en continu afin d''améliorer les performances et de soutenir une croissance durable.", "es": "Lanzamos el proyecto, medimos los resultados y optimizamos continuamente para mejorar el rendimiento e impulsar un crecimiento sostenible."}'::jsonb WHERE step_key = 'growth';
