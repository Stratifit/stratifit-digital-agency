-- Migration: 00086_brand_design_master_content
-- Description: Replace the Brand Design service page with the approved master
--              content in all 4 languages. Removes the unverified numeric
--              claims (120+ brands, 4.8 Clutch, 96%, 2x, 77%, 89%) in favour
--              of qualitative value statements, per the content rules. Also
--              adds a per-section intro for the capabilities block.
-- Stratifit Digital Agency Platform

ALTER TABLE public.service_pages
  ADD COLUMN IF NOT EXISTS capabilities_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.service_pages
SET
  hero_eyebrow_translations = '{
    "en": "Brand Design",
    "de": "Markendesign",
    "fr": "Design de marque",
    "es": "Diseño de marca"
  }'::jsonb,
  hero_title_translations = '{
    "en": "Build a brand people recognize and trust.",
    "de": "Eine Marke, die wiedererkannt wird und Vertrauen schafft.",
    "fr": "Créez une marque que l''on reconnaît et qui inspire confiance.",
    "es": "Cree una marca que las personas reconozcan y en la que confíen."
  }'::jsonb,
  hero_highlight_translations = '{}'::jsonb,
  hero_description_translations = '{
    "en": "We create strategic brand identities that clarify your positioning, build credibility, and make your business memorable.",
    "de": "Wir entwickeln strategische Markenidentitäten, die Ihre Positionierung schärfen, Vertrauen schaffen und Ihr Unternehmen im Gedächtnis verankern.",
    "fr": "Nous concevons des identités de marque stratégiques qui clarifient votre positionnement, renforcent votre crédibilité et rendent votre entreprise mémorable.",
    "es": "Creamos identidades de marca estratégicas que definen su posicionamiento, refuerzan su credibilidad y hacen que su empresa sea memorable."
  }'::jsonb,
  hero_stats = '[
    {
      "value": "",
      "label_translations": {
        "en": "Strategy First",
        "de": "Strategisch fundiert",
        "fr": "Stratégie claire",
        "es": "La estrategia primero"
      },
      "description_translations": {
        "en": "Every creative decision begins with clear business and market insight.",
        "de": "Jede kreative Entscheidung basiert auf einem klaren Verständnis Ihres Unternehmens und Ihres Marktes.",
        "fr": "Chaque décision créative repose sur une compréhension précise de votre entreprise et de votre marché.",
        "es": "Cada decisión creativa comienza con una comprensión clara de su empresa y de su mercado."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Built for Growth",
        "de": "Skalierbar aufgebaut",
        "fr": "Identité évolutive",
        "es": "Diseñada para crecer"
      },
      "description_translations": {
        "en": "A flexible identity system designed to evolve with your business.",
        "de": "Ein flexibles Markensystem, das mit Ihrem Unternehmen wachsen kann.",
        "fr": "Un système de marque flexible conçu pour accompagner le développement de votre entreprise.",
        "es": "Un sistema de marca flexible preparado para evolucionar con su empresa."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Ready to Use",
        "de": "Direkt einsetzbar",
        "fr": "Outils prêts à l''emploi",
        "es": "Lista para aplicar"
      },
      "description_translations": {
        "en": "Practical assets and guidelines your team can apply consistently.",
        "de": "Praktische Dateien und klare Richtlinien für eine konsistente Anwendung durch Ihr Team.",
        "fr": "Des ressources pratiques et des règles claires que votre équipe peut appliquer avec cohérence.",
        "es": "Recursos prácticos y directrices claras que su equipo puede utilizar de forma consistente."
      }
    }
  ]'::jsonb,
  why_title_translations = '{
    "en": "Why It Matters",
    "de": "Warum Markendesign wichtig ist",
    "fr": "Pourquoi est-ce important ?",
    "es": "Por qué es importante"
  }'::jsonb,
  why_description_translations = '{
    "en": "A strong brand gives people a clear reason to understand, trust, and choose your business. It aligns positioning, messaging, and visual identity so every customer interaction feels consistent, credible, and memorable.",
    "de": "Eine starke Marke gibt Menschen einen klaren Grund, Ihr Unternehmen zu verstehen, ihm zu vertrauen und sich dafür zu entscheiden. Sie verbindet Positionierung, Botschaften und visuelle Identität zu einem konsistenten, glaubwürdigen und einprägsamen Gesamtbild.",
    "fr": "Une marque forte donne au public une raison claire de comprendre votre entreprise, de lui faire confiance et de la choisir. Elle aligne le positionnement, les messages et l''identité visuelle afin que chaque interaction soit cohérente, crédible et mémorable.",
    "es": "Una marca sólida ofrece a las personas una razón clara para comprender, confiar y elegir su empresa. Alinea el posicionamiento, los mensajes y la identidad visual para que cada interacción resulte coherente, creíble y memorable."
  }'::jsonb,
  why_badges = '[
    {
      "value": "",
      "label_translations": {
        "en": "Clear Positioning",
        "de": "Klare Positionierung",
        "fr": "Positionnement clair",
        "es": "Posicionamiento claro"
      },
      "description_translations": {
        "en": "Communicate what makes your business different and why it should be chosen.",
        "de": "Kommunizieren Sie, was Ihr Unternehmen unterscheidet und warum Kunden sich dafür entscheiden sollten.",
        "fr": "Communiquez ce qui différencie votre entreprise et les raisons pour lesquelles vos clients devraient la choisir.",
        "es": "Comunique lo que diferencia a su empresa y por qué los clientes deberían elegirla."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Greater Credibility",
        "de": "Mehr Glaubwürdigkeit",
        "fr": "Crédibilité renforcée",
        "es": "Mayor credibilidad"
      },
      "description_translations": {
        "en": "Present a consistent identity that feels established, professional, and dependable.",
        "de": "Präsentieren Sie eine konsistente Identität, die Professionalität, Verlässlichkeit und Stärke vermittelt.",
        "fr": "Présentez une identité cohérente qui reflète le professionnalisme, la fiabilité et la maturité de votre entreprise.",
        "es": "Presente una identidad consistente que transmita profesionalidad, fiabilidad y solidez."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Lasting Recognition",
        "de": "Nachhaltige Wiedererkennung",
        "fr": "Reconnaissance durable",
        "es": "Reconocimiento duradero"
      },
      "description_translations": {
        "en": "Build distinctive brand signals that customers can identify and remember.",
        "de": "Entwickeln Sie unverwechselbare Markenelemente, die Kunden erkennen und im Gedächtnis behalten.",
        "fr": "Créez des éléments de marque distinctifs que vos clients peuvent identifier et mémoriser.",
        "es": "Desarrolle elementos de marca distintivos que los clientes puedan identificar y recordar."
      }
    }
  ]'::jsonb,
  capabilities_title_translations = '{
    "en": "A Complete Brand System",
    "de": "Ein vollständiges Markensystem",
    "fr": "Un système de marque complet",
    "es": "Un sistema de marca completo"
  }'::jsonb,
  capabilities_description_translations = '{
    "en": "Strategy and design brought together to create a brand that is distinctive, consistent, and ready to grow.",
    "de": "Strategie und Design vereint in einer unverwechselbaren, konsistenten und zukunftsfähigen Marke.",
    "fr": "La stratégie et le design réunis pour créer une marque distinctive, cohérente et prête à évoluer.",
    "es": "Estrategia y diseño unidos para crear una marca distintiva, coherente y preparada para crecer."
  }'::jsonb,
  capabilities = '[
    {
      "title_translations": {
        "en": "Brand Strategy",
        "de": "Markenstrategie",
        "fr": "Stratégie de marque",
        "es": "Estrategia de marca"
      },
      "description_translations": {
        "en": "Research-led direction that defines your audience, differentiation, positioning, and foundation for future brand decisions.",
        "de": "Eine fundierte Ausrichtung, die Ihre Zielgruppe, Differenzierung, Positionierung und die Grundlage für zukünftige Markenentscheidungen definiert.",
        "fr": "Une orientation fondée sur la recherche qui définit votre public, votre différenciation, votre positionnement et les bases de vos futures décisions de marque.",
        "es": "Una dirección basada en la investigación que define su público, diferenciación, posicionamiento y las bases para futuras decisiones de marca."
      },
      "steps": [
        {"label_translations": {"en": "Brand Audit", "de": "Markenanalyse", "fr": "Audit de marque", "es": "Auditoría de marca"}, "icon": "audit"},
        {"label_translations": {"en": "Stakeholder Workshop", "de": "Strategieworkshop", "fr": "Atelier stratégique", "es": "Taller estratégico"}, "icon": "workshop"},
        {"label_translations": {"en": "Market Positioning", "de": "Marktpositionierung", "fr": "Positionnement sur le marché", "es": "Posicionamiento en el mercado"}, "icon": "positioning"},
        {"label_translations": {"en": "Strategic Roadmap", "de": "Strategischer Fahrplan", "fr": "Feuille de route stratégique", "es": "Hoja de ruta estratégica"}, "icon": "roadmap"}
      ]
    },
    {
      "title_translations": {
        "en": "Logo Design",
        "de": "Logodesign",
        "fr": "Création de logo",
        "es": "Diseño de logotipo"
      },
      "description_translations": {
        "en": "A distinctive and versatile logo system designed to remain clear and recognizable across digital and physical applications.",
        "de": "Ein unverwechselbares und vielseitiges Logosystem, das in digitalen und physischen Anwendungen klar und wiedererkennbar bleibt.",
        "fr": "Un système de logo distinctif et polyvalent, conçu pour rester clair et reconnaissable sur les supports numériques et physiques.",
        "es": "Un sistema de logotipo distintivo y versátil, diseñado para mantener su claridad y reconocimiento en aplicaciones digitales y físicas."
      },
      "steps": [
        {"label_translations": {"en": "Creative Direction", "de": "Kreative Ausrichtung", "fr": "Direction créative", "es": "Dirección creativa"}, "icon": "pen"},
        {"label_translations": {"en": "Concept Development", "de": "Konzeptentwicklung", "fr": "Développement des concepts", "es": "Desarrollo de conceptos"}, "icon": "sketch"},
        {"label_translations": {"en": "Refinement", "de": "Ausarbeitung", "fr": "Affinement", "es": "Perfeccionamiento"}, "icon": "refine"},
        {"label_translations": {"en": "Final Logo Suite", "de": "Finales Logosystem", "fr": "Système de logo final", "es": "Sistema de logotipo final"}, "icon": "final"}
      ]
    },
    {
      "title_translations": {
        "en": "Visual Identity",
        "de": "Visuelle Identität",
        "fr": "Identité visuelle",
        "es": "Identidad visual"
      },
      "description_translations": {
        "en": "A cohesive system of color, typography, imagery, and layout that gives your brand a consistent visual language.",
        "de": "Ein stimmiges System aus Farben, Typografie, Bildsprache und Layout, das Ihrer Marke eine konsistente visuelle Sprache gibt.",
        "fr": "Un système cohérent de couleurs, de typographies, d''images et de mises en page qui donne à votre marque un langage visuel constant.",
        "es": "Un sistema cohesionado de color, tipografía, imágenes y composición que proporciona a su marca un lenguaje visual consistente."
      },
      "steps": [
        {"label_translations": {"en": "Typography", "de": "Typografie", "fr": "Typographie", "es": "Tipografía"}, "icon": "type"},
        {"label_translations": {"en": "Color System", "de": "Farbsystem", "fr": "Système de couleurs", "es": "Sistema de color"}, "icon": "color"},
        {"label_translations": {"en": "Image Direction", "de": "Bildsprache", "fr": "Direction photographique", "es": "Dirección de imagen"}, "icon": "image"},
        {"label_translations": {"en": "Graphic Elements", "de": "Grafische Elemente", "fr": "Éléments graphiques", "es": "Elementos gráficos"}, "icon": "pattern"}
      ]
    },
    {
      "title_translations": {
        "en": "Brand Guidelines",
        "de": "Markenrichtlinien",
        "fr": "Charte de marque",
        "es": "Directrices de marca"
      },
      "description_translations": {
        "en": "A practical guide that helps your team and partners apply the brand clearly and consistently.",
        "de": "Ein praxisnaher Leitfaden, mit dem Ihr Team und Ihre Partner die Marke klar und konsistent anwenden können.",
        "fr": "Un guide pratique qui aide votre équipe et vos partenaires à appliquer la marque de manière claire et cohérente.",
        "es": "Una guía práctica que ayuda a su equipo y a sus colaboradores a aplicar la marca con claridad y coherencia."
      },
      "steps": [
        {"label_translations": {"en": "Logo Usage", "de": "Logoverwendung", "fr": "Utilisation du logo", "es": "Uso del logotipo"}, "icon": "rules"},
        {"label_translations": {"en": "Color and Typography Rules", "de": "Farb- und Typografieregeln", "fr": "Règles de couleurs et de typographie", "es": "Normas de color y tipografía"}, "icon": "assets"},
        {"label_translations": {"en": "Layout Principles", "de": "Layoutprinzipien", "fr": "Principes de mise en page", "es": "Principios de composición"}, "icon": "layout"},
        {"label_translations": {"en": "Application Examples", "de": "Anwendungsbeispiele", "fr": "Exemples d''application", "es": "Ejemplos de aplicación"}, "icon": "type"}
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
        "en": "Logo and Master Files",
        "de": "Logo- und Masterdateien",
        "fr": "Logos et fichiers maîtres",
        "es": "Logotipos y archivos maestros"
      },
      "description_translations": {
        "en": "Primary, secondary, and icon logo variations supplied in the agreed vector, raster, print, and digital formats.",
        "de": "Primäre, sekundäre und kompakte Logovarianten in den vereinbarten Vektor-, Raster-, Druck- und Digitalformaten.",
        "fr": "Les versions principales, secondaires et iconographiques du logo, fournies dans les formats vectoriels, matriciels, numériques et d''impression convenus.",
        "es": "Variaciones principales, secundarias e iconográficas del logotipo en los formatos vectoriales, de mapa de bits, digitales y de impresión acordados."
      },
      "icon": "folder"
    },
    {
      "title_translations": {
        "en": "Visual Identity System",
        "de": "Visuelles Identitätssystem",
        "fr": "Système d''identité visuelle",
        "es": "Sistema de identidad visual"
      },
      "description_translations": {
        "en": "A complete color, typography, imagery, and graphic system designed for consistent use across every relevant touchpoint.",
        "de": "Ein vollständiges System aus Farben, Typografie, Bildsprache und grafischen Elementen für eine konsistente Anwendung an allen relevanten Kontaktpunkten.",
        "fr": "Un système complet de couleurs, de typographies, d''images et d''éléments graphiques conçu pour une utilisation cohérente sur chaque point de contact pertinent.",
        "es": "Un sistema completo de color, tipografía, imágenes y elementos gráficos para una aplicación consistente en todos los puntos de contacto relevantes."
      },
      "icon": "tag"
    },
    {
      "title_translations": {
        "en": "Brand Application Kit",
        "de": "Vorlagen für Markenanwendungen",
        "fr": "Kit d''applications de marque",
        "es": "Kit de aplicaciones de marca"
      },
      "description_translations": {
        "en": "Ready-to-use templates for the agreed applications, such as social media, presentations, stationery, or marketing materials.",
        "de": "Direkt einsetzbare Vorlagen für vereinbarte Anwendungen wie Social Media, Präsentationen, Geschäftsausstattung oder Marketingmaterialien.",
        "fr": "Des modèles prêts à l''emploi pour les supports convenus, tels que les réseaux sociaux, les présentations, la papeterie ou les documents marketing.",
        "es": "Plantillas listas para utilizar en las aplicaciones acordadas, como redes sociales, presentaciones, papelería o materiales de marketing."
      },
      "icon": "box"
    },
    {
      "title_translations": {
        "en": "Brand Guidelines",
        "de": "Markenrichtlinien",
        "fr": "Charte de marque",
        "es": "Directrices de marca"
      },
      "description_translations": {
        "en": "A structured brand guide covering usage rules, visual standards, and practical examples for your team and partners.",
        "de": "Ein strukturierter Markenleitfaden mit Anwendungsregeln, visuellen Standards und praktischen Beispielen für Ihr Team und Ihre Partner.",
        "fr": "Un guide structuré comprenant les règles d''utilisation, les normes visuelles et des exemples pratiques destinés à votre équipe et à vos partenaires.",
        "es": "Una guía estructurada con normas de uso, estándares visuales y ejemplos prácticos para su equipo y sus colaboradores."
      },
      "icon": "book"
    }
  ]'::jsonb,
  process_title_translations = '{
    "en": "How It Works",
    "de": "So entsteht Ihre Marke",
    "fr": "Comment se déroule le projet",
    "es": "Cómo desarrollamos su marca"
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
        "en": "We examine your business, audience, market, goals, and existing brand to establish a clear foundation.",
        "de": "Wir analysieren Ihr Unternehmen, Ihre Zielgruppe, Ihren Markt, Ihre Ziele und Ihre bestehende Marke, um eine klare Grundlage zu schaffen.",
        "fr": "Nous analysons votre entreprise, votre public, votre marché, vos objectifs et votre identité actuelle afin d''établir une base claire.",
        "es": "Analizamos su empresa, público, mercado, objetivos y marca actual para establecer una base clara."
      },
      "icon": "search"
    },
    {
      "number": 2,
      "title_translations": {
        "en": "Strategy",
        "de": "Strategie",
        "fr": "Stratégie",
        "es": "Estrategia"
      },
      "description_translations": {
        "en": "We define your positioning, differentiation, brand direction, and the principles that will guide every creative decision.",
        "de": "Wir definieren Ihre Positionierung, Differenzierung, Markenausrichtung und die Prinzipien für alle kreativen Entscheidungen.",
        "fr": "Nous définissons votre positionnement, votre différenciation, votre orientation de marque et les principes qui guideront chaque décision créative.",
        "es": "Definimos su posicionamiento, diferenciación, dirección de marca y los principios que guiarán cada decisión creativa."
      },
      "icon": "spark"
    },
    {
      "number": 3,
      "title_translations": {
        "en": "Design",
        "de": "Design",
        "fr": "Création",
        "es": "Diseño"
      },
      "description_translations": {
        "en": "We develop and refine the logo and visual identity into a cohesive system aligned with the approved strategy.",
        "de": "Wir entwickeln und verfeinern Logo und visuelle Identität zu einem stimmigen System, das auf der freigegebenen Strategie basiert.",
        "fr": "Nous développons et affinons le logo et l''identité visuelle pour former un système cohérent, aligné sur la stratégie approuvée.",
        "es": "Desarrollamos y perfeccionamos el logotipo y la identidad visual hasta convertirlos en un sistema cohesionado y alineado con la estrategia aprobada."
      },
      "icon": "pen"
    },
    {
      "number": 4,
      "title_translations": {
        "en": "Delivery",
        "de": "Übergabe",
        "fr": "Livraison",
        "es": "Entrega"
      },
      "description_translations": {
        "en": "We prepare the final files, templates, and guidelines, then show your team how to apply the brand consistently.",
        "de": "Wir bereiten die finalen Dateien, Vorlagen und Richtlinien vor und zeigen Ihrem Team, wie die Marke konsistent angewendet wird.",
        "fr": "Nous préparons les fichiers, les modèles et la charte finale, puis nous montrons à votre équipe comment appliquer la marque avec cohérence.",
        "es": "Preparamos los archivos, plantillas y directrices finales y mostramos a su equipo cómo aplicar la marca de forma consistente."
      },
      "icon": "rocket"
    }
  ]'::jsonb,
  toolkit_title_translations = '{}'::jsonb,
  toolkit = '[]'::jsonb,
  cta_title_translations = '{
    "en": "Ready to Build a Stronger Brand?",
    "de": "Bereit für eine stärkere Marke?",
    "fr": "Prêt à construire une marque plus forte ?",
    "es": "¿Está listo para construir una marca más sólida?"
  }'::jsonb,
  cta_subtitle_translations = '{
    "en": "Let''s create a strategic identity that reflects your value, strengthens your position, and supports your next stage of growth.",
    "de": "Lassen Sie uns eine strategische Identität entwickeln, die Ihren Wert sichtbar macht, Ihre Position stärkt und Ihre nächste Wachstumsphase unterstützt.",
    "fr": "Créons une identité stratégique qui reflète votre valeur, renforce votre positionnement et accompagne votre prochaine phase de croissance.",
    "es": "Creemos una identidad estratégica que refleje su valor, refuerce su posición y respalde su próxima etapa de crecimiento."
  }'::jsonb,
  cta_button_label_translations = '{
    "en": "Start Your Brand Project",
    "de": "Markenprojekt starten",
    "fr": "Démarrer votre projet de marque",
    "es": "Iniciar su proyecto de marca"
  }'::jsonb
WHERE slug = 'brand-design';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.service_pages DROP COLUMN IF EXISTS capabilities_description_translations;
