-- Migration: 00026_website_development_service_page
-- Description: Add the Website Development service landing page content.
-- Stratifit Digital Agency Platform

-- Ensure the parent service exists before creating its dedicated landing page.
-- The full editable service content is maintained by the idempotent seed data.
INSERT INTO public.services (
  slug,
  title_translations,
  short_description_translations,
  full_description_translations,
  deliverables_translations,
  icon_name,
  cta_label_translations,
  cta_url,
  display_order,
  is_featured,
  is_visible,
  status
)
VALUES (
  'website-development',
  '{"en":"Website Development","de":"Webentwicklung","fr":"Développement Web","es":"Desarrollo Web"}'::jsonb,
  '{"en":"High-performance websites engineered for speed, scalability, and conversion.","de":"Leistungsstarke Websites für Geschwindigkeit, Skalierbarkeit und Conversion optimiert.","fr":"Sites web haute performance conçus pour la vitesse, la scalabilité et la conversion.","es":"Sitios web de alto rendimiento diseñados para velocidad, escalabilidad y conversión."}'::jsonb,
  '{"en":"From custom business sites to complex web applications, we build digital experiences that perform.","de":"Von individuellen Business-Websites bis hin zu komplexen Webanwendungen erstellen wir digitale Erlebnisse, die funktionieren.","fr":"Des sites d entreprises aux applications web complexes, nous créons des expériences numériques performantes.","es":"Desde sitios empresariales personalizados hasta aplicaciones web complejas, creamos experiencias digitales que funcionan."}'::jsonb,
  '{"en":["Custom Websites","E-commerce","Web Applications","CMS Integration","Multilingual Sites","Performance Optimization","Maintenance"],"de":["Individuelle Websites","E-Commerce","Webanwendungen","CMS-Integration","Mehrsprachige Sites","Performance-Optimierung","Wartung"],"fr":["Sites sur mesure","E-commerce","Applications web","Intégration CMS","Sites multilingues","Optimisation des performances","Maintenance"],"es":["Sitios web personalizados","E-commerce","Aplicaciones web","Integración CMS","Sitios multilingües","Optimización de rendimiento","Mantenimiento"]}'::jsonb,
  'Code',
  '{"en":"Learn More","de":"Mehr erfahren","fr":"En savoir plus","es":"Saber más"}'::jsonb,
  '/services/website-development',
  2,
  true,
  true,
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- Update only the original seed values so later CMS edits remain intact.
UPDATE public.services
SET cta_label_translations = '{"en":"Learn More","de":"Mehr erfahren","fr":"En savoir plus","es":"Saber más"}'::jsonb,
    cta_url = CASE
      WHEN slug = 'website-development' AND cta_url = '/contact'
        THEN '/services/website-development'
      ELSE cta_url
    END,
    updated_at = now()
WHERE
  (slug = 'brand-design' AND cta_label_translations = '{"en":"Start Branding","de":"Branding starten","fr":"Commencer le branding","es":"Iniciar branding"}'::jsonb)
  OR (slug = 'website-development' AND cta_label_translations = '{"en":"Start Development","de":"Entwicklung starten","fr":"Commencer le développement","es":"Iniciar desarrollo"}'::jsonb)
  OR (slug = 'ai-automation' AND cta_label_translations = '{"en":"Explore AI Solutions","de":"KI-Lösungen erkunden","fr":"Découvrir les solutions IA","es":"Explorar soluciones de IA"}'::jsonb)
  OR (slug = 'growth-marketing' AND cta_label_translations = '{"en":"Start Growing","de":"Wachstum starten","fr":"Commencer à grandir","es":"Empezar a crecer"}'::jsonb);

INSERT INTO public.service_pages (
  service_id,
  slug,
  is_visible,
  hero_eyebrow_translations,
  hero_title_translations,
  hero_highlight_translations,
  hero_description_translations,
  hero_stats,
  why_title_translations,
  why_description_translations,
  why_badges,
  capabilities_title_translations,
  capabilities,
  deliverables_title_translations,
  deliverables,
  process_title_translations,
  process,
  toolkit_title_translations,
  toolkit,
  cta_title_translations,
  cta_subtitle_translations,
  cta_button_label_translations
)
SELECT
  s.id,
  'website-development',
  true,
  '{"en":"Website Development Services","de":"Webentwicklungs-Services","fr":"Services de développement web","es":"Servicios de desarrollo web"}'::jsonb,
  '{"en":"Build websites that","de":"Websites entwickeln, die","fr":"Créez des sites qui","es":"Crea sitios web que"}'::jsonb,
  '{"en":"convert and scale.","de":"konvertieren und skalieren.","fr":"convertissent et évoluent.","es":"convierten y crecen."}'::jsonb,
  '{"en":"Scalable, performance-driven digital products engineered with modern technology and UX-first design.","de":"Skalierbare, performance-orientierte digitale Produkte mit moderner Technologie und UX-first-Design.","fr":"Des produits numériques évolutifs et performants, conçus avec des technologies modernes et une approche UX-first.","es":"Productos digitales escalables y orientados al rendimiento, creados con tecnología moderna y diseño centrado en UX."}'::jsonb,
  '[
    {"value":"4","label_translations":{"en":"Core delivery phases","de":"Zentrale Lieferphasen","fr":"Phases de réalisation","es":"Fases principales"}},
    {"value":"3","label_translations":{"en":"Product layers","de":"Produktebenen","fr":"Couches produit","es":"Capas de producto"}},
    {"value":"1","label_translations":{"en":"Scalable foundation","de":"Skalierbare Grundlage","fr":"Fondation évolutive","es":"Base escalable"}}
  ]'::jsonb,
  '{"en":"Why It Matters","de":"Warum es zählt","fr":"Pourquoi c’est important","es":"Por qué importa"}'::jsonb,
  '{"en":"Your website is more than a digital storefront. It should communicate your value clearly, guide visitors toward action, and provide a reliable foundation for the next stage of your business.","de":"Ihre Website ist mehr als eine digitale Visitenkarte. Sie sollte Ihren Wert klar vermitteln, Besucher zur Handlung führen und eine zuverlässige Grundlage für die nächste Wachstumsphase schaffen.","fr":"Votre site est plus qu’une vitrine numérique. Il doit communiquer votre valeur clairement, guider les visiteurs vers l’action et offrir une base fiable pour la prochaine étape de votre activité.","es":"Tu sitio web es más que un escaparate digital. Debe comunicar tu valor con claridad, guiar a los visitantes hacia la acción y ofrecer una base fiable para la siguiente etapa de tu negocio."}'::jsonb,
  '[
    {"value":"0.9s","label_translations":{"en":"Performance mindset","de":"Performance-Fokus","fr":"Culture de la performance","es":"Mentalidad de rendimiento"},"hint_translations":{"en":"speed is designed in from the start","de":"Geschwindigkeit wird von Anfang an eingeplant","fr":"la vitesse est pensée dès le départ","es":"la velocidad se diseña desde el inicio"}},
    {"value":"UX","label_translations":{"en":"Conversion thinking","de":"Conversion-Denken","fr":"Pensée conversion","es":"Pensamiento de conversión"},"hint_translations":{"en":"clear journeys for real users","de":"klare Wege für echte Nutzer","fr":"des parcours clairs pour vos utilisateurs","es":"recorridos claros para usuarios reales"}},
    {"value":"∞","label_translations":{"en":"Built to evolve","de":"Für Weiterentwicklung gebaut","fr":"Pensé pour évoluer","es":"Diseñado para evolucionar"},"hint_translations":{"en":"a foundation that grows with you","de":"eine Grundlage, die mit Ihnen wächst","fr":"une base qui évolue avec vous","es":"una base que crece contigo"}}
  ]'::jsonb,
  '{"en":"Website Services","de":"Website-Leistungen","fr":"Services web","es":"Servicios web"}'::jsonb,
  '[
    {
      "title_translations":{"en":"Custom Websites","de":"Individuelle Websites","fr":"Sites web sur mesure","es":"Sitios web personalizados"},
      "description_translations":{"en":"Bespoke, conversion-focused websites built with modern frameworks for speed, clarity, and long-term flexibility.","de":"Individuelle, conversion-orientierte Websites mit modernen Frameworks für Geschwindigkeit, Klarheit und langfristige Flexibilität.","fr":"Des sites sur mesure orientés conversion, conçus avec des frameworks modernes pour la vitesse, la clarté et la flexibilité.","es":"Sitios personalizados orientados a la conversión, creados con frameworks modernos para velocidad, claridad y flexibilidad."},
      "steps":[
        {"label_translations":{"en":"Discovery","de":"Discovery","fr":"Découverte","es":"Descubrimiento"},"icon":"search"},
        {"label_translations":{"en":"Wireframes","de":"Wireframes","fr":"Wireframes","es":"Wireframes"},"icon":"sketch"},
        {"label_translations":{"en":"Development","de":"Entwicklung","fr":"Développement","es":"Desarrollo"},"icon":"type"},
        {"label_translations":{"en":"Launch","de":"Launch","fr":"Lancement","es":"Lanzamiento"},"icon":"rocket"}
      ]
    },
    {
      "title_translations":{"en":"E-commerce","de":"E-Commerce","fr":"E-commerce","es":"E-commerce"},
      "description_translations":{"en":"Commerce experiences with thoughtful product journeys, reliable checkout flows, and integrations that support growth.","de":"Commerce-Erlebnisse mit durchdachten Produktwegen, zuverlässigen Checkout-Prozessen und Integrationen für Wachstum.","fr":"Des expériences e-commerce avec des parcours produits réfléchis, un paiement fiable et des intégrations conçues pour évoluer.","es":"Experiencias de comercio con recorridos de producto pensados, pagos fiables e integraciones preparadas para crecer."},
      "steps":[
        {"label_translations":{"en":"Platform","de":"Plattform","fr":"Plateforme","es":"Plataforma"},"icon":"box"},
        {"label_translations":{"en":"Architecture","de":"Architektur","fr":"Architecture","es":"Arquitectura"},"icon":"box"},
        {"label_translations":{"en":"Checkout","de":"Checkout","fr":"Paiement","es":"Checkout"},"icon":"final"},
        {"label_translations":{"en":"Optimization","de":"Optimierung","fr":"Optimisation","es":"Optimización"},"icon":"spark"}
      ]
    },
    {
      "title_translations":{"en":"Web Applications","de":"Webanwendungen","fr":"Applications web","es":"Aplicaciones web"},
      "description_translations":{"en":"SaaS platforms, dashboards, and interactive tools engineered around a clear user experience and reliable foundations.","de":"SaaS-Plattformen, Dashboards und interaktive Tools mit klarer Nutzererfahrung und zuverlässiger technischer Grundlage.","fr":"Des plateformes SaaS, dashboards et outils interactifs conçus autour d’une expérience claire et de fondations fiables.","es":"Plataformas SaaS, dashboards y herramientas interactivas diseñadas con una experiencia clara y bases fiables."},
      "steps":[
        {"label_translations":{"en":"UX Research","de":"UX Research","fr":"Recherche UX","es":"Investigación UX"},"icon":"workshop"},
        {"label_translations":{"en":"Prototyping","de":"Prototyping","fr":"Prototypage","es":"Prototipado"},"icon":"pen"},
        {"label_translations":{"en":"Engineering","de":"Engineering","fr":"Ingénierie","es":"Ingeniería"},"icon":"type"},
        {"label_translations":{"en":"Deployment","de":"Deployment","fr":"Déploiement","es":"Despliegue"},"icon":"rocket"}
      ]
    },
    {
      "title_translations":{"en":"CMS Integration","de":"CMS-Integration","fr":"Intégration CMS","es":"Integración CMS"},
      "description_translations":{"en":"Structured content systems that give your team control without compromising performance, consistency, or maintainability.","de":"Strukturierte Content-Systeme, die Ihrem Team Kontrolle geben, ohne Performance, Konsistenz oder Wartbarkeit zu beeinträchtigen.","fr":"Des systèmes de contenu structurés qui donnent le contrôle à votre équipe sans sacrifier performance, cohérence ou maintenabilité.","es":"Sistemas de contenido estructurados que dan control a tu equipo sin comprometer rendimiento, coherencia ni mantenimiento."},
      "steps":[
        {"label_translations":{"en":"Content Model","de":"Content-Modell","fr":"Modèle de contenu","es":"Modelo de contenido"},"icon":"folder"},
        {"label_translations":{"en":"Setup","de":"Einrichtung","fr":"Configuration","es":"Configuración"},"icon":"layout"},
        {"label_translations":{"en":"Customization","de":"Anpassung","fr":"Personnalisation","es":"Personalización"},"icon":"spark"},
        {"label_translations":{"en":"Training","de":"Schulung","fr":"Formation","es":"Formación"},"icon":"book"}
      ]
    }
  ]'::jsonb,
  '{"en":"What’s Included","de":"Was enthalten ist","fr":"Ce qui est inclus","es":"Qué incluye"}'::jsonb,
  '[
    {"title_translations":{"en":"Strategy & UX","de":"Strategie & UX","fr":"Stratégie & UX","es":"Estrategia y UX"},"description_translations":{"en":"Clear goals, user journeys, and a practical direction for the product.","de":"Klare Ziele, Nutzerwege und eine praktikable Richtung für das Produkt.","fr":"Des objectifs clairs, des parcours utilisateurs et une direction concrète.","es":"Objetivos claros, recorridos de usuario y una dirección práctica."},"icon":"spark"},
    {"title_translations":{"en":"Responsive Interface","de":"Responsive Oberfläche","fr":"Interface responsive","es":"Interfaz responsive"},"description_translations":{"en":"A considered experience across mobile, tablet, and desktop.","de":"Eine durchdachte Erfahrung auf Mobile, Tablet und Desktop.","fr":"Une expérience pensée pour mobile, tablette et desktop.","es":"Una experiencia cuidada en móvil, tablet y escritorio."},"icon":"layout"},
    {"title_translations":{"en":"Production Code","de":"Produktionsreifer Code","fr":"Code de production","es":"Código de producción"},"description_translations":{"en":"Typed, maintainable implementation prepared for real-world use.","de":"Typisierte, wartbare Implementierung für den echten Einsatz.","fr":"Une implémentation typée et maintenable, prête pour la production.","es":"Una implementación tipada y mantenible, preparada para producción."},"icon":"type"},
    {"title_translations":{"en":"Launch Support","de":"Launch-Support","fr":"Accompagnement au lancement","es":"Soporte de lanzamiento"},"description_translations":{"en":"QA, deployment guidance, and a clear handover for your team.","de":"QA, Unterstützung beim Deployment und eine klare Übergabe an Ihr Team.","fr":"QA, accompagnement au déploiement et transfert clair à votre équipe.","es":"QA, orientación de despliegue y una entrega clara para tu equipo."},"icon":"rocket"}
  ]'::jsonb,
  '{"en":"How It Works","de":"So funktioniert es","fr":"Comment ça marche","es":"Cómo funciona"}'::jsonb,
  '[
    {"number":1,"title_translations":{"en":"Discovery","de":"Discovery","fr":"Découverte","es":"Descubrimiento"},"description_translations":{"en":"We align on goals, audience, content, and technical requirements.","de":"Wir stimmen Ziele, Zielgruppe, Inhalte und technische Anforderungen ab.","fr":"Nous alignons les objectifs, l’audience, le contenu et les exigences techniques.","es":"Alineamos objetivos, audiencia, contenido y requisitos técnicos."},"icon":"search"},
    {"number":2,"title_translations":{"en":"Design","de":"Design","fr":"Design","es":"Diseño"},"description_translations":{"en":"We shape the information architecture, interface, and interactive direction.","de":"Wir entwickeln Informationsarchitektur, Oberfläche und Interaktionsrichtung.","fr":"Nous définissons l’architecture, l’interface et la direction interactive.","es":"Definimos la arquitectura, la interfaz y la dirección interactiva."},"icon":"pen"},
    {"number":3,"title_translations":{"en":"Development","de":"Entwicklung","fr":"Développement","es":"Desarrollo"},"description_translations":{"en":"We build the experience with performance, accessibility, and maintainability in mind.","de":"Wir entwickeln die Erfahrung mit Fokus auf Performance, Barrierefreiheit und Wartbarkeit.","fr":"Nous développons avec la performance, l’accessibilité et la maintenabilité en tête.","es":"Construimos con rendimiento, accesibilidad y mantenimiento en mente."},"icon":"type"},
    {"number":4,"title_translations":{"en":"Launch","de":"Launch","fr":"Lancement","es":"Lanzamiento"},"description_translations":{"en":"We test, deploy, and hand over a stable foundation ready for its next iteration.","de":"Wir testen, deployen und übergeben eine stabile Grundlage für die nächste Iteration.","fr":"Nous testons, déployons et transmettons une base stable prête pour la suite.","es":"Probamos, desplegamos y entregamos una base estable lista para evolucionar."},"icon":"rocket"}
  ]'::jsonb,
  '{"en":"Tools & Technologies","de":"Tools & Technologien","fr":"Outils & technologies","es":"Herramientas y tecnologías"}'::jsonb,
  '["Next.js","React","TypeScript","Tailwind CSS","Supabase","PostgreSQL","Figma","Vercel"]'::jsonb,
  '{"en":"Let’s build your next digital product.","de":"Lassen Sie uns Ihr nächstes digitales Produkt bauen.","fr":"Construisons votre prochain produit numérique.","es":"Construyamos tu próximo producto digital."}'::jsonb,
  '{"en":"Tell us what you are building and we’ll help shape a clear, practical path from idea to launch.","de":"Erzählen Sie uns, was Sie bauen möchten, und wir entwickeln gemeinsam einen klaren, praktikablen Weg von der Idee bis zum Launch.","fr":"Parlez-nous de votre projet et nous vous aiderons à tracer un chemin clair et concret, de l’idée au lancement.","es":"Cuéntanos qué estás construyendo y te ayudaremos a definir un camino claro y práctico desde la idea hasta el lanzamiento."}'::jsonb,
  '{"en":"Start Your Web Project","de":"Webprojekt starten","fr":"Démarrer votre projet web","es":"Iniciar tu proyecto web"}'::jsonb
