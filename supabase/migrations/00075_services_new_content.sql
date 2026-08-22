-- Migration: 00075_services_new_content
-- Description: Replaces the services seed content with the approved copy:
--              new titles, short descriptions, and key deliverables for the
--              four services (Brand Design, Web Development, AI & Automation,
--              Growth & Marketing). Only the card-facing fields are touched;
--              full descriptions, CTAs, icons, and flags stay as-is.
-- Stratifit Digital Agency Platform

UPDATE public.services SET
  title_translations = '{"en": "Brand Design", "de": "Markendesign", "fr": "Design de marque", "es": "Diseño de marca"}'::jsonb,
  short_description_translations = '{"en": "Distinctive brand systems designed to build credibility, sharpen your positioning, and make your business memorable.", "de": "Unverwechselbare Markensysteme, die Vertrauen schaffen, Ihre Positionierung schärfen und Ihre Marke im Gedächtnis verankern.", "fr": "Des identités de marque distinctives conçues pour renforcer votre crédibilité, affirmer votre positionnement et rendre votre entreprise mémorable.", "es": "Identidades de marca distintivas diseñadas para reforzar su credibilidad, definir su posicionamiento y hacer que su empresa sea memorable."}'::jsonb,
  deliverables_translations = '{"en": ["Brand Strategy", "Logo Design", "Visual Identity System", "Color & Typography System"], "de": ["Markenstrategie", "Logodesign", "Visuelles Markensystem", "Farb- und Typografiesystem"], "fr": ["Stratégie de marque", "Création de logo", "Système d''identité visuelle", "Palette de couleurs et typographie"], "es": ["Estrategia de marca", "Diseño de logotipo", "Sistema de identidad visual", "Sistema de color y tipografía"]}'::jsonb
WHERE slug = 'brand-design';

UPDATE public.services SET
  title_translations = '{"en": "Web Development", "de": "Webentwicklung", "fr": "Développement web", "es": "Desarrollo web"}'::jsonb,
  short_description_translations = '{"en": "High-performance websites and web applications engineered for speed, scalability, and conversion.", "de": "Leistungsstarke Websites und Webanwendungen, optimiert für Geschwindigkeit, Skalierbarkeit und hohe Conversion-Raten.", "fr": "Des sites et applications web performants, optimisés pour la rapidité, l''évolutivité et la conversion.", "es": "Sitios y aplicaciones web de alto rendimiento, diseñados para ofrecer velocidad, escalabilidad y altas tasas de conversión."}'::jsonb,
  deliverables_translations = '{"en": ["Custom Websites", "E-commerce Solutions", "Web Applications", "CMS Integration"], "de": ["Individuelle Websites", "E-Commerce-Lösungen", "Webanwendungen", "CMS-Integration"], "fr": ["Sites web sur mesure", "Solutions e-commerce", "Applications web", "Intégration CMS"], "es": ["Sitios web a medida", "Soluciones de comercio electrónico", "Aplicaciones web", "Integración de CMS"]}'::jsonb
WHERE slug = 'website-development';

UPDATE public.services SET
  title_translations = '{"en": "AI & Automation", "de": "KI & Automatisierung", "fr": "IA et automatisation", "es": "IA y automatización"}'::jsonb,
  short_description_translations = '{"en": "Intelligent systems that automate repetitive work, improve customer communication, and boost operational efficiency.", "de": "Intelligente Systeme, die wiederkehrende Aufgaben automatisieren, die Kundenkommunikation verbessern und Abläufe effizienter gestalten.", "fr": "Des systèmes intelligents qui automatisent les tâches répétitives, améliorent la communication client et renforcent l''efficacité opérationnelle.", "es": "Sistemas inteligentes que automatizan tareas repetitivas, mejoran la comunicación con los clientes y aumentan la eficiencia operativa."}'::jsonb,
  deliverables_translations = '{"en": ["AI Chatbots & Assistants", "Customer Support Automation", "Lead Qualification", "Workflow Automation"], "de": ["KI-Chatbots und -Assistenten", "Automatisierung im Kundenservice", "Lead-Qualifizierung", "Workflow-Automatisierung"], "fr": ["Chatbots et assistants IA", "Automatisation du service client", "Qualification des prospects", "Automatisation des processus"], "es": ["Chatbots y asistentes de IA", "Automatización de la atención al cliente", "Cualificación de clientes potenciales", "Automatización de flujos de trabajo"]}'::jsonb
WHERE slug = 'ai-automation';

UPDATE public.services SET
  title_translations = '{"en": "Growth & Marketing", "de": "Wachstum & Marketing", "fr": "Croissance et marketing", "es": "Crecimiento y marketing"}'::jsonb,
  short_description_translations = '{"en": "Data-driven strategies designed to increase visibility, attract qualified audiences, and drive measurable growth.", "de": "Datenbasierte Strategien, die Ihre Sichtbarkeit erhöhen, qualifizierte Zielgruppen erreichen und messbares Wachstum fördern.", "fr": "Des stratégies fondées sur les données pour accroître votre visibilité, atteindre des audiences qualifiées et générer une croissance mesurable.", "es": "Estrategias basadas en datos para aumentar su visibilidad, atraer audiencias cualificadas e impulsar un crecimiento medible."}'::jsonb,
  deliverables_translations = '{"en": ["SEO", "SEM", "Performance Marketing", "Content Strategy"], "de": ["Suchmaschinenoptimierung (SEO)", "Suchmaschinenmarketing (SEM)", "Performance-Marketing", "Content-Strategie"], "fr": ["Référencement naturel (SEO)", "Référencement payant (SEA)", "Marketing à la performance", "Stratégie de contenu"], "es": ["Optimización para buscadores (SEO)", "Marketing en buscadores (SEM)", "Marketing de resultados", "Estrategia de contenidos"]}'::jsonb
WHERE slug = 'growth-marketing';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.services SET
--   title_translations = '{"en": "Brand Design", "de": "Markengestaltung", "fr": "Design de Marque", "es": "Diseño de Marca"}'::jsonb,
--   short_description_translations = '{"en": "Distinctive brand identities that communicate credibility and strategic positioning.", "de": "Einzigartige Markenidentitäten, die Glaubwürdigkeit und strategische Positionierung vermitteln.", "fr": "Identités de marque distinctives qui communiquent crédibilité et positionnement stratégique.", "es": "Identidades de marca distintivas que comunican credibilidad y posicionamiento estratégico."}'::jsonb
-- WHERE slug = 'brand-design';
-- UPDATE public.services SET
--   title_translations = '{"en": "Website Development", "de": "Webentwicklung", "fr": "Développement Web", "es": "Desarrollo Web"}'::jsonb
-- WHERE slug = 'website-development';
-- UPDATE public.services SET
--   title_translations = '{"en": "AI & Automation", "de": "KI & Automatisierung", "fr": "IA & Automatisation", "es": "IA y Automatización"}'::jsonb
-- WHERE slug = 'ai-automation';
-- UPDATE public.services SET
--   title_translations = '{"en": "Growth & Marketing", "de": "Growth & Marketing", "fr": "Croissance & Marketing", "es": "Crecimiento y Marketing"}'::jsonb
-- WHERE slug = 'growth-marketing';
