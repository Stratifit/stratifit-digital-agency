-- Migration: 00094_growth_marketing_master_content
-- Description: Replace the Growth & Marketing service page with the approved
--              master content in all 4 languages. Keeps the configured hero
--              stats and Why It Matters stat badges untouched; updates the
--              hero headline/highlight/description, Why It Matters intro,
--              six Services with How We Do It steps, four Deliverables, four
--              Process steps, and the closing CTA. Removes any unverified
--              performance claims from the descriptive copy per the rules.
-- Stratifit Digital Agency Platform

UPDATE public.service_pages
SET
  hero_eyebrow_translations = '{
    "en": "Growth & Marketing",
    "de": "Wachstum & Marketing",
    "fr": "Croissance et marketing",
    "es": "Crecimiento y marketing"
  }'::jsonb,
  hero_title_translations = '{
    "en": "Turn visibility into measurable",
    "de": "Machen Sie aus Sichtbarkeit messbares",
    "fr": "Transformez votre visibilité en croissance",
    "es": "Convierta la visibilidad en crecimiento"
  }'::jsonb,
  hero_highlight_translations = '{
    "en": "growth.",
    "de": "Wachstum.",
    "fr": "mesurable.",
    "es": "medible."
  }'::jsonb,
  hero_description_translations = '{
    "en": "We build focused marketing systems that attract qualified audiences, improve conversion, and help you invest with greater clarity.",
    "de": "Wir entwickeln fokussierte Marketingsysteme, die qualifizierte Zielgruppen erreichen, die Conversion verbessern und klarere Investitionsentscheidungen ermöglichen.",
    "fr": "Nous développons des systèmes marketing ciblés qui attirent des audiences qualifiées, améliorent la conversion et vous permettent d’investir avec davantage de clarté.",
    "es": "Desarrollamos sistemas de marketing enfocados que atraen audiencias cualificadas, mejoran la conversión y le ayudan a invertir con mayor claridad."
  }'::jsonb,
  why_title_translations = '{
    "en": "Why It Matters",
    "de": "Warum es wichtig ist",
    "fr": "Pourquoi est-ce important ?",
    "es": "Por qué es importante"
  }'::jsonb,
  why_description_translations = '{
    "en": "Sustainable growth comes from connecting positioning, audience insight, channels, content, conversion, and measurement. A coordinated marketing system helps your business reach relevant people, learn what influences action, and allocate resources more effectively.",
    "de": "Nachhaltiges Wachstum entsteht durch das Zusammenspiel von Positionierung, Zielgruppenverständnis, Kanälen, Inhalten, Conversion und Messung. Ein abgestimmtes Marketingsystem hilft Ihrem Unternehmen, relevante Menschen zu erreichen, wirksame Maßnahmen zu erkennen und Ressourcen gezielter einzusetzen.",
    "fr": "Une croissance durable repose sur l’alignement du positionnement, de la connaissance du public, des canaux, du contenu, de la conversion et de la mesure. Un système marketing coordonné aide votre entreprise à atteindre les bonnes personnes, à comprendre ce qui favorise l’action et à répartir ses ressources plus efficacement.",
    "es": "El crecimiento sostenible surge de conectar el posicionamiento, el conocimiento de la audiencia, los canales, el contenido, la conversión y la medición. Un sistema de marketing coordinado ayuda a su empresa a llegar a personas relevantes, comprender qué impulsa la acción y asignar los recursos con mayor eficacia."
  }'::jsonb,
  capabilities_title_translations = '{
    "en": "Connected Marketing for Sustainable Growth",
    "de": "Vernetztes Marketing für nachhaltiges Wachstum",
    "fr": "Un marketing coordonné pour une croissance durable",
    "es": "Marketing conectado para un crecimiento sostenible"
  }'::jsonb,
  capabilities_description_translations = '{
    "en": "We combine strategy, channels, content, conversion, and measurement into a focused system built around your business objectives.",
    "de": "Wir verbinden Strategie, Kanäle, Inhalte, Conversion und Messung zu einem fokussierten System, das auf Ihre Geschäftsziele ausgerichtet ist.",
    "fr": "Nous réunissons stratégie, canaux, contenu, conversion et mesure dans un système ciblé, conçu autour de vos objectifs commerciaux.",
    "es": "Combinamos estrategia, canales, contenido, conversión y medición en un sistema enfocado y alineado con sus objetivos empresariales."
  }'::jsonb,
  capabilities = '[
    {
      "title_translations": {
        "en": "Performance Marketing",
        "de": "Performance-Marketing",
        "fr": "Marketing à la performance",
        "es": "Marketing de resultados"
      },
      "description_translations": {
        "en": "Paid campaigns across agreed channels, structured around your audience, offer, creative direction, budget, and measurement plan.",
        "de": "Bezahlte Kampagnen auf den vereinbarten Kanälen, abgestimmt auf Zielgruppe, Angebot, kreative Ausrichtung, Budget und Messkonzept.",
        "fr": "Des campagnes payantes sur les canaux convenus, structurées autour de votre public, de votre offre, de la direction créative, du budget et du plan de mesure.",
        "es": "Campañas de pago en los canales acordados, estructuradas en torno a su audiencia, oferta, dirección creativa, presupuesto y plan de medición."
      },
      "steps": [
        {"label_translations": {"en": "Performance Audit", "de": "Performance-Analyse", "fr": "Audit des performances", "es": "Auditoría del rendimiento"}, "icon": "audit"},
        {"label_translations": {"en": "Audience and Channel Strategy", "de": "Zielgruppen- und Kanalstrategie", "fr": "Stratégie d’audience et de canaux", "es": "Estrategia de audiencia y canales"}, "icon": "search"},
        {"label_translations": {"en": "Campaign Setup", "de": "Kampagneneinrichtung", "fr": "Configuration des campagnes", "es": "Configuración de campañas"}, "icon": "rocket"},
        {"label_translations": {"en": "Testing and Optimization", "de": "Tests und Optimierung", "fr": "Tests et optimisation", "es": "Pruebas y optimización"}, "icon": "chart"}
      ]
    },
    {
      "title_translations": {
        "en": "SEO & Search Marketing",
        "de": "SEO und Suchmaschinenmarketing",
        "fr": "SEO et SEA",
        "es": "SEO y marketing en buscadores"
      },
      "description_translations": {
        "en": "Technical, content, and paid search improvements designed to increase relevant visibility and capture existing demand.",
        "de": "Technische, inhaltliche und bezahlte Suchmaßnahmen, die relevante Sichtbarkeit erhöhen und bestehende Nachfrage erreichen sollen.",
        "fr": "Des améliorations techniques, éditoriales et publicitaires destinées à accroître la visibilité pertinente dans les moteurs de recherche et à capter la demande existante.",
        "es": "Mejoras técnicas, de contenido y de publicidad en buscadores diseñadas para aumentar la visibilidad relevante y captar la demanda existente."
      },
      "steps": [
        {"label_translations": {"en": "Search Research", "de": "Such- und Keyword-Recherche", "fr": "Recherche sur les intentions de recherche", "es": "Investigación de búsquedas"}, "icon": "search"},
        {"label_translations": {"en": "Technical SEO", "de": "Technisches SEO", "fr": "SEO technique", "es": "SEO técnico"}, "icon": "database"},
        {"label_translations": {"en": "Content Optimization", "de": "Content-Optimierung", "fr": "Optimisation du contenu", "es": "Optimización de contenidos"}, "icon": "pen"},
        {"label_translations": {"en": "Performance Review", "de": "Performance-Auswertung", "fr": "Analyse des performances", "es": "Revisión del rendimiento"}, "icon": "chart"}
      ]
    },
    {
      "title_translations": {
        "en": "Content Strategy",
        "de": "Content-Strategie",
        "fr": "Stratégie de contenu",
        "es": "Estrategia de contenidos"
      },
      "description_translations": {
        "en": "A structured content system that addresses customer questions, supports positioning, and guides audiences through the buying journey.",
        "de": "Ein strukturiertes Content-System, das Kundenfragen beantwortet, Ihre Positionierung unterstützt und Zielgruppen durch den Kaufprozess führt.",
        "fr": "Un système de contenu structuré qui répond aux questions des clients, soutient votre positionnement et accompagne le public tout au long du parcours d’achat.",
        "es": "Un sistema de contenidos estructurado que responde a las preguntas de los clientes, respalda su posicionamiento y guía a la audiencia durante el proceso de compra."
      },
      "steps": [
        {"label_translations": {"en": "Audience and Topic Strategy", "de": "Zielgruppen- und Themenstrategie", "fr": "Stratégie d’audience et de sujets", "es": "Estrategia de audiencia y temas"}, "icon": "search"},
        {"label_translations": {"en": "Content Planning", "de": "Content-Planung", "fr": "Planification éditoriale", "es": "Planificación de contenidos"}, "icon": "grid"},
        {"label_translations": {"en": "Production Framework", "de": "Produktionsrahmen", "fr": "Cadre de production", "es": "Marco de producción"}, "icon": "box"},
        {"label_translations": {"en": "Measurement and Refinement", "de": "Messung und Weiterentwicklung", "fr": "Mesure et amélioration", "es": "Medición y mejora"}, "icon": "chart"}
      ]
    },
    {
      "title_translations": {
        "en": "Social Media",
        "de": "Social Media",
        "fr": "Réseaux sociaux",
        "es": "Redes sociales"
      },
      "description_translations": {
        "en": "Channel-specific content planning and campaign support designed to strengthen brand presence and meaningful audience engagement.",
        "de": "Kanalspezifische Content-Planung und Kampagnenunterstützung zur Stärkung der Markenpräsenz und relevanter Interaktionen.",
        "fr": "Une planification adaptée à chaque plateforme et un accompagnement des campagnes pour renforcer la présence de la marque et favoriser un engagement pertinent.",
        "es": "Planificación de contenidos adaptada a cada canal y apoyo a campañas para fortalecer la presencia de marca y generar interacciones relevantes."
      },
      "steps": [
        {"label_translations": {"en": "Channel Strategy", "de": "Kanalstrategie", "fr": "Stratégie des canaux", "es": "Estrategia de canales"}, "icon": "globe"},
        {"label_translations": {"en": "Content Planning", "de": "Content-Planung", "fr": "Planification des contenus", "es": "Planificación de contenidos"}, "icon": "grid"},
        {"label_translations": {"en": "Publishing Support", "de": "Veröffentlichungsunterstützung", "fr": "Accompagnement à la publication", "es": "Apoyo a la publicación"}, "icon": "chart"},
        {"label_translations": {"en": "Reporting and Improvement", "de": "Auswertung und Verbesserung", "fr": "Analyse et amélioration", "es": "Informes y mejora"}, "icon": "tag"}
      ]
    },
    {
      "title_translations": {
        "en": "Conversion Funnels",
        "de": "Conversion-Prozesse",
        "fr": "Parcours de conversion",
        "es": "Embudos de conversión"
      },
      "description_translations": {
        "en": "Connected landing pages, forms, follow-up journeys, and conversion steps designed to move qualified interest toward action.",
        "de": "Abgestimmte Landingpages, Formulare, Folgeprozesse und Conversion-Schritte, die qualifiziertes Interesse gezielt zur Handlung führen.",
        "fr": "Des pages de destination, formulaires, séquences de suivi et étapes de conversion coordonnés pour transformer un intérêt qualifié en action.",
        "es": "Páginas de destino, formularios, recorridos de seguimiento y etapas de conversión conectados para transformar el interés cualificado en acción."
      },
      "steps": [
        {"label_translations": {"en": "Journey Mapping", "de": "Analyse der Kundenreise", "fr": "Cartographie du parcours", "es": "Mapeo del recorrido"}, "icon": "roadmap"},
        {"label_translations": {"en": "Offer and Lead Capture", "de": "Angebot und Lead-Erfassung", "fr": "Offre et collecte des prospects", "es": "Oferta y captación de clientes potenciales"}, "icon": "tag"},
        {"label_translations": {"en": "Nurture Flow", "de": "Nurturing-Prozess", "fr": "Séquence de maturation", "es": "Secuencia de seguimiento"}, "icon": "link"},
        {"label_translations": {"en": "Conversion Testing", "de": "Conversion-Tests", "fr": "Tests de conversion", "es": "Pruebas de conversión"}, "icon": "chart"}
      ]
    },
    {
      "title_translations": {
        "en": "CRM & Marketing Automation",
        "de": "CRM und Marketing-Automatisierung",
        "fr": "CRM et automatisation marketing",
        "es": "CRM y automatización de marketing"
      },
      "description_translations": {
        "en": "CRM structure, lead lifecycle management, segmentation, scoring, and communication workflows that support consistent follow-up.",
        "de": "CRM-Struktur, Lead-Lifecycle-Management, Segmentierung, Bewertung und Kommunikationsprozesse für eine konsistente Nachverfolgung.",
        "fr": "Une structure CRM, une gestion du cycle de vie des prospects, une segmentation, une notation et des processus de communication pour assurer un suivi cohérent.",
        "es": "Estructura de CRM, gestión del ciclo de vida de los clientes potenciales, segmentación, puntuación y flujos de comunicación para mantener un seguimiento consistente."
      },
      "steps": [
        {"label_translations": {"en": "CRM Architecture", "de": "CRM-Architektur", "fr": "Architecture CRM", "es": "Arquitectura del CRM"}, "icon": "database"},
        {"label_translations": {"en": "Data and Integration Setup", "de": "Daten- und Integrationseinrichtung", "fr": "Configuration des données et des intégrations", "es": "Configuración de datos e integraciones"}, "icon": "link"},
        {"label_translations": {"en": "Automation Workflows", "de": "Automatisierte Abläufe", "fr": "Processus automatisés", "es": "Flujos automatizados"}, "icon": "box"},
        {"label_translations": {"en": "Training and Optimization", "de": "Schulung und Optimierung", "fr": "Formation et optimisation", "es": "Formación y optimización"}, "icon": "chat"}
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
        "en": "Growth Strategy",
        "de": "Wachstumsstrategie",
        "fr": "Stratégie de croissance",
        "es": "Estrategia de crecimiento"
      },
      "description_translations": {
        "en": "A focused roadmap covering objectives, audiences, positioning, priority channels, campaign themes, budgets, and success indicators.",
        "de": "Ein fokussierter Fahrplan für Ziele, Zielgruppen, Positionierung, priorisierte Kanäle, Kampagnenthemen, Budgets und Erfolgskennzahlen.",
        "fr": "Une feuille de route ciblée couvrant les objectifs, les publics, le positionnement, les canaux prioritaires, les thèmes de campagne, les budgets et les indicateurs de réussite.",
        "es": "Una hoja de ruta enfocada que cubre objetivos, audiencias, posicionamiento, canales prioritarios, temas de campaña, presupuestos e indicadores de éxito."
      },
      "icon": "roadmap"
    },
    {
      "title_translations": {
        "en": "Measurement and Reporting",
        "de": "Messung und Reporting",
        "fr": "Mesure et rapports",
        "es": "Medición e informes"
      },
      "description_translations": {
        "en": "Analytics configuration, an agreed reporting structure, performance reviews, and clear recommendations based on available data.",
        "de": "Einrichtung der Analyse, eine vereinbarte Reporting-Struktur, regelmäßige Performance-Auswertungen und klare Empfehlungen auf Basis verfügbarer Daten.",
        "fr": "Une configuration des outils d’analyse, une structure de reporting convenue, des revues de performance et des recommandations claires basées sur les données disponibles.",
        "es": "Configuración de analítica, una estructura de informes acordada, revisiones del rendimiento y recomendaciones claras basadas en los datos disponibles."
      },
      "icon": "chart"
    },
    {
      "title_translations": {
        "en": "Campaign and Content Assets",
        "de": "Kampagnen- und Content-Assets",
        "fr": "Ressources de campagne et de contenu",
        "es": "Recursos de campaña y contenido"
      },
      "description_translations": {
        "en": "Campaign copy, landing-page direction, content plans, and the creative formats explicitly included in the agreed scope.",
        "de": "Kampagnentexte, Ausrichtung für Landingpages, Content-Pläne und die im Leistungsumfang ausdrücklich vereinbarten kreativen Formate.",
        "fr": "Des textes publicitaires, une orientation pour les pages de destination, des plans de contenu et les formats créatifs expressément inclus dans le périmètre convenu.",
        "es": "Textos de campaña, orientación para páginas de destino, planes de contenido y los formatos creativos incluidos expresamente en el alcance acordado."
      },
      "icon": "assets"
    },
    {
      "title_translations": {
        "en": "Optimization Roadmap",
        "de": "Optimierungsfahrplan",
        "fr": "Feuille de route d’optimisation",
        "es": "Hoja de ruta de optimización"
      },
      "description_translations": {
        "en": "A prioritized plan for experiments, conversion improvements, channel development, and future investment decisions.",
        "de": "Ein priorisierter Plan für Tests, Conversion-Verbesserungen, Kanalentwicklung und zukünftige Investitionsentscheidungen.",
        "fr": "Un plan priorisé pour les expérimentations, l’amélioration des conversions, le développement des canaux et les futures décisions d’investissement.",
        "es": "Un plan priorizado para experimentos, mejoras de conversión, desarrollo de canales y futuras decisiones de inversión."
      },
      "icon": "roadmap"
    }
  ]'::jsonb,
  process_title_translations = '{
    "en": "How It Works",
    "de": "So entwickeln wir Ihr Wachstumssystem",
    "fr": "Comment se déroule le projet",
    "es": "Cómo desarrollamos su sistema de crecimiento"
  }'::jsonb,
  process = '[
    {
      "number": 1,
      "title_translations": {
        "en": "Audit",
        "de": "Analyse",
        "fr": "Audit",
        "es": "Auditoría"
      },
      "description_translations": {
        "en": "We examine your offer, audience, current channels, customer journey, data, content, and performance to identify gaps and opportunities.",
        "de": "Wir untersuchen Angebot, Zielgruppen, bestehende Kanäle, Kundenreise, Daten, Inhalte und Performance, um Lücken und Möglichkeiten zu erkennen.",
        "fr": "Nous analysons votre offre, votre public, vos canaux actuels, le parcours client, les données, les contenus et les performances afin d’identifier les écarts et les possibilités.",
        "es": "Analizamos su oferta, audiencia, canales actuales, recorrido del cliente, datos, contenidos y rendimiento para identificar deficiencias y oportunidades."
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
        "en": "We define the objectives, positioning, audiences, channels, budget approach, campaign plan, and success indicators.",
        "de": "Wir definieren Ziele, Positionierung, Zielgruppen, Kanäle, Budgetansatz, Kampagnenplan und Erfolgskennzahlen.",
        "fr": "Nous définissons les objectifs, le positionnement, les publics, les canaux, l’approche budgétaire, le plan de campagne et les indicateurs de réussite.",
        "es": "Definimos los objetivos, el posicionamiento, las audiencias, los canales, el enfoque presupuestario, el plan de campañas y los indicadores de éxito."
      },
      "icon": "positioning"
    },
    {
      "number": 3,
      "title_translations": {
        "en": "Launch",
        "de": "Launch",
        "fr": "Lancement",
        "es": "Lanzamiento"
      },
      "description_translations": {
        "en": "We prepare the agreed campaigns, content, tracking, landing experiences, and workflows before launching across selected channels.",
        "de": "Wir bereiten die vereinbarten Kampagnen, Inhalte, Messung, Landingpages und Abläufe vor und starten sie auf den ausgewählten Kanälen.",
        "fr": "Nous préparons les campagnes, les contenus, le suivi, les pages de destination et les processus convenus avant le lancement sur les canaux sélectionnés.",
        "es": "Preparamos las campañas, los contenidos, la medición, las páginas de destino y los flujos acordados antes de lanzarlos en los canales seleccionados."
      },
      "icon": "rocket"
    },
    {
      "number": 4,
      "title_translations": {
        "en": "Optimize and Grow",
        "de": "Optimierung und Wachstum",
        "fr": "Optimisation et croissance",
        "es": "Optimización y crecimiento"
      },
      "description_translations": {
        "en": "We review performance, test improvements, strengthen effective activity, and adjust priorities according to evidence and business goals.",
        "de": "Wir bewerten die Performance, testen Verbesserungen, stärken wirksame Maßnahmen und passen Prioritäten anhand von Ergebnissen und Geschäftszielen an.",
        "fr": "Nous analysons les performances, testons les améliorations, renforçons les actions efficaces et ajustons les priorités en fonction des résultats et des objectifs commerciaux.",
        "es": "Revisamos el rendimiento, probamos mejoras, reforzamos las acciones eficaces y ajustamos las prioridades según los resultados y los objetivos empresariales."
      },
      "icon": "chart"
    }
  ]'::jsonb,
  toolkit_title_translations = '{}'::jsonb,
  toolkit = '[]'::jsonb,
  cta_title_translations = '{
    "en": "Ready to Build a Smarter Growth System?",
    "de": "Bereit für ein intelligenteres Wachstumssystem?",
    "fr": "Prêt à construire un système de croissance plus intelligent ?",
    "es": "¿Está listo para desarrollar un sistema de crecimiento más inteligente?"
  }'::jsonb,
  cta_subtitle_translations = '{
    "en": "Let''s create a focused marketing plan that improves visibility, attracts qualified audiences, and supports sustainable business growth.",
    "de": "Lassen Sie uns einen fokussierten Marketingplan entwickeln, der Ihre Sichtbarkeit verbessert, qualifizierte Zielgruppen erreicht und nachhaltiges Wachstum unterstützt.",
    "fr": "Créons un plan marketing ciblé qui améliore votre visibilité, attire des audiences qualifiées et soutient une croissance durable.",
    "es": "Creemos un plan de marketing enfocado que mejore su visibilidad, atraiga audiencias cualificadas y apoye un crecimiento empresarial sostenible."
  }'::jsonb,
  cta_button_label_translations = '{
    "en": "Start Your Growth Plan",
    "de": "Wachstumsplan starten",
    "fr": "Démarrer votre plan de croissance",
    "es": "Iniciar su plan de crecimiento"
  }'::jsonb
WHERE slug = 'growth-marketing';
