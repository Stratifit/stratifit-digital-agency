-- Migration: 00076_process_new_content
-- Description: Replaces the Process section header description and the four
--              process step titles/descriptions with the approved copy in all
--              four locales. Icons, display order, and visibility flags are
--              left untouched.
-- Stratifit Digital Agency Platform

-- Update the section header description
UPDATE public.section_settings SET
  description_translations = '{"en": "A proven framework that takes you from idea to scale with clarity, efficiency, and predictability.", "de": "Ein bewährter Prozess, der Sie klar, effizient und planbar von der Idee zur Skalierung führt.", "fr": "Une méthode éprouvée qui vous accompagne de l''idée à la croissance avec clarté, efficacité et maîtrise.", "es": "Un método probado que le lleva de la idea al crecimiento de forma clara, eficiente y predecible."}'::jsonb
WHERE section_key = 'process';

-- Step 01 — Discovery
UPDATE public.process_steps SET
  title_translations = '{"en": "Discovery", "de": "Analyse", "fr": "Découverte", "es": "Descubrimiento"}'::jsonb,
  description_translations = '{"en": "We examine your goals, audience, and challenges to establish a clear foundation for every decision.", "de": "Wir analysieren Ihre Ziele, Zielgruppen und Herausforderungen, um eine klare Grundlage für jede Entscheidung zu schaffen.", "fr": "Nous analysons vos objectifs, votre audience et vos défis afin d''établir une base claire pour chaque décision.", "es": "Analizamos sus objetivos, su público y sus desafíos para establecer una base clara para cada decisión."}'::jsonb
WHERE step_key = 'discovery';

-- Step 02 — Strategy
UPDATE public.process_steps SET
  title_translations = '{"en": "Strategy", "de": "Strategie", "fr": "Stratégie", "es": "Estrategia"}'::jsonb,
  description_translations = '{"en": "We create an integrated strategy across brand, web, AI, and growth, aligned with your business objectives.", "de": "Wir entwickeln eine integrierte Strategie für Marke, Web, KI und Wachstum, abgestimmt auf Ihre Geschäftsziele.", "fr": "Nous élaborons une stratégie intégrée couvrant la marque, le web, l''IA et la croissance, en accord avec vos objectifs commerciaux.", "es": "Creamos una estrategia integrada que abarca marca, web, IA y crecimiento, alineada con sus objetivos empresariales."}'::jsonb
WHERE step_key = 'strategy';

-- Step 03 — Build
UPDATE public.process_steps SET
  title_translations = '{"en": "Build", "de": "Umsetzung", "fr": "Réalisation", "es": "Desarrollo"}'::jsonb,
  description_translations = '{"en": "We turn strategy into brand systems, websites, applications, automations, and campaigns, all executed with precision.", "de": "Wir setzen die Strategie in Markensysteme, Websites, Anwendungen, Automatisierungen und Kampagnen um. Dabei arbeiten wir präzise und strukturiert.", "fr": "Nous transformons la stratégie en identités de marque, sites web, applications, automatisations et campagnes, le tout réalisé avec précision.", "es": "Convertimos la estrategia en identidades de marca, sitios web, aplicaciones, automatizaciones y campañas, todo ello ejecutado con precisión."}'::jsonb
WHERE step_key = 'execution';

-- Step 04 — Launch & Grow
UPDATE public.process_steps SET
  title_translations = '{"en": "Launch & Grow", "de": "Launch & Wachstum", "fr": "Lancement et croissance", "es": "Lanzamiento y crecimiento"}'::jsonb,
  description_translations = '{"en": "We launch, measure, and optimize continuously to improve performance and support sustainable growth.", "de": "Wir bringen Ihr Projekt an den Start, messen die Ergebnisse und optimieren kontinuierlich, um die Leistung zu steigern und nachhaltiges Wachstum zu fördern.", "fr": "Nous assurons le lancement, mesurons les résultats et optimisons en continu afin d''améliorer les performances et de soutenir une croissance durable.", "es": "Lanzamos el proyecto, medimos los resultados y optimizamos continuamente para mejorar el rendimiento e impulsar un crecimiento sostenible."}'::jsonb
WHERE step_key = 'growth';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.section_settings SET
--   description_translations = '{"en": "A proven framework that takes you from idea to scale, predictably and efficiently.", "de": "Ein bewährtes Rahmenwerk, das Sie von der Idee bis zur Skalierung führt, vorhersehbar und effizient.", "fr": "Un cadre éprouvé qui vous mène de l''idée à l''échelle, de manière prévisible et efficace.", "es": "Un marco probado que le lleva de la idea a la escala, de forma predecible y eficiente."}'::jsonb
-- WHERE section_key = 'process';
-- UPDATE public.process_steps SET title_translations = '{"en": "Launch & Grow", "de": "Start & Wachstum", "fr": "Lancement & Croissance", "es": "Lanzamiento y crecimiento"}'::jsonb, description_translations = '{"en": "We optimize, scale, and measure everything. Continuous improvement is built into our DNA.", "de": "Wir optimieren, skalieren und messen alles. Kontinuierliche Verbesserung liegt in unserer DNA.", "fr": "Nous optimisons, développons et mesurons tout. L''amélioration continue fait partie de notre ADN.", "es": "Optimizamos, escalamos y medimos todo. La mejora continua está en nuestro ADN."}'::jsonb WHERE step_key = 'growth';
-- UPDATE public.process_steps SET title_translations = '{"en": "Build", "de": "Umsetzung", "fr": "Création", "es": "Construcción"}'::jsonb, description_translations = '{"en": "Our team implements systems, websites, automations, and campaigns with precision engineering.", "de": "Unser Team setzt Systeme, Websites, Automatisierungen und Kampagnen mit präziser Ingenieurskunst um.", "fr": "Notre équipe met en œuvre des systèmes, des sites web, des automatisations et des campagnes avec une ingénierie de précision.", "es": "Nuestro equipo implementa sistemas, sitios web, automatizaciones y campañas con ingeniería de precisión."}'::jsonb WHERE step_key = 'execution';
-- UPDATE public.process_steps SET description_translations = '{"en": "We design a comprehensive plan covering brand, web, AI, and growth, aligned with your revenue targets.", "de": "Wir entwerfen einen umfassenden Plan für Marke, Web, KI und Wachstum, abgestimmt auf Ihre Umsatzziele.", "fr": "Nous concevons un plan complet couvrant la marque, le web, l''IA et la croissance, aligné sur vos objectifs de revenus.", "es": "Diseñamos un plan integral que cubre marca, web, IA y crecimiento, alineado con tus objetivos de ingresos."}'::jsonb WHERE step_key = 'strategy';
-- UPDATE public.process_steps SET description_translations = '{"en": "We dive deep into your business goals, audience, and challenges to build a rock-solid foundation for every decision.", "de": "Wir tauchen tief in Ihre Geschäftsziele, Zielgruppe und Herausforderungen ein, um ein felsenfestes Fundament für jede Entscheidung zu schaffen.", "fr": "Nous plongeons au cœur de vos objectifs, de votre audience et de vos défis pour bâtir une base solide pour chaque décision.", "es": "Nos sumergimos en tus objetivos comerciales, audiencia y desafíos para construir una base sólida para cada decisión."}'::jsonb WHERE step_key = 'discovery';