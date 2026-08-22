-- Migration: 00087_website_development_master_content
-- Description: Replace the Website Development service page with the approved
--              master content in all 4 languages. Removes the unverified
--              numeric claims (0.9s, 4 / 3 / 1) in favour of qualitative value
--              statements, per the content rules.
-- Stratifit Digital Agency Platform

UPDATE public.service_pages
SET
  hero_eyebrow_translations = '{
    "en": "Web Development",
    "de": "Webentwicklung",
    "fr": "Développement web",
    "es": "Desarrollo web"
  }'::jsonb,
  hero_title_translations = '{
    "en": "Build websites and applications that convert and scale.",
    "de": "Websites und Anwendungen, die Kunden überzeugen und mit Ihrem Unternehmen wachsen.",
    "fr": "Créez des sites et applications web qui convertissent et évoluent avec votre entreprise.",
    "es": "Cree sitios y aplicaciones web diseñados para convertir y crecer con su empresa."
  }'::jsonb,
  hero_highlight_translations = '{}'::jsonb,
  hero_description_translations = '{
    "en": "We design and develop websites and web applications engineered for performance, usability, scalability, and conversion.",
    "de": "Wir konzipieren und entwickeln Websites und Webanwendungen für Leistung, Benutzerfreundlichkeit, Skalierbarkeit und Conversion.",
    "fr": "Nous concevons et développons des sites et applications web pensés pour la performance, la simplicité d’utilisation, l’évolutivité et la conversion.",
    "es": "Diseñamos y desarrollamos sitios y aplicaciones web orientados al rendimiento, la facilidad de uso, la escalabilidad y la conversión."
  }'::jsonb,
  hero_stats = '[
    {
      "value": "",
      "label_translations": {
        "en": "Strategy and UX",
        "de": "Strategie und UX",
        "fr": "Stratégie et UX",
        "es": "Estrategia y UX"
      },
      "description_translations": {
        "en": "Clear business goals and user journeys guide every product decision.",
        "de": "Klare Geschäftsziele und Nutzerwege bestimmen jede Produktentscheidung.",
        "fr": "Des objectifs commerciaux et des parcours utilisateurs clairs guident chaque décision produit.",
        "es": "Los objetivos empresariales y los recorridos de usuario guían cada decisión del producto."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Production Ready",
        "de": "Produktionsreif",
        "fr": "Prêt pour la production",
        "es": "Listo para producción"
      },
      "description_translations": {
        "en": "Reliable, maintainable implementation prepared for real-world use.",
        "de": "Eine zuverlässige und wartbare Umsetzung für den realen Einsatz.",
        "fr": "Une réalisation fiable et maintenable, conçue pour une utilisation réelle.",
        "es": "Una implementación fiable y mantenible, preparada para un uso real."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Built to Scale",
        "de": "Skalierbar aufgebaut",
        "fr": "Conçu pour évoluer",
        "es": "Diseñado para crecer"
      },
      "description_translations": {
        "en": "A flexible technical foundation that can evolve with your business.",
        "de": "Eine flexible technische Grundlage, die sich mit Ihrem Unternehmen weiterentwickeln kann.",
        "fr": "Une base technique flexible capable d’accompagner le développement de votre entreprise.",
        "es": "Una base técnica flexible que puede evolucionar con su empresa."
      }
    }
  ]'::jsonb,
  why_title_translations = '{
    "en": "Why It Matters",
    "de": "Warum es wichtig ist",
    "fr": "Pourquoi est-ce important ?",
    "es": "Por qué es importante"
  }'::jsonb,
  why_description_translations = '{
    "en": "Your website is a business system, not simply a digital storefront. It should communicate your value clearly, help users complete important actions, connect with your operations, and remain reliable as your business evolves.",
    "de": "Ihre Website ist ein Geschäftssystem und nicht nur ein digitaler Auftritt. Sie sollte Ihren Wert klar vermitteln, Nutzer bei wichtigen Handlungen unterstützen, sich in Ihre Abläufe integrieren und auch bei wachsendem Bedarf zuverlässig funktionieren.",
    "fr": "Votre site web est un véritable outil pour votre entreprise, et non une simple vitrine numérique. Il doit communiquer clairement votre valeur, aider les utilisateurs à accomplir des actions importantes, s’intégrer à vos opérations et rester fiable à mesure que votre entreprise évolue.",
    "es": "Su sitio web es un sistema empresarial, no solo un escaparate digital. Debe comunicar claramente su valor, ayudar a los usuarios a completar acciones importantes, integrarse con sus operaciones y seguir siendo fiable a medida que su empresa evoluciona."
  }'::jsonb,
  why_badges = '[
    {
      "value": "",
      "label_translations": {
        "en": "Performance by Design",
        "de": "Leistung von Anfang an",
        "fr": "Performance intégrée dès la conception",
        "es": "Rendimiento desde el diseño"
      },
      "description_translations": {
        "en": "Architecture, code, media, and infrastructure are planned with speed and reliability in mind from the beginning.",
        "de": "Architektur, Code, Medien und Infrastruktur werden von Beginn an mit Blick auf Geschwindigkeit und Zuverlässigkeit geplant.",
        "fr": "L’architecture, le code, les médias et l’infrastructure sont pensés dès le départ pour favoriser la rapidité et la fiabilité.",
        "es": "La arquitectura, el código, los recursos multimedia y la infraestructura se planifican desde el principio pensando en la velocidad y la fiabilidad."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Clear User Journeys",
        "de": "Klare Nutzerwege",
        "fr": "Parcours utilisateurs clairs",
        "es": "Recorridos de usuario claros"
      },
      "description_translations": {
        "en": "Content, navigation, and interactions guide users toward meaningful actions without unnecessary friction.",
        "de": "Inhalte, Navigation und Interaktionen führen Nutzer ohne unnötige Hürden zu relevanten Handlungen.",
        "fr": "Le contenu, la navigation et les interactions orientent les utilisateurs vers des actions utiles sans complexité inutile.",
        "es": "El contenido, la navegación y las interacciones guían a los usuarios hacia acciones relevantes sin dificultades innecesarias."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Scalable Architecture",
        "de": "Skalierbare Architektur",
        "fr": "Architecture évolutive",
        "es": "Arquitectura escalable"
      },
      "description_translations": {
        "en": "Flexible systems, structured content, and maintainable code make future improvements and integrations easier.",
        "de": "Flexible Systeme, strukturierte Inhalte und wartbarer Code erleichtern zukünftige Erweiterungen und Integrationen.",
        "fr": "Des systèmes flexibles, un contenu structuré et un code maintenable facilitent les améliorations et les intégrations futures.",
        "es": "Los sistemas flexibles, el contenido estructurado y el código mantenible facilitan futuras mejoras e integraciones."
      }
    }
  ]'::jsonb,
  capabilities_title_translations = '{
    "en": "Web Solutions Built Around Your Business",
    "de": "Weblösungen für Ihr Unternehmen",
    "fr": "Des solutions web adaptées à votre entreprise",
    "es": "Soluciones web adaptadas a su empresa"
  }'::jsonb,
  capabilities_description_translations = '{
    "en": "From focused business websites to advanced applications, every solution is shaped around your users, operations, and growth objectives.",
    "de": "Von fokussierten Unternehmenswebsites bis zu anspruchsvollen Anwendungen wird jede Lösung auf Ihre Nutzer, Abläufe und Wachstumsziele abgestimmt.",
    "fr": "Du site professionnel ciblé à l’application avancée, chaque solution est conçue autour de vos utilisateurs, de vos opérations et de vos objectifs de croissance.",
    "es": "Desde sitios corporativos especializados hasta aplicaciones avanzadas, cada solución se diseña en función de sus usuarios, operaciones y objetivos de crecimiento."
  }'::jsonb,
  capabilities = '[
    {
      "title_translations": {
        "en": "Custom Websites",
        "de": "Individuelle Websites",
        "fr": "Sites web sur mesure",
        "es": "Sitios web a medida"
      },
      "description_translations": {
        "en": "Purpose-built websites designed for clarity, conversion, performance, and long-term flexibility.",
        "de": "Maßgeschneiderte Websites für Klarheit, Conversion, Leistung und langfristige Flexibilität.",
        "fr": "Des sites conçus spécifiquement pour offrir clarté, conversion, performance et flexibilité à long terme.",
        "es": "Sitios desarrollados específicamente para ofrecer claridad, conversión, rendimiento y flexibilidad a largo plazo."
      },
      "steps": [
        {"label_translations": {"en": "Discovery", "de": "Analyse", "fr": "Découverte", "es": "Descubrimiento"}, "icon": "search"},
        {"label_translations": {"en": "Information Architecture", "de": "Informationsarchitektur", "fr": "Architecture de l’information", "es": "Arquitectura de la información"}, "icon": "grid"},
        {"label_translations": {"en": "Interface Design", "de": "Interface-Design", "fr": "Conception de l’interface", "es": "Diseño de interfaces"}, "icon": "pen"},
        {"label_translations": {"en": "Development and Launch", "de": "Entwicklung und Launch", "fr": "Développement et lancement", "es": "Desarrollo y lanzamiento"}, "icon": "rocket"}
      ]
    },
    {
      "title_translations": {
        "en": "E-commerce Solutions",
        "de": "E-Commerce-Lösungen",
        "fr": "Solutions e-commerce",
        "es": "Soluciones de comercio electrónico"
      },
      "description_translations": {
        "en": "Commerce experiences with clear product journeys, reliable checkout flows, and integrations designed to support efficient growth.",
        "de": "Durchdachte Einkaufserlebnisse mit klaren Produktwegen, zuverlässigen Checkout-Prozessen und wachstumsfähigen Integrationen.",
        "fr": "Des expériences commerciales offrant des parcours produits clairs, des paiements fiables et des intégrations conçues pour accompagner la croissance.",
        "es": "Experiencias de compra con recorridos de producto claros, procesos de pago fiables e integraciones diseñadas para apoyar el crecimiento."
      },
      "steps": [
        {"label_translations": {"en": "Platform Selection", "de": "Plattformauswahl", "fr": "Sélection de la plateforme", "es": "Selección de la plataforma"}, "icon": "globe"},
        {"label_translations": {"en": "Store Architecture", "de": "Shop-Architektur", "fr": "Architecture de la boutique", "es": "Arquitectura de la tienda"}, "icon": "grid"},
        {"label_translations": {"en": "Checkout Experience", "de": "Checkout-Erlebnis", "fr": "Expérience de paiement", "es": "Experiencia de pago"}, "icon": "key"},
        {"label_translations": {"en": "Testing and Optimization", "de": "Tests und Optimierung", "fr": "Tests et optimisation", "es": "Pruebas y optimización"}, "icon": "chart"}
      ]
    },
    {
      "title_translations": {
        "en": "Web Applications",
        "de": "Webanwendungen",
        "fr": "Applications web",
        "es": "Aplicaciones web"
      },
      "description_translations": {
        "en": "SaaS platforms, dashboards, portals, and interactive tools engineered around clear user needs and reliable technical foundations.",
        "de": "SaaS-Plattformen, Dashboards, Portale und interaktive Tools auf Basis klarer Nutzeranforderungen und zuverlässiger technischer Grundlagen.",
        "fr": "Des plateformes SaaS, tableaux de bord, portails et outils interactifs conçus autour de besoins utilisateurs précis et de bases techniques fiables.",
        "es": "Plataformas SaaS, paneles, portales y herramientas interactivas desarrollados en torno a necesidades claras de los usuarios y bases técnicas fiables."
      },
      "steps": [
        {"label_translations": {"en": "Product Discovery", "de": "Produktanalyse", "fr": "Découverte produit", "es": "Descubrimiento del producto"}, "icon": "search"},
        {"label_translations": {"en": "UX Prototyping", "de": "UX-Prototyping", "fr": "Prototypage UX", "es": "Prototipado UX"}, "icon": "pen"},
        {"label_translations": {"en": "Application Engineering", "de": "Anwendungsentwicklung", "fr": "Développement de l’application", "es": "Desarrollo de la aplicación"}, "icon": "database"},
        {"label_translations": {"en": "Deployment and Iteration", "de": "Deployment und Weiterentwicklung", "fr": "Déploiement et amélioration", "es": "Despliegue y mejora"}, "icon": "rocket"}
      ]
    },
    {
      "title_translations": {
        "en": "CMS Integration",
        "de": "CMS-Integration",
        "fr": "Intégration CMS",
        "es": "Integración de CMS"
      },
      "description_translations": {
        "en": "Structured content systems that give your team control without compromising performance, consistency, or maintainability.",
        "de": "Strukturierte Content-Systeme, die Ihrem Team Kontrolle geben, ohne Leistung, Konsistenz oder Wartbarkeit zu beeinträchtigen.",
        "fr": "Des systèmes de contenu structurés qui donnent de l’autonomie à votre équipe sans compromettre les performances, la cohérence ou la maintenance.",
        "es": "Sistemas de contenido estructurados que proporcionan control a su equipo sin comprometer el rendimiento, la consistencia o la facilidad de mantenimiento."
      },
      "steps": [
        {"label_translations": {"en": "Content Modeling", "de": "Content-Modellierung", "fr": "Modélisation du contenu", "es": "Modelado de contenido"}, "icon": "type"},
        {"label_translations": {"en": "CMS Setup", "de": "CMS-Einrichtung", "fr": "Configuration du CMS", "es": "Configuración del CMS"}, "icon": "link"},
        {"label_translations": {"en": "Custom Components", "de": "Individuelle Komponenten", "fr": "Composants sur mesure", "es": "Componentes personalizados"}, "icon": "pen"},
        {"label_translations": {"en": "Training and Handover", "de": "Schulung und Übergabe", "fr": "Formation et transfert", "es": "Formación y entrega"}, "icon": "chat"}
      ]
    }
  ]'::jsonb,
  deliverables_title_translations = '{
    "en": "What''s Included",
    "de": "Was enthalten ist",
    "fr": "Ce qui est inclus",
    "es": "Qué incluye"
  }'::jsonb,
  deliverables = '[
    {
      "title_translations": {
        "en": "Strategy and UX",
        "de": "Strategie und UX",
        "fr": "Stratégie et UX",
        "es": "Estrategia y UX"
      },
      "description_translations": {
        "en": "Clear objectives, user journeys, information architecture, and an approved direction for the website or application.",
        "de": "Klare Ziele, Nutzerwege, Informationsarchitektur und eine freigegebene Ausrichtung für die Website oder Anwendung.",
        "fr": "Des objectifs clairs, des parcours utilisateurs, une architecture de l’information et une orientation validée pour le site ou l’application.",
        "es": "Objetivos claros, recorridos de usuario, arquitectura de la información y una dirección aprobada para el sitio o la aplicación."
      },
      "icon": "roadmap"
    },
    {
      "title_translations": {
        "en": "Responsive Interface",
        "de": "Responsive Benutzeroberfläche",
        "fr": "Interface responsive",
        "es": "Interfaz responsive"
      },
      "description_translations": {
        "en": "A considered experience across mobile, tablet, and desktop, supported by consistent components and interaction patterns.",
        "de": "Ein durchdachtes Erlebnis auf Smartphone, Tablet und Desktop mit konsistenten Komponenten und Interaktionsmustern.",
        "fr": "Une expérience cohérente sur mobile, tablette et ordinateur, soutenue par des composants et des interactions homogènes.",
        "es": "Una experiencia cuidada en dispositivos móviles, tabletas y ordenadores, respaldada por componentes y patrones de interacción consistentes."
      },
      "icon": "layout"
    },
    {
      "title_translations": {
        "en": "Production Code",
        "de": "Produktionsreifer Code",
        "fr": "Code prêt pour la production",
        "es": "Código listo para producción"
      },
      "description_translations": {
        "en": "Typed, maintainable implementation developed around the agreed requirements, integrations, and technical standards.",
        "de": "Eine typisierte und wartbare Umsetzung auf Basis der vereinbarten Anforderungen, Integrationen und technischen Standards.",
        "fr": "Une réalisation typée et maintenable, développée selon les exigences, les intégrations et les normes techniques convenues.",
        "es": "Una implementación tipada y mantenible, desarrollada según los requisitos, integraciones y estándares técnicos acordados."
      },
      "icon": "database"
    },
    {
      "title_translations": {
        "en": "Launch Support",
        "de": "Unterstützung beim Launch",
        "fr": "Accompagnement au lancement",
        "es": "Soporte durante el lanzamiento"
      },
      "description_translations": {
        "en": "Quality assurance, deployment, documentation, training, and a defined support period after launch.",
        "de": "Qualitätssicherung, Deployment, Dokumentation, Schulung und ein definierter Supportzeitraum nach dem Launch.",
        "fr": "Assurance qualité, déploiement, documentation, formation et période d’assistance définie après le lancement.",
        "es": "Control de calidad, despliegue, documentación, formación y un periodo de soporte definido después del lanzamiento."
      },
      "icon": "rocket"
    }
  ]'::jsonb,
  process_title_translations = '{
    "en": "How It Works",
    "de": "So entsteht Ihr digitales Produkt",
    "fr": "Comment se déroule le projet",
    "es": "Cómo desarrollamos su producto digital"
  }'::jsonb,
  process = '[
    {
      "number": 1,
      "title_translations": {
        "en": "Discovery",
        "de": "Analyse",
        "fr": "Découverte",
        "es": "Descubrimiento"
      },
      "description_translations": {
        "en": "We align on your business goals, audience, content, functionality, integrations, and technical requirements.",
        "de": "Wir stimmen Geschäftsziele, Zielgruppen, Inhalte, Funktionen, Integrationen und technische Anforderungen aufeinander ab.",
        "fr": "Nous alignons vos objectifs commerciaux, votre public, vos contenus, les fonctionnalités, les intégrations et les exigences techniques.",
        "es": "Alineamos sus objetivos empresariales, público, contenidos, funciones, integraciones y requisitos técnicos."
      },
      "icon": "search"
    },
    {
      "number": 2,
      "title_translations": {
        "en": "Design",
        "de": "Design",
        "fr": "Conception",
        "es": "Diseño"
      },
      "description_translations": {
        "en": "We define the information architecture, user journeys, interface system, and interactive direction before development begins.",
        "de": "Wir definieren Informationsarchitektur, Nutzerwege, Interface-System und Interaktionen, bevor die Entwicklung beginnt.",
        "fr": "Nous définissons l’architecture de l’information, les parcours utilisateurs, le système d’interface et les interactions avant le développement.",
        "es": "Definimos la arquitectura de la información, los recorridos de usuario, el sistema de interfaz y las interacciones antes de comenzar el desarrollo."
      },
      "icon": "pen"
    },
    {
      "number": 3,
      "title_translations": {
        "en": "Development",
        "de": "Entwicklung",
        "fr": "Développement",
        "es": "Desarrollo"
      },
      "description_translations": {
        "en": "We build and integrate the solution with performance, accessibility, security, and maintainability in mind.",
        "de": "Wir entwickeln und integrieren die Lösung mit Blick auf Leistung, Barrierefreiheit, Sicherheit und Wartbarkeit.",
        "fr": "Nous développons et intégrons la solution en tenant compte des performances, de l’accessibilité, de la sécurité et de la facilité de maintenance.",
        "es": "Desarrollamos e integramos la solución teniendo en cuenta el rendimiento, la accesibilidad, la seguridad y la facilidad de mantenimiento."
      },
      "icon": "database"
    },
    {
      "number": 4,
      "title_translations": {
        "en": "Launch",
        "de": "Launch",
        "fr": "Lancement",
        "es": "Lanzamiento"
      },
      "description_translations": {
        "en": "We test, deploy, document, and hand over a stable product prepared for measurement and continuous improvement.",
        "de": "Wir testen, veröffentlichen, dokumentieren und übergeben ein stabiles Produkt, das für Messung und kontinuierliche Verbesserung vorbereitet ist.",
        "fr": "Nous testons, déployons, documentons et transférons un produit stable, prêt à être mesuré et amélioré en continu.",
        "es": "Probamos, desplegamos, documentamos y entregamos un producto estable, preparado para la medición y la mejora continua."
      },
      "icon": "rocket"
    }
  ]'::jsonb,
  toolkit_title_translations = '{}'::jsonb,
  toolkit = '[]'::jsonb,
  cta_title_translations = '{
    "en": "Ready to Build Your Next Digital Product?",
    "de": "Bereit für Ihr nächstes digitales Produkt?",
    "fr": "Prêt à créer votre prochain produit numérique ?",
    "es": "¿Está listo para crear su próximo producto digital?"
  }'::jsonb,
  cta_subtitle_translations = '{
    "en": "Let''s create a website or web application that supports your customers, your operations, and your next stage of growth.",
    "de": "Lassen Sie uns eine Website oder Webanwendung entwickeln, die Ihre Kunden, Ihre Abläufe und Ihre nächste Wachstumsphase unterstützt.",
    "fr": "Créons un site ou une application web qui soutient vos clients, vos opérations et votre prochaine phase de croissance.",
    "es": "Creemos un sitio o una aplicación web que apoye a sus clientes, sus operaciones y su próxima etapa de crecimiento."
  }'::jsonb,
  cta_button_label_translations = '{
    "en": "Start Your Web Project",
    "de": "Webprojekt starten",
    "fr": "Démarrer votre projet web",
    "es": "Iniciar su proyecto web"
  }'::jsonb
WHERE slug = 'website-development';
