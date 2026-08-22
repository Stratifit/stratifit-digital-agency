-- Migration: 00093_service_hero_title_highlight
-- Description: Convert Hero titles on Brand Design, Website Development, and
--              AI & Automation from a single line to the homepage-style two-line
--              hero (white title line + amber highlight line) and slightly
--              expand the descriptions. Growth & Marketing already uses this
--              pattern and is left untouched. All values stay CMS-editable.
-- Stratifit Digital Agency Platform

-- Brand Design
UPDATE public.service_pages
SET
  hero_title_translations = '{
    "en": "Build a brand people recognize",
    "de": "Bauen Sie eine Marke, die man erkennt",
    "fr": "Créez une marque que l’on reconnaît",
    "es": "Cree una marca que la gente reconozca"
  }'::jsonb,
  hero_highlight_translations = '{
    "en": "and trust.",
    "de": "und der man vertraut.",
    "fr": "et en qui l’on a confiance.",
    "es": "y en la que confíen."
  }'::jsonb,
  hero_description_translations = '{
    "en": "We create strategic brand identities that clarify your positioning, build long-lasting credibility, and make your business memorable across every touchpoint.",
    "de": "Wir entwickeln strategische Markenidentitäten, die Ihre Positionierung schärfen, langfristige Glaubwürdigkeit aufbauen und Ihr Unternehmen an jedem Berührungspunkt im Gedächtnis verankern.",
    "fr": "Nous créons des identités de marque stratégiques qui clarifient votre positionnement, renforcent une crédibilité durable et rendent votre entreprise mémorable à chaque point de contact.",
    "es": "Creamos identidades de marca estratégicas que clarifican su posicionamiento, generan credibilidad duradera y hacen que su empresa sea memorable en cada punto de contacto."
  }'::jsonb
WHERE slug = 'brand-design';

-- Website Development
UPDATE public.service_pages
SET
  hero_title_translations = '{
    "en": "Build websites and applications",
    "de": "Websites und Anwendungen bauen",
    "fr": "Créez des sites et applications web",
    "es": "Cree sitios y aplicaciones web"
  }'::jsonb,
  hero_highlight_translations = '{
    "en": "that convert and scale.",
    "de": "die konvertieren und wachsen.",
    "fr": "qui convertissent et évoluent.",
    "es": "que convierten y crecen."
  }'::jsonb,
  hero_description_translations = '{
    "en": "We design and develop websites and web applications engineered for performance, usability, scalability, and conversion — so they support your customers and your growth.",
    "de": "Wir konzipieren und entwickeln Websites und Webanwendungen, die für Leistung, Benutzerfreundlichkeit, Skalierbarkeit und Conversion ausgelegt sind — damit sie Ihre Kunden und Ihr Wachstum unterstützen.",
    "fr": "Nous concevons et développons des sites et applications web pensés pour la performance, la simplicité d’utilisation, l’évolutivité et la conversion — afin qu’ils accompagnent vos clients et votre croissance.",
    "es": "Diseñamos y desarrollamos sitios y aplicaciones web orientados al rendimiento, la facilidad de uso, la escalabilidad y la conversión, para que respalden a sus clientes y su crecimiento."
  }'::jsonb
WHERE slug = 'website-development';

-- AI & Automation
UPDATE public.service_pages
SET
  hero_title_translations = '{
    "en": "Put AI to work",
    "de": "Setzen Sie KI gezielt ein",
    "fr": "Mettez l’IA au service",
    "es": "Ponga la IA a trabajar"
  }'::jsonb,
  hero_highlight_translations = '{
    "en": "across your business.",
    "de": "in Ihrem gesamten Unternehmen.",
    "fr": "de votre entreprise.",
    "es": "en toda su empresa."
  }'::jsonb,
  hero_description_translations = '{
    "en": "We design AI assistants and automated workflows that reduce repetitive work, improve customer communication, and connect your systems — with people in control.",
    "de": "Wir entwickeln KI-Assistenten und automatisierte Abläufe, die wiederkehrende Arbeit reduzieren, die Kundenkommunikation verbessern und Ihre Systeme verbinden — mit den Menschen an der Kontrolle.",
    "fr": "Nous concevons des assistants IA et des processus automatisés qui réduisent les tâches répétitives, améliorent la communication client et connectent vos systèmes — avec un contrôle humain.",
    "es": "Diseñamos asistentes de IA y flujos de trabajo automatizados que reducen las tareas repetitivas, mejoran la comunicación con los clientes y conectan sus sistemas, con el control en manos de las personas."
  }'::jsonb
WHERE slug = 'ai-automation';
