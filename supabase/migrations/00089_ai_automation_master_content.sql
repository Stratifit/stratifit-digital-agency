-- Migration: 00089_ai_automation_master_content
-- Description: Replace the AI & Automation service page with the approved
--              master content in all 4 languages. Removes the unverified
--              numeric claims (50K+ hours, 10x, 98%, 85%, 47%) in favour of
--              qualitative value statements, per the content rules.
-- Stratifit Digital Agency Platform

UPDATE public.service_pages
SET
  hero_eyebrow_translations = '{
    "en": "AI & Automation",
    "de": "KI & Automatisierung",
    "fr": "IA et automatisation",
    "es": "IA y automatización"
  }'::jsonb,
  hero_title_translations = '{
    "en": "Put AI to work across your business.",
    "de": "Setzen Sie KI gezielt in Ihrem Unternehmen ein.",
    "fr": "Mettez l’IA au service de votre entreprise.",
    "es": "Ponga la IA al servicio de su empresa."
  }'::jsonb,
  hero_highlight_translations = '{}'::jsonb,
  hero_description_translations = '{
    "en": "We design AI assistants and automated workflows that reduce repetitive work, improve customer communication, and connect your systems.",
    "de": "Wir entwickeln KI-Assistenten und automatisierte Abläufe, die wiederkehrende Arbeit reduzieren, die Kundenkommunikation verbessern und Ihre Systeme verbinden.",
    "fr": "Nous concevons des assistants IA et des processus automatisés qui réduisent les tâches répétitives, améliorent la communication client et connectent vos systèmes.",
    "es": "Diseñamos asistentes de IA y flujos de trabajo automatizados que reducen las tareas repetitivas, mejoran la comunicación con los clientes y conectan sus sistemas."
  }'::jsonb,
  hero_stats = '[
    {
      "value": "",
      "label_translations": {
        "en": "Workflow First",
        "de": "Prozesse zuerst",
        "fr": "Les processus d’abord",
        "es": "Primero, el proceso"
      },
      "description_translations": {
        "en": "Every solution begins with a real operational need and a clearly defined outcome.",
        "de": "Jede Lösung beginnt mit einem realen betrieblichen Bedarf und einem klar definierten Ziel.",
        "fr": "Chaque solution commence par un besoin opérationnel réel et un résultat clairement défini.",
        "es": "Cada solución comienza con una necesidad operativa real y un resultado claramente definido."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Human in Control",
        "de": "Menschen behalten die Kontrolle",
        "fr": "Contrôle humain",
        "es": "Control humano"
      },
      "description_translations": {
        "en": "Approval, escalation, and review rules are built around the risk of each task.",
        "de": "Freigaben, Eskalationen und Prüfregeln werden an das Risiko der jeweiligen Aufgabe angepasst.",
        "fr": "Les règles de validation, d’escalade et de contrôle sont adaptées au niveau de risque de chaque tâche.",
        "es": "Las reglas de aprobación, derivación y revisión se adaptan al riesgo de cada tarea."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Built to Integrate",
        "de": "Für Integration entwickelt",
        "fr": "Conçu pour s’intégrer",
        "es": "Diseñada para integrarse"
      },
      "description_translations": {
        "en": "AI and automation connect with the tools and data your team already uses.",
        "de": "KI und Automatisierung verbinden sich mit den Tools und Daten, die Ihr Team bereits nutzt.",
        "fr": "L’IA et l’automatisation se connectent aux outils et aux données déjà utilisés par votre équipe.",
        "es": "La IA y la automatización se conectan con las herramientas y los datos que su equipo ya utiliza."
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
    "en": "AI creates value when it improves a clear business process. The right system can reduce repetitive work, make responses more consistent, surface useful information, and give your team more time for decisions that require human judgment.",
    "de": "KI schafft Wert, wenn sie einen klar definierten Geschäftsprozess verbessert. Das richtige System kann wiederkehrende Arbeit reduzieren, Antworten konsistenter machen, relevante Informationen bereitstellen und Ihrem Team mehr Zeit für Entscheidungen geben, die menschliches Urteilsvermögen erfordern.",
    "fr": "L’IA crée de la valeur lorsqu’elle améliore un processus métier clairement défini. Un système adapté peut réduire les tâches répétitives, rendre les réponses plus cohérentes, faire ressortir les informations utiles et libérer du temps pour les décisions qui nécessitent un jugement humain.",
    "es": "La IA crea valor cuando mejora un proceso empresarial claramente definido. El sistema adecuado puede reducir el trabajo repetitivo, hacer que las respuestas sean más consistentes, presentar información útil y ofrecer a su equipo más tiempo para decisiones que requieren criterio humano."
  }'::jsonb,
  why_badges = '[
    {
      "value": "",
      "label_translations": {
        "en": "Operational Efficiency",
        "de": "Betriebliche Effizienz",
        "fr": "Efficacité opérationnelle",
        "es": "Eficiencia operativa"
      },
      "description_translations": {
        "en": "Automate structured, repetitive steps so your team can focus on higher-value work.",
        "de": "Automatisieren Sie strukturierte, wiederkehrende Schritte, damit sich Ihr Team auf wertschöpfende Aufgaben konzentrieren kann.",
        "fr": "Automatisez les étapes structurées et répétitives afin que votre équipe puisse se concentrer sur des tâches à plus forte valeur.",
        "es": "Automatice pasos estructurados y repetitivos para que su equipo pueda centrarse en actividades de mayor valor."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Consistent Communication",
        "de": "Konsistente Kommunikation",
        "fr": "Communication cohérente",
        "es": "Comunicación consistente"
      },
      "description_translations": {
        "en": "Provide faster, more consistent responses while directing complex or sensitive cases to the right person.",
        "de": "Ermöglichen Sie schnellere und einheitlichere Antworten und leiten Sie komplexe oder sensible Fälle an die richtige Person weiter.",
        "fr": "Fournissez des réponses plus rapides et plus cohérentes tout en dirigeant les situations complexes ou sensibles vers la bonne personne.",
        "es": "Proporcione respuestas más rápidas y uniformes mientras dirige los casos complejos o sensibles a la persona adecuada."
      }
    },
    {
      "value": "",
      "label_translations": {
        "en": "Controlled Automation",
        "de": "Kontrollierte Automatisierung",
        "fr": "Automatisation maîtrisée",
        "es": "Automatización controlada"
      },
      "description_translations": {
        "en": "Use defined permissions, approval rules, monitoring, and escalation paths to keep people accountable for important decisions.",
        "de": "Nutzen Sie definierte Berechtigungen, Freigaberegeln, Überwachung und Eskalationswege, damit wichtige Entscheidungen nachvollziehbar bleiben.",
        "fr": "Utilisez des autorisations, des règles de validation, un suivi et des procédures d’escalade clairement définis pour les décisions importantes.",
        "es": "Utilice permisos, reglas de aprobación, supervisión y rutas de derivación definidas para mantener la responsabilidad sobre las decisiones importantes."
      }
    }
  ]'::jsonb,
  capabilities_title_translations = '{
    "en": "Practical AI for Real Business Workflows",
    "de": "Praktische KI für reale Geschäftsprozesse",
    "fr": "Une IA pratique pour vos processus métier",
    "es": "IA práctica para procesos empresariales reales"
  }'::jsonb,
  capabilities_description_translations = '{
    "en": "We focus on useful systems that connect with your operations, support your team, and deliver outcomes that can be monitored and improved.",
    "de": "Wir konzentrieren uns auf nützliche Systeme, die sich in Ihre Abläufe integrieren, Ihr Team unterstützen und messbare Ergebnisse liefern, die kontinuierlich verbessert werden können.",
    "fr": "Nous développons des systèmes utiles qui s’intègrent à vos opérations, soutiennent votre équipe et produisent des résultats mesurables et améliorables.",
    "es": "Nos centramos en sistemas útiles que se integran con sus operaciones, apoyan a su equipo y ofrecen resultados que pueden medirse y mejorarse."
  }'::jsonb,
  capabilities = '[
    {
      "title_translations": {
        "en": "AI Chatbots and Assistants",
        "de": "KI-Chatbots und Assistenten",
        "fr": "Chatbots et assistants IA",
        "es": "Chatbots y asistentes de IA"
      },
      "description_translations": {
        "en": "Context-aware assistants that answer common questions, support customers, capture enquiries, and escalate complex cases to your team.",
        "de": "Kontextbezogene Assistenten, die häufige Fragen beantworten, Kunden unterstützen, Anfragen erfassen und komplexe Fälle an Ihr Team weiterleiten.",
        "fr": "Des assistants capables de répondre aux questions fréquentes, d’accompagner les clients, de recueillir les demandes et de transmettre les situations complexes à votre équipe.",
        "es": "Asistentes que responden preguntas frecuentes, ayudan a los clientes, registran solicitudes y trasladan los casos complejos a su equipo."
      },
      "steps": [
        {"label_translations": {"en": "Use Case Audit", "de": "Analyse des Anwendungsfalls", "fr": "Analyse du cas d’usage", "es": "Análisis del caso de uso"}, "icon": "audit"},
        {"label_translations": {"en": "Conversation Design", "de": "Dialogkonzeption", "fr": "Conception conversationnelle", "es": "Diseño conversacional"}, "icon": "pen"},
        {"label_translations": {"en": "Knowledge Setup", "de": "Wissenskonfiguration", "fr": "Configuration des connaissances", "es": "Configuración del conocimiento"}, "icon": "database"},
        {"label_translations": {"en": "Testing and Launch", "de": "Tests und Launch", "fr": "Tests et lancement", "es": "Pruebas y lanzamiento"}, "icon": "rocket"}
      ]
    },
    {
      "title_translations": {
        "en": "Lead Qualification",
        "de": "Lead-Qualifizierung",
        "fr": "Qualification des prospects",
        "es": "Cualificación de clientes potenciales"
      },
      "description_translations": {
        "en": "Structured qualification and routing based on agreed criteria, helping sales teams prioritize relevant opportunities without removing human judgment.",
        "de": "Strukturierte Qualifizierung und Weiterleitung nach vereinbarten Kriterien, damit Vertriebsteams relevante Chancen priorisieren können, ohne auf menschliche Beurteilung zu verzichten.",
        "fr": "Une qualification et un routage structurés selon des critères convenus, afin d’aider les équipes commerciales à prioriser les opportunités pertinentes tout en conservant un contrôle humain.",
        "es": "Cualificación y distribución estructuradas según criterios acordados, para ayudar a los equipos comerciales a priorizar oportunidades relevantes sin eliminar el criterio humano."
      },
      "steps": [
        {"label_translations": {"en": "Lead Capture", "de": "Lead-Erfassung", "fr": "Collecte des prospects", "es": "Captación de clientes potenciales"}, "icon": "tag"},
        {"label_translations": {"en": "Rules and Scoring", "de": "Regeln und Bewertung", "fr": "Règles et notation", "es": "Reglas y puntuación"}, "icon": "rules"},
        {"label_translations": {"en": "Routing Logic", "de": "Weiterleitungslogik", "fr": "Logique de routage", "es": "Lógica de distribución"}, "icon": "link"},
        {"label_translations": {"en": "CRM Integration", "de": "CRM-Integration", "fr": "Intégration CRM", "es": "Integración con CRM"}, "icon": "database"}
      ]
    },
    {
      "title_translations": {
        "en": "Workflow Automation",
        "de": "Workflow-Automatisierung",
        "fr": "Automatisation des processus",
        "es": "Automatización de flujos de trabajo"
      },
      "description_translations": {
        "en": "Connected processes that move information between tools, reduce repetitive administration, and create clearer operational handoffs.",
        "de": "Vernetzte Abläufe, die Informationen zwischen Tools übertragen, wiederkehrende Verwaltungsarbeit reduzieren und operative Übergaben verbessern.",
        "fr": "Des processus connectés qui transfèrent les informations entre vos outils, réduisent les tâches administratives répétitives et améliorent les relais opérationnels.",
        "es": "Procesos conectados que trasladan información entre herramientas, reducen las tareas administrativas repetitivas y mejoran las transiciones operativas."
      },
      "steps": [
        {"label_translations": {"en": "Process Mapping", "de": "Prozessanalyse", "fr": "Cartographie des processus", "es": "Mapeo de procesos"}, "icon": "grid"},
        {"label_translations": {"en": "Tool Integration", "de": "Tool-Integration", "fr": "Intégration des outils", "es": "Integración de herramientas"}, "icon": "link"},
        {"label_translations": {"en": "Automation Build", "de": "Entwicklung der Automatisierung", "fr": "Développement des automatisations", "es": "Desarrollo de la automatización"}, "icon": "box"},
        {"label_translations": {"en": "Monitoring and Optimization", "de": "Überwachung und Optimierung", "fr": "Suivi et optimisation", "es": "Supervisión y optimización"}, "icon": "chart"}
      ]
    },
    {
      "title_translations": {
        "en": "Custom Integrations and APIs",
        "de": "Individuelle Integrationen und APIs",
        "fr": "Intégrations et API sur mesure",
        "es": "Integraciones y API a medida"
      },
      "description_translations": {
        "en": "Purpose-built integrations that connect CRM, billing, support, communication, and internal systems through documented interfaces.",
        "de": "Maßgeschneiderte Integrationen, die CRM, Abrechnung, Support, Kommunikation und interne Systeme über dokumentierte Schnittstellen verbinden.",
        "fr": "Des intégrations conçues pour connecter le CRM, la facturation, l’assistance, la communication et les systèmes internes au moyen d’interfaces documentées.",
        "es": "Integraciones desarrolladas para conectar CRM, facturación, soporte, comunicación y sistemas internos mediante interfaces documentadas."
      },
      "steps": [
        {"label_translations": {"en": "Requirements", "de": "Anforderungsdefinition", "fr": "Définition des besoins", "es": "Definición de requisitos"}, "icon": "audit"},
        {"label_translations": {"en": "Architecture", "de": "Architektur", "fr": "Architecture", "es": "Arquitectura"}, "icon": "layout"},
        {"label_translations": {"en": "Development and Testing", "de": "Entwicklung und Tests", "fr": "Développement et tests", "es": "Desarrollo y pruebas"}, "icon": "database"},
        {"label_translations": {"en": "Documentation", "de": "Dokumentation", "fr": "Documentation", "es": "Documentación"}, "icon": "book"}
      ]
    },
    {
      "title_translations": {
        "en": "AI Email Automation",
        "de": "KI-gestützte E-Mail-Automatisierung",
        "fr": "Automatisation des e-mails par IA",
        "es": "Automatización del correo electrónico con IA"
      },
      "description_translations": {
        "en": "Email workflows that classify messages, prepare draft responses, route enquiries, and trigger approved follow-ups according to defined rules.",
        "de": "E-Mail-Abläufe, die Nachrichten klassifizieren, Antwortentwürfe erstellen, Anfragen weiterleiten und freigegebene Folgeaktionen nach definierten Regeln auslösen.",
        "fr": "Des processus qui classent les messages, préparent des projets de réponse, orientent les demandes et déclenchent des relances approuvées selon des règles définies.",
        "es": "Flujos de correo electrónico que clasifican mensajes, preparan borradores de respuesta, distribuyen solicitudes y activan seguimientos aprobados según reglas definidas."
      },
      "steps": [
        {"label_translations": {"en": "Inbox Analysis", "de": "Postfachanalyse", "fr": "Analyse de la boîte de réception", "es": "Análisis de la bandeja de entrada"}, "icon": "mail"},
        {"label_translations": {"en": "Message Classification", "de": "Nachrichtenklassifizierung", "fr": "Classification des messages", "es": "Clasificación de mensajes"}, "icon": "tag"},
        {"label_translations": {"en": "Response Design", "de": "Antwortkonzeption", "fr": "Conception des réponses", "es": "Diseño de respuestas"}, "icon": "pen"},
        {"label_translations": {"en": "Approval and Sending Rules", "de": "Freigabe- und Versandregeln", "fr": "Règles de validation et d’envoi", "es": "Reglas de aprobación y envío"}, "icon": "rules"}
      ]
    },
    {
      "title_translations": {
        "en": "AI Receptionist",
        "de": "KI-Rezeption",
        "fr": "Réceptionniste IA",
        "es": "Recepcionista de IA"
      },
      "description_translations": {
        "en": "Voice and chat assistants that handle initial enquiries, capture information, route conversations, and schedule appointments within defined workflows.",
        "de": "Sprach- und Chat-Assistenten, die erste Anfragen bearbeiten, Informationen erfassen, Gespräche weiterleiten und Termine innerhalb definierter Abläufe koordinieren.",
        "fr": "Des assistants vocaux et conversationnels qui traitent les premières demandes, recueillent les informations, orientent les échanges et planifient des rendez-vous selon des processus définis.",
        "es": "Asistentes de voz y chat que gestionan consultas iniciales, recopilan información, distribuyen conversaciones y programan citas dentro de procesos definidos."
      },
      "steps": [
        {"label_translations": {"en": "Conversation Flow", "de": "Gesprächsablauf", "fr": "Parcours conversationnel", "es": "Flujo conversacional"}, "icon": "chat"},
        {"label_translations": {"en": "Knowledge Setup", "de": "Wissenskonfiguration", "fr": "Configuration des connaissances", "es": "Configuración del conocimiento"}, "icon": "database"},
        {"label_translations": {"en": "Booking Integration", "de": "Terminplanungsintegration", "fr": "Intégration de la prise de rendez-vous", "es": "Integración de reservas"}, "icon": "calendar"},
        {"label_translations": {"en": "Testing and Escalation", "de": "Tests und Eskalation", "fr": "Tests et escalade", "es": "Pruebas y derivación"}, "icon": "rocket"}
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
        "en": "Solution Architecture",
        "de": "Lösungsarchitektur",
        "fr": "Architecture de la solution",
        "es": "Arquitectura de la solución"
      },
      "description_translations": {
        "en": "A documented plan covering the use case, workflow, data sources, permissions, integrations, success criteria, and operational responsibilities.",
        "de": "Ein dokumentierter Plan für Anwendungsfall, Ablauf, Datenquellen, Berechtigungen, Integrationen, Erfolgskriterien und betriebliche Verantwortlichkeiten.",
        "fr": "Un plan documenté couvrant le cas d’usage, les processus, les sources de données, les autorisations, les intégrations, les critères de réussite et les responsabilités opérationnelles.",
        "es": "Un plan documentado que cubre el caso de uso, el proceso, las fuentes de datos, los permisos, las integraciones, los criterios de éxito y las responsabilidades operativas."
      },
      "icon": "layout"
    },
    {
      "title_translations": {
        "en": "AI Assistants and Automation",
        "de": "KI-Assistenten und Automatisierungen",
        "fr": "Assistants IA et automatisations",
        "es": "Asistentes de IA y automatizaciones"
      },
      "description_translations": {
        "en": "Configured assistants, automated workflows, prompts, business rules, and interfaces developed for the agreed scope.",
        "de": "Konfigurierte Assistenten, automatisierte Abläufe, Anweisungen, Geschäftsregeln und Benutzeroberflächen für den vereinbarten Leistungsumfang.",
        "fr": "Les assistants configurés, processus automatisés, instructions, règles métier et interfaces nécessaires au périmètre convenu.",
        "es": "Asistentes configurados, flujos automatizados, instrucciones, reglas empresariales e interfaces desarrollados para el alcance acordado."
      },
      "icon": "chat"
    },
    {
      "title_translations": {
        "en": "Integrations and Monitoring",
        "de": "Integrationen und Überwachung",
        "fr": "Intégrations et suivi",
        "es": "Integraciones y supervisión"
      },
      "description_translations": {
        "en": "Connections to approved systems, operational logging, error handling, alerts, and monitoring appropriate to the solution.",
        "de": "Verbindungen zu freigegebenen Systemen, Protokollierung, Fehlerbehandlung, Benachrichtigungen und eine angemessene Überwachung der Lösung.",
        "fr": "Des connexions aux systèmes approuvés, des journaux opérationnels, une gestion des erreurs, des alertes et un suivi adaptés à la solution.",
        "es": "Conexiones con sistemas aprobados, registros operativos, gestión de errores, alertas y supervisión adecuada para la solución."
      },
      "icon": "link"
    },
    {
      "title_translations": {
        "en": "Documentation and Handover",
        "de": "Dokumentation und Übergabe",
        "fr": "Documentation et transfert",
        "es": "Documentación y entrega"
      },
      "description_translations": {
        "en": "Technical documentation, operating guidance, training, and clearly defined procedures for review, escalation, and ongoing improvement.",
        "de": "Technische Dokumentation, Betriebsanleitungen, Schulung und klar definierte Verfahren für Prüfung, Eskalation und kontinuierliche Verbesserung.",
        "fr": "Une documentation technique, des consignes d’utilisation, une formation et des procédures claires pour le contrôle, l’escalade et l’amélioration continue.",
        "es": "Documentación técnica, instrucciones operativas, formación y procedimientos claros para la revisión, la derivación y la mejora continua."
      },
      "icon": "book"
    }
  ]'::jsonb,
  process_title_translations = '{
    "en": "How It Works",
    "de": "So entsteht Ihre Automatisierung",
    "fr": "Comment se déroule le projet",
    "es": "Cómo desarrollamos su automatización"
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
        "en": "We examine your workflows, systems, data, risks, and business goals to identify valuable and realistic automation opportunities.",
        "de": "Wir untersuchen Ihre Abläufe, Systeme, Daten, Risiken und Geschäftsziele, um wertvolle und realistische Automatisierungsmöglichkeiten zu identifizieren.",
        "fr": "Nous analysons vos processus, vos systèmes, vos données, vos risques et vos objectifs afin d’identifier des possibilités d’automatisation utiles et réalistes.",
        "es": "Analizamos sus procesos, sistemas, datos, riesgos y objetivos empresariales para identificar oportunidades de automatización útiles y realistas."
      },
      "icon": "search"
    },
    {
      "number": 2,
      "title_translations": {
        "en": "Design",
        "de": "Konzeption",
        "fr": "Conception",
        "es": "Diseño"
      },
      "description_translations": {
        "en": "We define the solution architecture, integrations, business rules, approval points, success criteria, and user experience.",
        "de": "Wir definieren Lösungsarchitektur, Integrationen, Geschäftsregeln, Freigabepunkte, Erfolgskriterien und Nutzererlebnis.",
        "fr": "Nous définissons l’architecture de la solution, les intégrations, les règles métier, les points de validation, les critères de réussite et l’expérience utilisateur.",
        "es": "Definimos la arquitectura de la solución, las integraciones, las reglas empresariales, los puntos de aprobación, los criterios de éxito y la experiencia de usuario."
      },
      "icon": "pen"
    },
    {
      "number": 3,
      "title_translations": {
        "en": "Build",
        "de": "Umsetzung",
        "fr": "Réalisation",
        "es": "Desarrollo"
      },
      "description_translations": {
        "en": "We configure and develop the assistants, workflows, integrations, and monitoring required for the approved solution.",
        "de": "Wir konfigurieren und entwickeln die Assistenten, Abläufe, Integrationen und Überwachung für die freigegebene Lösung.",
        "fr": "Nous configurons et développons les assistants, les processus, les intégrations et les outils de suivi nécessaires à la solution approuvée.",
        "es": "Configuramos y desarrollamos los asistentes, flujos, integraciones y herramientas de supervisión necesarios para la solución aprobada."
      },
      "icon": "box"
    },
    {
      "number": 4,
      "title_translations": {
        "en": "Deploy and Improve",
        "de": "Einführung und Verbesserung",
        "fr": "Déploiement et amélioration",
        "es": "Implementación y mejora"
      },
      "description_translations": {
        "en": "We test with realistic scenarios, deploy in controlled stages, train your team, monitor performance, and refine the system using evidence.",
        "de": "Wir testen mit realistischen Szenarien, führen die Lösung kontrolliert ein, schulen Ihr Team, überwachen die Leistung und verbessern das System anhand konkreter Ergebnisse.",
        "fr": "Nous testons la solution dans des scénarios réalistes, la déployons progressivement, formons votre équipe, suivons les performances et l’améliorons à partir de données concrètes.",
        "es": "Realizamos pruebas con situaciones realistas, implementamos la solución de forma controlada, formamos a su equipo, supervisamos el rendimiento y mejoramos el sistema a partir de resultados concretos."
      },
      "icon": "rocket"
    }
  ]'::jsonb,
  toolkit_title_translations = '{}'::jsonb,
  toolkit = '[]'::jsonb,
  cta_title_translations = '{
    "en": "Ready to Automate Smarter?",
    "de": "Bereit für intelligentere Automatisierung?",
    "fr": "Prêt à automatiser plus intelligemment ?",
    "es": "¿Está listo para automatizar de forma más inteligente?"
  }'::jsonb,
  cta_subtitle_translations = '{
    "en": "Let''s identify where AI can reduce repetitive work, improve communication, and create measurable operational value for your business.",
    "de": "Lassen Sie uns herausfinden, wo KI wiederkehrende Arbeit reduzieren, die Kommunikation verbessern und messbaren betrieblichen Nutzen schaffen kann.",
    "fr": "Identifions les domaines dans lesquels l’IA peut réduire les tâches répétitives, améliorer la communication et créer une valeur opérationnelle mesurable.",
    "es": "Identifiquemos dónde puede la IA reducir el trabajo repetitivo, mejorar la comunicación y generar valor operativo medible para su empresa."
  }'::jsonb,
  cta_button_label_translations = '{
    "en": "Start Your AI Project",
    "de": "KI-Projekt starten",
    "fr": "Démarrer votre projet d’IA",
    "es": "Iniciar su proyecto de IA"
  }'::jsonb
WHERE slug = 'ai-automation';