FROM public.services AS s
WHERE s.slug = 'website-development'
ON CONFLICT (slug) DO UPDATE SET
  service_id = EXCLUDED.service_id,
  is_visible = EXCLUDED.is_visible,
  hero_eyebrow_translations = EXCLUDED.hero_eyebrow_translations,
  hero_title_translations = EXCLUDED.hero_title_translations,
  hero_highlight_translations = EXCLUDED.hero_highlight_translations,
  hero_description_translations = EXCLUDED.hero_description_translations,
  hero_stats = EXCLUDED.hero_stats,
  why_title_translations = EXCLUDED.why_title_translations,
  why_description_translations = EXCLUDED.why_description_translations,
  why_badges = EXCLUDED.why_badges,
  capabilities_title_translations = EXCLUDED.capabilities_title_translations,
  capabilities = EXCLUDED.capabilities,
  deliverables_title_translations = EXCLUDED.deliverables_title_translations,
  deliverables = EXCLUDED.deliverables,
  process_title_translations = EXCLUDED.process_title_translations,
  process = EXCLUDED.process,
  toolkit_title_translations = EXCLUDED.toolkit_title_translations,
  toolkit = EXCLUDED.toolkit,
  cta_title_translations = EXCLUDED.cta_title_translations,
  cta_subtitle_translations = EXCLUDED.cta_subtitle_translations,
  cta_button_label_translations = EXCLUDED.cta_button_label_translations,
  updated_at = now();

-- The public services card uses the localized Learn More label while retaining
-- each service's existing destination and the /services/[slug] route.
