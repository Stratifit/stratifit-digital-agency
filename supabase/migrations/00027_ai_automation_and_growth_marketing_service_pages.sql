-- Migration: 00027_ai_automation_and_growth_marketing_service_pages
-- Description: Add dedicated landing pages for AI & Automation and Growth & Marketing,
--              fully CMS-editable, following the service-page architecture.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- AI & Automation
-- =============================================================================
INSERT INTO public.service_pages (
  service_id, slug, is_visible,
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
  s.id, 'ai-automation', true,
  '{"en":"AI & Automation Services","de":"KI- & Automatisierungs-Services","fr":"Services d''IA et d''automatisation","es":"Servicios de IA y Automatización"}'::jsonb,
  '{"en":"Automate your business with","de":"Automatisieren Sie Ihr Geschäft mit","fr":"Automatisez votre entreprise grâce à une","es":"Automatiza tu negocio con"}'::jsonb,
  '{"en":"intelligent AI.","de":"intelligenter KI.","fr":"IA intelligente.","es":"IA inteligente."}'::jsonb,
  '{"en":"Streamline operations, qualify leads, and scale support with custom AI solutions built for your workflow.","de":"Optimieren Sie Abläufe, qualifizieren Sie Leads und skalieren Sie Support mit maßgeschneiderten KI-Lösungen für Ihren Workflow.","fr":"Simplifiez vos opérations, qualifiez vos leads et développez votre support avec des solutions d''IA sur mesure adaptées à votre flux de travail.","es":"Optimiza las operaciones, califica clientes potenciales y escala el soporte con soluciones de IA personalizadas para tu flujo de trabajo."}'::jsonb,
  '[
    {"value":"50K+","label_translations":{"en":"Hours Saved","de":"Gesparte Stunden","fr":"Heures économisées","es":"Horas ahorradas"}},
    {"value":"10x","label_translations":{"en":"Faster Response","de":"Schnellere Reaktion","fr":"Réponse plus rapide","es":"Respuesta más rápida"}},
    {"value":"98%","label_translations":{"en":"Accuracy Rate","de":"Genauigkeitsrate","fr":"Taux de précision","es":"Tasa de precisión"}}
  ]'::jsonb,
  '{"en":"Why It Matters","de":"Warum es zählt","fr":"Pourquoi c''est important","es":"Por qué importa"}'::jsonb,
  '{"en":"AI isn''t just a buzzword — it''s the competitive edge your business needs. Intelligent automation reduces costs, eliminates human error, and scales your operations exponentially without adding headcount.","de":"KI ist kein bloßes Schlagwort – sie ist der Wettbewerbsvorteil, den Ihr Unternehmen braucht. Intelligente Automatisierung senkt Kosten, eliminiert menschliche Fehler und skaliert Ihre Abläufe exponentiell – ohne zusätzliches Personal.","fr":"L''IA n''est pas un simple mot à la mode : c''est l''avantage concurrentiel dont votre entreprise a besoin. L''automatisation intelligente réduit les coûts, élimine les erreurs humaines et fait évoluer vos opérations de façon exponentielle sans embauche supplémentaire.","es":"La IA no es solo una palabra de moda: es la ventaja competitiva que tu negocio necesita. La automatización inteligente reduce costos, elimina errores humanos y escala tus operaciones exponencialmente sin añadir personal."}'::jsonb,
  '[
    {"value":"-85%","label_translations":{"en":"Manual Tasks","de":"Manuelle Aufgaben","fr":"Tâches manuelles","es":"Tareas manuales"},"hint_translations":{"en":"eliminated from operations","de":"aus dem Betrieb eliminiert","fr":"éliminées des opérations","es":"eliminadas de las operaciones"}},
    {"value":"24/7","label_translations":{"en":"Coverage","de":"Abdeckung","fr":"Couverture","es":"Cobertura"},"hint_translations":{"en":"autonomous runtime","de":"autonomer Betrieb","fr":"fonctionnement autonome","es":"funcionamiento autónomo"}},
    {"value":"+47%","label_translations":{"en":"Lead Conversion","de":"Lead-Konversion","fr":"Conversion de leads","es":"Conversión de leads"},"hint_translations":{"en":"AI-scored vs. manual","de":"KI-bewertet vs. manuell","fr":"scoring IA vs. manuel","es":"puntuación IA vs. manual"}}
  ]'::jsonb,
  '{"en":"AI & Automation Services","de":"KI- & Automatisierungs-Services","fr":"Services d''IA et d''automatisation","es":"Servicios de IA y Automatización"}'::jsonb,
  '[
    {
      "title_translations":{"en":"AI Chatbots","de":"KI-Chatbots","fr":"Chatbots IA","es":"Chatbots con IA"},
      "description_translations":{"en":"Intelligent 24/7 customer support agents that handle inquiries, book appointments, and resolve issues autonomously.","de":"Intelligente 24/7-Kundensupport-Agenten, die Anfragen bearbeiten, Termine buchen und Probleme autonom lösen.","fr":"Des agents de support client intelligents 24/7 qui traitent les demandes, prennent des rendez-vous et résolvent les problèmes de manière autonome.","es":"Agentes inteligentes de atención al cliente 24/7 que gestionan consultas, reservan citas y resuelven problemas de forma autónoma."},
      "steps":[
        {"label_translations":{"en":"Audit","de":"Audit","fr":"Audit","es":"Auditoría"},"icon":"search"},
        {"label_translations":{"en":"Scripting","de":"Scripting","fr":"Scripting","es":"Scripting"},"icon":"pen"},
        {"label_translations":{"en":"Training","de":"Training","fr":"Formation","es":"Formación"},"icon":"grid"},
        {"label_translations":{"en":"Deploy","de":"Deploy","fr":"Déploiement","es":"Despliegue"},"icon":"rocket"}
      ]
    },
    {
      "title_translations":{"en":"Lead Qualification","de":"Lead-Qualifizierung","fr":"Qualification des leads","es":"Calificación de leads"},
      "description_translations":{"en":"AI-powered lead scoring and routing that ensures your sales team only talks to qualified prospects.","de":"KI-gestützte Lead-Bewertung und -Routing, damit Ihr Vertriebsteam nur mit qualifizierten Interessenten spricht.","fr":"Un scoring et un routage des leads propulsés par l''IA pour que votre équipe commerciale ne parle qu''aux prospects qualifiés.","es":"Puntuación y enrutamiento de leads con IA para que tu equipo de ventas solo hable con prospectos cualificados."},
      "steps":[
        {"label_translations":{"en":"Capture","de":"Erfassen","fr":"Capture","es":"Captura"},"icon":"positioning"},
        {"label_translations":{"en":"Scoring","de":"Scoring","fr":"Scoring","es":"Puntuación"},"icon":"final"},
        {"label_translations":{"en":"Routing","de":"Routing","fr":"Routage","es":"Enrutamiento"},"icon":"chat"},
        {"label_translations":{"en":"Engage","de":"Ansprechen","fr":"Engagement","es":"Interacción"},"icon":"chat"}
      ]
    },
    {
      "title_translations":{"en":"Workflow Automation","de":"Workflow-Automatisierung","fr":"Automatisation des workflows","es":"Automatización de flujos de trabajo"},
      "description_translations":{"en":"End-to-end process automation connecting your tools and eliminating manual repetitive work.","de":"End-to-End-Prozessautomatisierung, die Ihre Tools verbindet und manuelle Routinearbeit eliminiert.","fr":"Une automatisation de bout en bout qui connecte vos outils et élimine les tâches manuelles répétitives.","es":"Automatización integral de procesos que conecta tus herramientas y elimina el trabajo manual repetitivo."},
      "steps":[
        {"label_translations":{"en":"Map","de":"Mapping","fr":"Cartographie","es":"Mapa"},"icon":"roadmap"},
        {"label_translations":{"en":"Connect","de":"Verbinden","fr":"Connecter","es":"Conectar"},"icon":"link"},
        {"label_translations":{"en":"Automate","de":"Automatisieren","fr":"Automatiser","es":"Automatizar"},"icon":"grid"},
        {"label_translations":{"en":"Optimize","de":"Optimieren","fr":"Optimiser","es":"Optimizar"},"icon":"globe"}
      ]
    },
    {
      "title_translations":{"en":"Custom APIs","de":"Individuelle APIs","fr":"APIs sur mesure","es":"APIs personalizadas"},
      "description_translations":{"en":"Bespoke API integrations that connect your CRM, billing, support, and internal tools into one unified system.","de":"Individuelle API-Integrationen, die CRM, Abrechnung, Support und interne Tools zu einem einheitlichen System verbinden.","fr":"Des intégrations d''API sur mesure qui connectent votre CRM, votre facturation, votre support et vos outils internes en un système unifié.","es":"Integraciones de API a medida que conectan tu CRM, facturación, soporte y herramientas internas en un sistema unificado."},
      "steps":[
        {"label_translations":{"en":"Spec","de":"Spezifikation","fr":"Spécification","es":"Especificación"},"icon":"audit"},
        {"label_translations":{"en":"Build","de":"Bauen","fr":"Construire","es":"Construir"},"icon":"type"},
        {"label_translations":{"en":"Test","de":"Testen","fr":"Tester","es":"Probar"},"icon":"final"},
        {"label_translations":{"en":"Document","de":"Dokumentieren","fr":"Documenter","es":"Documentar"},"icon":"folder"}
      ]
    },
    {
      "title_translations":{"en":"AI Email Responder","de":"KI-E-Mail-Antwortassistent","fr":"Répondeur e-mail IA","es":"Respondedor de correo con IA"},
      "description_translations":{"en":"Intelligent email automation that handles inquiries, follow-ups, and nurturing sequences 24/7.","de":"Intelligente E-Mail-Automatisierung für Anfragen, Follow-ups und Nurturing-Sequenzen rund um die Uhr.","fr":"Une automatisation e-mail intelligente qui gère les demandes, les relances et les séquences de nurturing 24/7.","es":"Automatización inteligente de correo que gestiona consultas, seguimientos y secuencias de nurturing 24/7."},
      "steps":[
        {"label_translations":{"en":"Inbox","de":"Posteingang","fr":"Boîte de réception","es":"Bandeja de entrada"},"icon":"mail"},
        {"label_translations":{"en":"Classify","de":"Klassifizieren","fr":"Classifier","es":"Clasificar"},"icon":"grid"},
        {"label_translations":{"en":"Draft","de":"Entwurf","fr":"Brouillon","es":"Redactar"},"icon":"pen"},
        {"label_translations":{"en":"Send","de":"Senden","fr":"Envoyer","es":"Enviar"},"icon":"rocket"}
      ]
    },
    {
      "title_translations":{"en":"AI Receptionist","de":"KI-Rezeptionist","fr":"Réceptionniste IA","es":"Recepcionista con IA"},
      "description_translations":{"en":"Voice and chat AI that answers calls, books appointments, and qualifies prospects around the clock.","de":"Sprach- und Chat-KI, die Anrufe annimmt, Termine bucht und Interessenten rund um die Uhr qualifiziert.","fr":"Une IA vocale et chat qui répond aux appels, prend des rendez-vous et qualifie les prospects 24h/24.","es":"IA de voz y chat que responde llamadas, reserva citas y califica prospectos las 24 horas."},
      "steps":[
        {"label_translations":{"en":"Answer","de":"Antworten","fr":"Répondre","es":"Responder"},"icon":"phone"},
        {"label_translations":{"en":"Qualify","de":"Qualifizieren","fr":"Qualifier","es":"Calificar"},"icon":"chat"},
        {"label_translations":{"en":"Book","de":"Buchen","fr":"Réserver","es":"Reservar"},"icon":"final"},
        {"label_translations":{"en":"Log","de":"Protokollieren","fr":"Journaliser","es":"Registrar"},"icon":"database"}
      ]
    }
  ]'::jsonb,
  '{"en":"What''s Included","de":"Was enthalten ist","fr":"Ce qui est inclus","es":"Qué incluye"}'::jsonb,
  '[
    {"title_translations":{"en":"AI Models","de":"KI-Modelle","fr":"Modèles IA","es":"Modelos de IA"},"description_translations":{"en":"Custom-trained AI models for your specific business needs.","de":"Individuell trainierte KI-Modelle für Ihre spezifischen Geschäftsanforderungen.","fr":"Des modèles d''IA entraînés sur mesure pour vos besoins spécifiques.","es":"Modelos de IA entrenados a medida para las necesidades de tu negocio."},"icon":"key"},
    {"title_translations":{"en":"Automation","de":"Automatisierung","fr":"Automatisation","es":"Automatización"},"description_translations":{"en":"End-to-end workflow automation with Make.com & Zapier.","de":"End-to-End-Workflow-Automatisierung mit Make.com und Zapier.","fr":"Automatisation de workflows de bout en bout avec Make.com et Zapier.","es":"Automatización integral de flujos de trabajo con Make.com y Zapier."},"icon":"link"},
    {"title_translations":{"en":"Dashboards","de":"Dashboards","fr":"Tableaux de bord","es":"Paneles"},"description_translations":{"en":"Real-time analytics & performance monitoring.","de":"Echtzeit-Analysen und Performance-Überwachung.","fr":"Analytique en temps réel et suivi de la performance.","es":"Analítica en tiempo real y monitoreo de rendimiento."},"icon":"phone"},
    {"title_translations":{"en":"Docs","de":"Dokumentation","fr":"Documentation","es":"Documentación"},"description_translations":{"en":"Full API documentation & integration guides.","de":"Vollständige API-Dokumentation und Integrationsleitfäden.","fr":"Documentation d''API complète et guides d''intégration.","es":"Documentación completa de API y guías de integración."},"icon":"book"}
  ]'::jsonb,
  '{"en":"How It Works","de":"So funktioniert es","fr":"Comment ça marche","es":"Cómo funciona"}'::jsonb,
  '[
    {"number":1,"title_translations":{"en":"Audit","de":"Audit","fr":"Audit","es":"Auditoría"},"description_translations":{"en":"Analyze existing workflows & identify automation opportunities.","de":"Bestehende Workflows analysieren und Automatisierungspotenziale identifizieren.","fr":"Analyser les workflows existants et identifier les opportunités d''automatisation.","es":"Analizar los flujos de trabajo actuales e identificar oportunidades de automatización."},"icon":"search"},
    {"number":2,"title_translations":{"en":"Design","de":"Design","fr":"Design","es":"Diseño"},"description_translations":{"en":"Architect the AI solution & integration blueprint.","de":"Die KI-Lösung und den Integrationsentwurf architektonisch planen.","fr":"Architecturer la solution IA et le plan d''intégration.","es":"Diseñar la solución de IA y el plan de integración."},"icon":"pen"},
    {"number":3,"title_translations":{"en":"Build","de":"Build","fr":"Build","es":"Construcción"},"description_translations":{"en":"Develop AI models, chatbots & automation pipelines.","de":"KI-Modelle, Chatbots und Automatisierungspipelines entwickeln.","fr":"Développer les modèles IA, chatbots et pipelines d''automatisation.","es":"Desarrollar modelos de IA, chatbots y pipelines de automatización."},"icon":"grid"},
    {"number":4,"title_translations":{"en":"Deploy","de":"Deploy","fr":"Déploiement","es":"Despliegue"},"description_translations":{"en":"Launch, test & integrate into your live environment.","de":"Starten, testen und in Ihre Live-Umgebung integrieren.","fr":"Lancer, tester et intégrer dans votre environnement de production.","es":"Lanzar, probar e integrar en tu entorno de producción."},"icon":"rocket"}
  ]'::jsonb,
  '{"en":"Tools & Technologies","de":"Tools & Technologien","fr":"Outils & technologies","es":"Herramientas y tecnologías"}'::jsonb,
  '["OpenAI","Claude","LangChain","GPT-4","Make.com","Vapi","Tidio AI","Resend","HubSpot","Zapier"]'::jsonb,
  '{"en":"Let''s automate your workflows.","de":"Lassen Sie uns Ihre Workflows automatisieren.","fr":"Automatisons vos workflows.","es":"Automatiza tus flujos de trabajo."}'::jsonb,
  '{"en":"Tell us about your operations and we''ll map a clear, practical path from manual work to intelligent automation.","de":"Erzählen Sie uns von Ihren Abläufen, und wir entwickeln einen klaren, praktikablen Weg von manueller Arbeit zu intelligenter Automatisierung.","fr":"Parlez-nous de vos opérations et nous tracerons un chemin clair et concret, du travail manuel vers l''automatisation intelligente.","es":"Cuéntanos sobre tus operaciones y trazaremos un camino claro y práctico del trabajo manual a la automatización inteligente."}'::jsonb,
  '{"en":"Start Your AI Project","de":"KI-Projekt starten","fr":"Démarrer votre projet IA","es":"Iniciar tu proyecto de IA"}'::jsonb
FROM public.services AS s
WHERE s.slug = 'ai-automation'
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

-- =============================================================================
-- Growth & Marketing
-- =============================================================================
INSERT INTO public.service_pages (
  service_id, slug, is_visible,
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
  s.id, 'growth-marketing', true,
  '{"en":"Growth & Marketing Services","de":"Growth- & Marketing-Services","fr":"Services de croissance et marketing","es":"Servicios de crecimiento y marketing"}'::jsonb,
  '{"en":"Grow your brand with","de":"Wachsen Sie mit","fr":"Faites croître votre marque avec un","es":"Haz crecer tu marca con un"}'::jsonb,
  '{"en":"data-driven marketing.","de":"datengetriebenem Marketing.","fr":"marketing axé sur les données.","es":"marketing basado en datos."}'::jsonb,
  '{"en":"Growth-focused strategies that amplify your brand and drive measurable conversions across every channel.","de":"Wachstumsorientierte Strategien, die Ihre Marke verstärken und messbare Konversionen über jeden Kanal erzielen.","fr":"Des stratégies orientées croissance qui amplifient votre marque et génèrent des conversions mesurables sur chaque canal.","es":"Estrategias centradas en el crecimiento que amplifican tu marca y generan conversiones medibles en cada canal."}'::jsonb,
  '[
    {"value":"5x","label_translations":{"en":"Avg. ROAS","de":"Ø-ROAS","fr":"ROAS moyen","es":"ROAS medio"}},
    {"value":"400%","label_translations":{"en":"Traffic Growth","de":"Traffic-Wachstum","fr":"Croissance du trafic","es":"Crecimiento de tráfico"}},
    {"value":"150+","label_translations":{"en":"Campaigns Managed","de":"Verwaltete Kampagnen","fr":"Campagnes gérées","es":"Campañas gestionadas"}}
  ]'::jsonb,
  '{"en":"Why It Matters","de":"Warum es zählt","fr":"Pourquoi c''est important","es":"Por qué importa"}'::jsonb,
  '{"en":"In a crowded market, strategic marketing is the difference between being seen and being ignored. Data-driven campaigns turn browsers into buyers and buyers into brand advocates.","de":"In einem überfüllten Markt ist strategisches Marketing der Unterschied zwischen gesehen und ignoriert zu werden. Datengetriebene Kampagnen machen aus Browsern Käufer und aus Käufern Markenbefürworter.","fr":"Sur un marché saturé, le marketing stratégique fait la différence entre être vu et être ignoré. Les campagnes pilotées par les données transforment les visiteurs en acheteurs et les acheteurs en ambassadeurs.","es":"En un mercado saturado, el marketing estratégico marca la diferencia entre ser visto y ser ignorado. Las campañas basadas en datos convierten visitantes en compradores y compradores en embajadores."}'::jsonb,
  '[
    {"value":"3.4x","label_translations":{"en":"ROAS","de":"ROAS","fr":"ROAS","es":"ROAS"},"hint_translations":{"en":"return on ad spend","de":"Rendite auf Werbeausgaben","fr":"retour sur dépenses publicitaires","es":"retorno de la inversión publicitaria"}},
    {"value":"+340%","label_translations":{"en":"Audience Growth","de":"Zielgruppenwachstum","fr":"Croissance d''audience","es":"Crecimiento de audiencia"},"hint_translations":{"en":"in 90-day ramp","de":"im 90-Tage-Ramp-up","fr":"en montée en charge de 90 jours","es":"en rampa de 90 días"}},
    {"value":"-41%","label_translations":{"en":"CAC","de":"CAC","fr":"CAC","es":"CAC"},"hint_translations":{"en":"customer acquisition cost","de":"Kundenakquisitionskosten","fr":"coût d''acquisition client","es":"costo de adquisición de clientes"}}
  ]'::jsonb,
  '{"en":"Growth & Marketing Services","de":"Growth- & Marketing-Services","fr":"Services de croissance et marketing","es":"Servicios de crecimiento y marketing"}'::jsonb,
  '[
    {
      "title_translations":{"en":"Performance Marketing","de":"Performance-Marketing","fr":"Marketing de performance","es":"Marketing de rendimiento"},
      "description_translations":{"en":"Paid media campaigns across Google, Meta, LinkedIn & TikTok optimized for maximum ROAS.","de":"Paid-Media-Kampagnen auf Google, Meta, LinkedIn und TikTok, optimiert für maximalen ROAS.","fr":"Des campagnes média payantes sur Google, Meta, LinkedIn et TikTok optimisées pour un ROAS maximal.","es":"Campañas de medios pagados en Google, Meta, LinkedIn y TikTok optimizadas para un ROAS máximo."},
      "steps":[
        {"label_translations":{"en":"Audit","de":"Audit","fr":"Audit","es":"Auditoría"},"icon":"search"},
        {"label_translations":{"en":"Targeting","de":"Targeting","fr":"Ciblage","es":"Segmentación"},"icon":"positioning"},
        {"label_translations":{"en":"Optimize","de":"Optimieren","fr":"Optimiser","es":"Optimizar"},"icon":"chart"},
        {"label_translations":{"en":"Scale","de":"Skalieren","fr":"Faire évoluer","es":"Escalar"},"icon":"rocket"}
      ]
    },
    {
      "title_translations":{"en":"SEO & SEM","de":"SEO & SEM","fr":"SEO & SEM","es":"SEO y SEM"},
      "description_translations":{"en":"Technical SEO, keyword strategy, and content optimization to dominate search rankings.","de":"Technisches SEO, Keyword-Strategie und Content-Optimierung, um die Suchrankings zu dominieren.","fr":"SEO technique, stratégie de mots-clés et optimisation de contenu pour dominer les classements de recherche.","es":"SEO técnico, estrategia de palabras clave y optimización de contenido para dominar los rankings de búsqueda."},
      "steps":[
        {"label_translations":{"en":"Research","de":"Recherche","fr":"Recherche","es":"Investigación"},"icon":"search"},
        {"label_translations":{"en":"Technical","de":"Technisch","fr":"Technique","es":"Técnico"},"icon":"type"},
        {"label_translations":{"en":"Content","de":"Content","fr":"Contenu","es":"Contenido"},"icon":"audit"},
        {"label_translations":{"en":"Ranking","de":"Ranking","fr":"Classement","es":"Posicionamiento"},"icon":"globe"}
      ]
    },
    {
      "title_translations":{"en":"Content Strategy","de":"Content-Strategie","fr":"Stratégie de contenu","es":"Estrategia de contenido"},
      "description_translations":{"en":"Content marketing that educates, engages, and converts your ideal customers at every stage of the funnel.","de":"Content-Marketing, das Ihre idealen Kunden in jeder Funnel-Phase informiert, einbindet und konvertiert.","fr":"Un marketing de contenu qui éduque, engage et convertit vos clients idéaux à chaque étape de l''entonnoir.","es":"Marketing de contenido que educa, involucra y convierte a tus clientes ideales en cada etapa del embudo."},
      "steps":[
        {"label_translations":{"en":"Strategy","de":"Strategie","fr":"Stratégie","es":"Estrategia"},"icon":"pen"},
        {"label_translations":{"en":"Creation","de":"Erstellung","fr":"Création","es":"Creación"},"icon":"image"},
        {"label_translations":{"en":"Calendar","de":"Kalender","fr":"Calendrier","es":"Calendario"},"icon":"calendar"},
        {"label_translations":{"en":"Analytics","de":"Analytics","fr":"Analytique","es":"Analítica"},"icon":"chart"}
      ]
    },
    {
      "title_translations":{"en":"Social Media","de":"Social Media","fr":"Réseaux sociaux","es":"Redes sociales"},
      "description_translations":{"en":"Platform-native content strategies that build engaged communities and drive brand loyalty.","de":"Plattformnative Content-Strategien, die engagierte Communities aufbauen und Markenloyalität fördern.","fr":"Des stratégies de contenu natives des plateformes qui construisent des communautés engagées et fidélisent.","es":"Estrategias de contenido nativas de cada plataforma que crean comunidades comprometidas y fidelizan la marca."},
      "steps":[
        {"label_translations":{"en":"Strategy","de":"Strategie","fr":"Stratégie","es":"Estrategia"},"icon":"workshop"},
        {"label_translations":{"en":"Content","de":"Content","fr":"Contenu","es":"Contenido"},"icon":"image"},
        {"label_translations":{"en":"Engage","de":"Einbinden","fr":"Engager","es":"Interactuar"},"icon":"chat"},
        {"label_translations":{"en":"Report","de":"Report","fr":"Rapport","es":"Informe"},"icon":"chart"}
      ]
    },
    {
      "title_translations":{"en":"Conversion Funnels","de":"Conversion-Funnels","fr":"Entonnoirs de conversion","es":"Embudos de conversión"},
      "description_translations":{"en":"High-converting funnels that turn traffic into leads and leads into paying customers — predictably.","de":"Hochkonvertierende Funnels, die Traffic in Leads und Leads vorhersehbar in zahlende Kunden verwandeln.","fr":"Des entonnoirs à fort taux de conversion qui transforment le trafic en leads et les leads en clients payants, de manière prévisible.","es":"Embudos de alta conversión que transforman tráfico en leads y leads en clientes de pago, de forma predecible."},
      "steps":[
        {"label_translations":{"en":"Capture","de":"Erfassen","fr":"Capture","es":"Captura"},"icon":"positioning"},
        {"label_translations":{"en":"Nurture","de":"Nurturing","fr":"Nurturing","es":"Nutrir"},"icon":"chat"},
        {"label_translations":{"en":"Convert","de":"Konvertieren","fr":"Convertir","es":"Convertir"},"icon":"globe"},
        {"label_translations":{"en":"Scale","de":"Skalieren","fr":"Faire évoluer","es":"Escalar"},"icon":"rocket"}
      ]
    },
    {
      "title_translations":{"en":"CRM & Automation","de":"CRM & Automatisierung","fr":"CRM & automatisation","es":"CRM y automatización"},
      "description_translations":{"en":"HubSpot integration, lead scoring, and email sequences that automate your sales pipeline.","de":"HubSpot-Integration, Lead-Scoring und E-Mail-Sequenzen, die Ihre Vertriebspipeline automatisieren.","fr":"Intégration HubSpot, scoring des leads et séquences e-mail qui automatisent votre pipeline commercial.","es":"Integración con HubSpot, puntuación de leads y secuencias de correo que automatizan tu pipeline de ventas."},
      "steps":[
        {"label_translations":{"en":"Setup","de":"Setup","fr":"Configuration","es":"Configuración"},"icon":"link"},
        {"label_translations":{"en":"Score","de":"Scoring","fr":"Scoring","es":"Puntuación"},"icon":"positioning"},
        {"label_translations":{"en":"Sequence","de":"Sequenz","fr":"Séquence","es":"Secuencia"},"icon":"chat"},
        {"label_translations":{"en":"Automate","de":"Automatisieren","fr":"Automatiser","es":"Automatizar"},"icon":"globe"}
      ]
    }
  ]'::jsonb,
  '{"en":"What''s Included","de":"Was enthalten ist","fr":"Ce qui est inclus","es":"Qué incluye"}'::jsonb,
  '[
    {"title_translations":{"en":"Analytics","de":"Analytics","fr":"Analytique","es":"Analítica"},"description_translations":{"en":"Real-time dashboards & monthly performance reports.","de":"Echtzeit-Dashboards und monatliche Performance-Berichte.","fr":"Tableaux de bord en temps réel et rapports de performance mensuels.","es":"Paneles en tiempo real e informes de rendimiento mensuales."},"icon":"chart"},
    {"title_translations":{"en":"Strategy","de":"Strategie","fr":"Stratégie","es":"Estrategia"},"description_translations":{"en":"Custom marketing roadmap aligned with business goals.","de":"Individuelle Marketing-Roadmap, abgestimmt auf Ihre Geschäftsziele.","fr":"Feuille de route marketing sur mesure alignée sur vos objectifs.","es":"Hoja de ruta de marketing personalizada alineada con tus objetivos."},"icon":"audit"},
    {"title_translations":{"en":"Creatives","de":"Kreativmaterial","fr":"Créations","es":"Creativos"},"description_translations":{"en":"Ad copy, graphics & video content for all platforms.","de":"Anzeigentexte, Grafiken und Videocontent für alle Plattformen.","fr":"Copies publicitaires, graphismes et contenus vidéo pour toutes les plateformes.","es":"Textos publicitarios, gráficos y contenido de video para todas las plataformas."},"icon":"image"},
    {"title_translations":{"en":"Optimization","de":"Optimierung","fr":"Optimisation","es":"Optimización"},"description_translations":{"en":"A/B testing & continuous campaign refinement.","de":"A/B-Tests und kontinuierliche Kampagnenoptimierung.","fr":"Tests A/B et amélioration continue des campagnes.","es":"Pruebas A/B y refinamiento continuo de campañas."},"icon":"key"}
  ]'::jsonb,
  '{"en":"How It Works","de":"So funktioniert es","fr":"Comment ça marche","es":"Cómo funciona"}'::jsonb,
  '[
    {"number":1,"title_translations":{"en":"Audit","de":"Audit","fr":"Audit","es":"Auditoría"},"description_translations":{"en":"Deep analysis of current marketing performance & gaps.","de":"Tiefgehende Analyse der aktuellen Marketing-Performance und Lücken.","fr":"Analyse approfondie de la performance marketing actuelle et des lacunes.","es":"Análisis profundo del rendimiento de marketing actual y las brechas."},"icon":"search"},
    {"number":2,"title_translations":{"en":"Strategy","de":"Strategie","fr":"Stratégie","es":"Estrategia"},"description_translations":{"en":"Data-driven marketing plan with clear KPIs & targets.","de":"Datengetriebener Marketingplan mit klaren KPIs und Zielen.","fr":"Plan marketing piloté par les données avec des KPI et objectifs clairs.","es":"Plan de marketing basado en datos con KPIs y objetivos claros."},"icon":"pen"},
    {"number":3,"title_translations":{"en":"Launch","de":"Launch","fr":"Lancement","es":"Lanzamiento"},"description_translations":{"en":"Campaign deployment across all targeted channels.","de":"Kampagnen-Deployment über alle Zielkanäle.","fr":"Déploiement des campagnes sur tous les canaux ciblés.","es":"Despliegue de campañas en todos los canales objetivo."},"icon":"rocket"},
    {"number":4,"title_translations":{"en":"Scale","de":"Skalieren","fr":"Faire évoluer","es":"Escalar"},"description_translations":{"en":"Proven winners get scaled budget for maximum ROI.","de":"Bewährte Gewinner erhalten skaliertes Budget für maximalen ROI.","fr":"Les gagnants prouvés reçoivent un budget accru pour un ROI maximal.","es":"Los ganadores probados reciben presupuesto ampliado para un ROI máximo."},"icon":"chart"}
  ]'::jsonb,
  '{"en":"Tools & Technologies","de":"Tools & Technologien","fr":"Outils & technologies","es":"Herramientas y tecnologías"}'::jsonb,
  '["Meta Ads","Google Ads","TikTok Ads","LinkedIn Ads","HubSpot","Mixpanel","Hotjar","GA4","Klaviyo","Semrush"]'::jsonb,
  '{"en":"Let''s scale your growth.","de":"Lassen Sie uns Ihr Wachstum skalieren.","fr":"Faisons évoluer votre croissance.","es":"Escalemos tu crecimiento."}'::jsonb,
  '{"en":"Tell us about your goals and we''ll shape a clear, measurable growth plan for your brand.","de":"Erzählen Sie uns von Ihren Zielen, und wir entwickeln einen klaren, messbaren Wachstumsplan für Ihre Marke.","fr":"Parlez-nous de vos objectifs et nous façonnerons un plan de croissance clair et mesurable pour votre marque.","es":"Cuéntanos tus objetivos y daremos forma a un plan de crecimiento claro y medible para tu marca."}'::jsonb,
  '{"en":"Start Your Growth Plan","de":"Wachstumsplan starten","fr":"Démarrer votre plan de croissance","es":"Iniciar tu plan de crecimiento"}'::jsonb
FROM public.services AS s
WHERE s.slug = 'growth-marketing'
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
