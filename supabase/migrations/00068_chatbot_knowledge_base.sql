-- Migration: 00068_chatbot_knowledge_base
-- Description: Seed a comprehensive approved knowledge base for the main
--              AI chatbot so it can answer customers across all four
--              supported languages (en, de, fr, es) instead of escalating.
-- Stratifit Digital Agency Platform
--
-- Idempotent: ON CONFLICT (slug) DO UPDATE keeps the rows in sync.

INSERT INTO public.chatbot_knowledge
  (slug, title_translations, content_translations, category, source_type, priority, is_enabled, is_ai_eligible)
VALUES
  -- =========================================================================
  -- Company / General
  -- =========================================================================
  ('about-stratifit',
   '{"en": "What is Stratifit?", "de": "Was ist Stratifit?", "fr": "Qu''est-ce que Stratifit ?", "es": "¿Qué es Stratifit?"}'::jsonb,
   '{"en": "Stratifit is a premium multilingual digital agency. We deliver brand design, website development, AI automation, and growth marketing. We build digital assets that drive valuation and market authority, not just websites.", "de": "Stratifit ist eine Premium-Digitalagentur mit mehrsprachigem Angebot. Wir liefern Markengestaltung, Webentwicklung, KI-Automatisierung und Growth Marketing. Wir bauen digitale Assets, die Bewertung und Marktautorität steigern, nicht nur Websites.", "fr": "Stratifit est une agence digitale premium multilingue. Nous proposons du design de marque, du développement web, de l''automatisation par IA et du marketing de croissance. Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché, pas seulement des sites web.", "es": "Stratifit es una agencia digital premium multilingüe. Ofrecemos diseño de marca, desarrollo web, automatización con IA y marketing de crecimiento. Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb,
   'general', 'manual', 100, true, true),
  ('services-overview',
   '{"en": "What services do you offer?", "de": "Welche Leistungen bieten Sie an?", "fr": "Quels services proposez-vous ?", "es": "¿Qué servicios ofrecen?"}'::jsonb,
   '{"en": "We offer four core services: Brand Design, Website Development, AI and Automation, and Growth Marketing. We also help buyers acquire digital businesses. You can see all services at /services.", "de": "Wir bieten vier Kernleistungen: Markengestaltung, Webentwicklung, KI und Automatisierung sowie Growth Marketing. Wir unterstützen außerdem Käufer beim Erwerb digitaler Unternehmen. Alle Leistungen finden Sie unter /services.", "fr": "Nous proposons quatre services principaux : design de marque, développement web, IA et automatisation, et marketing de croissance. Nous aidons aussi les acheteurs à acquérir des entreprises numériques. Tous les services sont listés sur /services.", "es": "Ofrecemos cuatro servicios principales: diseño de marca, desarrollo web, IA y automatización, y marketing de crecimiento. También ayudamos a compradores a adquirir negocios digitales. Puede ver todos los servicios en /services."}'::jsonb,
   'services', 'manual', 100, true, true),
  ('why-choose-us',
   '{"en": "Why should I choose Stratifit?", "de": "Warum sollte ich Stratifit wählen?", "fr": "Pourquoi choisir Stratifit ?", "es": "¿Por qué debería elegir Stratifit?"}'::jsonb,
   '{"en": "We are a senior-only team with 7+ years of production experience, outcome-priced (we charge for shipped value, not hours), and async-first with weekly demos. We have shipped 50+ projects across 40+ countries with 98% client retention.", "de": "Wir sind ein reines Senior-Team mit über 7 Jahren Produktionserfahrung, ergebnisbasiert bepreist (wir berechnen gelieferten Wert, nicht Stunden) und arbeiten asynchron mit wöchentlichen Demos. Wir haben über 50 Projekte in mehr als 40 Ländern geliefert, mit 98 % Kundenbindung.", "fr": "Nous sommes une équipe 100 % senior avec plus de 7 ans d''expérience en production, facturée au résultat (nous facturons la valeur livrée, pas les heures) et async-first avec des démos hebdomadaires. Nous avons livré plus de 50 projets dans plus de 40 pays avec 98 % de fidélisation.", "es": "Somos un equipo solo senior con más de 7 años de experiencia en producción, cobramos por resultados (el valor entregado, no las horas) y trabajamos de forma asíncrona con demos semanales. Hemos entregado más de 50 proyectos en más de 40 países con un 98 % de retención de clientes."}'::jsonb,
   'general', 'manual', 90, true, true),
  ('contact-info',
   '{"en": "How can I contact Stratifit?", "de": "Wie kann ich Stratifit kontaktieren?", "fr": "Comment contacter Stratifit ?", "es": "¿Cómo puedo contactar con Stratifit?"}'::jsonb,
   '{"en": "You can reach us through the contact form on the Contact page (/contact). We typically respond within 24 hours. You can also book a free strategy call through the site.", "de": "Sie erreichen uns über das Kontaktformular auf der Kontaktseite (/contact). Wir antworten in der Regel innerhalb von 24 Stunden. Sie können über die Website auch ein kostenloses Strategiegespräch buchen.", "fr": "Vous pouvez nous joindre via le formulaire de contact sur la page Contact (/contact). Nous répondons généralement sous 24 heures. Vous pouvez aussi réserver un appel stratégie gratuit sur le site.", "es": "Puede contactarnos a través del formulario de la página de Contacto (/contact). Normalmente respondemos en menos de 24 horas. También puede reservar una llamada estratégica gratuita a través del sitio."}'::jsonb,
   'general', 'manual', 90, true, true),

  -- =========================================================================
  -- Services
  -- =========================================================================
  ('service-brand-design',
   '{"en": "What does Brand Design include?", "de": "Was umfasst die Markengestaltung?", "fr": "Que comprend le design de marque ?", "es": "¿Qué incluye el diseño de marca?"}'::jsonb,
   '{"en": "Brand Design covers brand strategy, logo design, visual identity, color systems, typography, brand guidelines, and asset kits. It creates a distinctive identity that communicates credibility and strategic positioning.", "de": "Markengestaltung umfasst Markenstrategie, Logo-Design, visuelle Identität, Farbsysteme, Typografie, Markenrichtlinien und Asset-Kits. Sie schafft eine unverwechselbare Identität, die Glaubwürdigkeit und strategische Positionierung vermittelt.", "fr": "Le design de marque comprend la stratégie de marque, le design de logo, l''identité visuelle, les systèmes de couleurs, la typographie, les directives de marque et les kits d''assets. Il crée une identité distinctive qui communique crédibilité et positionnement stratégique.", "es": "El diseño de marca incluye estrategia de marca, diseño de logo, identidad visual, sistemas de colores, tipografía, directrices de marca y kits de recursos. Crea una identidad distintiva que comunica credibilidad y posicionamiento estratégico."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('service-website-development',
   '{"en": "What types of websites do you build?", "de": "Welche Arten von Websites bauen Sie?", "fr": "Quels types de sites web construisez-vous ?", "es": "¿Qué tipos de sitios web construyen?"}'::jsonb,
   '{"en": "We build custom websites, e-commerce stores, web applications, and multilingual sites, with CMS integration, performance optimization, and maintenance. Our sites are engineered for speed, scalability, and conversion.", "de": "Wir bauen individuelle Websites, E-Commerce-Shops, Webanwendungen und mehrsprachige Websites, mit CMS-Integration, Performance-Optimierung und Wartung. Unsere Websites sind auf Geschwindigkeit, Skalierbarkeit und Conversion ausgelegt.", "fr": "Nous construisons des sites sur mesure, des boutiques e-commerce, des applications web et des sites multilingues, avec intégration CMS, optimisation des performances et maintenance. Nos sites sont conçus pour la vitesse, la scalabilité et la conversion.", "es": "Construimos sitios web personalizados, tiendas de e-commerce, aplicaciones web y sitios multilingües, con integración de CMS, optimización de rendimiento y mantenimiento. Nuestros sitios están diseñados para velocidad, escalabilidad y conversión."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('service-ai-automation',
   '{"en": "What does AI and Automation include?", "de": "Was umfasst KI und Automatisierung?", "fr": "Que comprend l''IA et l''automatisation ?", "es": "¿Qué incluye la IA y la automatización?"}'::jsonb,
   '{"en": "We build AI chatbots, FAQ assistants, lead qualification, workflow automation, CRM integration, custom APIs, and email automation. These systems reduce repetitive work and improve customer communication.", "de": "Wir erstellen KI-Chatbots, FAQ-Assistenten, Lead-Qualifizierung, Workflow-Automatisierung, CRM-Integration, individuelle APIs und E-Mail-Automatisierung. Diese Systeme reduzieren repetitive Arbeit und verbessern die Kundenkommunikation.", "fr": "Nous créons des chatbots IA, des assistants FAQ, la qualification de leads, l''automatisation des workflows, l''intégration CRM, des APIs sur mesure et l''automatisation des emails. Ces systèmes réduisent le travail répétitif et améliorent la communication client.", "es": "Creamos chatbots con IA, asistentes de FAQ, calificación de leads, automatización de flujos de trabajo, integración con CRM, APIs personalizadas y automatización de correos. Estos sistemas reducen el trabajo repetitivo y mejoran la comunicación con los clientes."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('service-growth-marketing',
   '{"en": "What does Growth Marketing include?", "de": "Was umfasst Growth Marketing?", "fr": "Que comprend le marketing de croissance ?", "es": "¿Qué incluye el marketing de crecimiento?"}'::jsonb,
   '{"en": "Growth Marketing covers SEO, SEM, performance marketing, content strategy, social media, conversion rate optimization, analytics, and growth audits. We build data-driven systems that improve visibility and attract qualified audiences.", "de": "Growth Marketing umfasst SEO, SEM, Performance-Marketing, Content-Strategie, Social Media, Conversion-Optimierung, Analytics und Growth-Audits. Wir bauen datengetriebene Systeme, die Sichtbarkeit verbessern und qualifizierte Zielgruppen anziehen.", "fr": "Le marketing de croissance comprend le SEO, le SEM, le marketing de performance, la stratégie de contenu, les réseaux sociaux, l''optimisation du taux de conversion, l''analytique et les audits de croissance. Nous créons des systèmes basés sur les données qui améliorent la visibilité et attirent des audiences qualifiées.", "es": "El marketing de crecimiento incluye SEO, SEM, marketing de rendimiento, estrategia de contenido, redes sociales, optimización de conversión, analítica y auditorías de crecimiento. Construimos sistemas basados en datos que mejoran la visibilidad y atraen audiencias cualificadas."}'::jsonb,
   'services', 'manual', 80, true, true),
  ('existing-systems',
   '{"en": "Can you work with our existing systems and tools?", "de": "Können Sie mit unseren bestehenden Systemen arbeiten?", "fr": "Pouvez-vous travailler avec nos systèmes existants ?", "es": "¿Pueden trabajar con nuestros sistemas existentes?"}'::jsonb,
   '{"en": "Yes. We integrate with your existing stack, whether it is a CMS, CRM, or your own systems, and we document every integration.", "de": "Ja. Wir integrieren uns in Ihren bestehenden Stack, ob CMS, CRM oder eigene Systeme, und dokumentieren jede Integration.", "fr": "Oui. Nous nous intégrons à votre stack existant, que ce soit un CMS, un CRM ou vos propres systèmes, et nous documentons chaque intégration.", "es": "Sí. Nos integramos con su stack existente, ya sea un CMS, un CRM o sus propios sistemas, y documentamos cada integración."}'::jsonb,
   'services', 'manual', 60, true, true),

  -- =========================================================================
  -- Pricing
  -- =========================================================================
  ('pricing-overview',
   '{"en": "How much does a project cost?", "de": "Was kostet ein Projekt?", "fr": "Combien coûte un projet ?", "es": "¿Cuánto cuesta un proyecto?"}'::jsonb,
   '{"en": "Our packages are Launch at $5,000, Grow at $12,000, and Scale at $25,000, with Custom projects quoted individually. Final pricing depends on scope and requirements - contact us for a tailored quote.", "de": "Unsere Pakete sind Launch für 5.000 $, Grow für 12.000 $ und Scale für 25.000 $, individuelle Projekte werden separat angeboten. Der endgültige Preis hängt vom Umfang und den Anforderungen ab - kontaktieren Sie uns für ein individuelles Angebot.", "fr": "Nos forfaits sont Launch à 5 000 $, Grow à 12 000 $ et Scale à 25 000 $, avec des projets sur mesure devisés individuellement. Le prix final dépend du périmètre et des besoins - contactez-nous pour un devis personnalisé.", "es": "Nuestros paquetes son Launch por $5,000, Grow por $12,000 y Scale por $25,000, con proyectos personalizados cotizados individualmente. El precio final depende del alcance y los requisitos: contáctenos para un presupuesto a medida."}'::jsonb,
   'pricing', 'manual', 100, true, true),
  ('pricing-launch',
   '{"en": "What is included in the Launch package?", "de": "Was ist im Launch-Paket enthalten?", "fr": "Que comprend le forfait Launch ?", "es": "¿Qué incluye el paquete Launch?"}'::jsonb,
   '{"en": "The Launch package ($5,000) includes identity and logo design, a 5-page responsive website, basic SEO setup, and 2 weeks of support. It is perfect for startups needing an MVP and brand foundation.", "de": "Das Launch-Paket (5.000 $) umfasst Identität und Logo-Design, eine 5-seitige responsive Website, Basis-SEO-Setup und 2 Wochen Support. Es ist perfekt für Startups, die ein MVP und ein Markenfundament benötigen.", "fr": "Le forfait Launch (5 000 $) comprend l''identité et le design de logo, un site responsive de 5 pages, une configuration SEO de base et 2 semaines de support. Il est parfait pour les startups ayant besoin d''un MVP et de fondations de marque.", "es": "El paquete Launch ($5,000) incluye identidad y diseño de logo, un sitio web responsive de 5 páginas, configuración SEO básica y 2 semanas de soporte. Es perfecto para startups que necesitan un MVP y una base de marca."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('pricing-grow',
   '{"en": "What is included in the Grow package?", "de": "Was ist im Grow-Paket enthalten?", "fr": "Que comprend le forfait Grow ?", "es": "¿Qué incluye el paquete Grow?"}'::jsonb,
   '{"en": "The Grow package ($12,000) includes a full brand system, a custom web app or e-commerce site, CMS integration, 3 months of growth marketing, and 30 days of post-launch support. It is for brands ready to capture market share and scale.", "de": "Das Grow-Paket (12.000 $) umfasst ein vollständiges Markensystem, eine individuelle Web-App oder E-Commerce-Seite, CMS-Integration, 3 Monate Growth Marketing und 30 Tage Support nach dem Launch. Es ist für Marken gedacht, die Marktanteile gewinnen und skalieren möchten.", "fr": "Le forfait Grow (12 000 $) comprend un système de marque complet, une web app sur mesure ou un site e-commerce, une intégration CMS, 3 mois de marketing de croissance et 30 jours de support post-lancement. Il est destiné aux marques prêtes à conquérir des parts de marché et à se développer.", "es": "El paquete Grow ($12,000) incluye un sistema de marca completo, una web app personalizada o un sitio de e-commerce, integración de CMS, 3 meses de marketing de crecimiento y 30 días de soporte posterior al lanzamiento. Es para marcas listas para ganar cuota de mercado y escalar."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('pricing-scale',
   '{"en": "What is included in the Scale package?", "de": "Was ist im Scale-Paket enthalten?", "fr": "Que comprend le forfait Scale ?", "es": "¿Qué incluye el paquete Scale?"}'::jsonb,
   '{"en": "The Scale package ($25,000) includes complex systems architecture, a dedicated product team, an AI and automation suite, a full growth engine setup, and 24/7 SLA support. It is for established companies.", "de": "Das Scale-Paket (25.000 $) umfasst komplexe Systemarchitektur, ein dediziertes Produktteam, eine KI- und Automatisierungs-Suite, ein vollständiges Growth-Engine-Setup und 24/7-SLA-Support. Es ist für etablierte Unternehmen gedacht.", "fr": "Le forfait Scale (25 000 $) comprend l''architecture de systèmes complexes, une équipe produit dédiée, une suite IA et automatisation, une configuration complète du moteur de croissance et un support SLA 24/7. Il est destiné aux entreprises établies.", "es": "El paquete Scale ($25,000) incluye arquitectura de sistemas complejos, un equipo de producto dedicado, una suite de IA y automatización, una configuración completa del motor de crecimiento y soporte SLA 24/7. Es para empresas establecidas."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('pricing-custom',
   '{"en": "Do you offer custom or tailored projects?", "de": "Bieten Sie individuelle Projekte an?", "fr": "Proposez-vous des projets sur mesure ?", "es": "¿Ofrecen proyectos personalizados?"}'::jsonb,
   '{"en": "Yes. The Custom option is for unique challenges and enterprise scale: custom scope and timeline, a multi-discipline team, unlimited revisions, a dedicated account manager, and priority support. Contact us to discuss your project.", "de": "Ja. Die Custom-Option ist für einzigartige Herausforderungen und Enterprise-Skalierung gedacht: individueller Umfang und Zeitplan, ein multidisziplinäres Team, unbegrenzte Überarbeitungen, ein dedizierter Account-Manager und priorisierter Support. Kontaktieren Sie uns, um Ihr Projekt zu besprechen.", "fr": "Oui. L''option Sur mesure est destinée aux défis uniques et à l''échelle entreprise : périmètre et calendrier personnalisés, équipe multidisciplinaire, révisions illimitées, gestionnaire de compte dédié et support prioritaire. Contactez-nous pour discuter de votre projet.", "es": "Sí. La opción Personalizado es para desafíos únicos y escala empresarial: alcance y cronograma personalizados, equipo multidisciplinario, revisiones ilimitadas, gerente de cuenta dedicado y soporte prioritario. Contáctenos para hablar de su proyecto."}'::jsonb,
   'pricing', 'manual', 90, true, true),
  ('payment-terms',
   '{"en": "How are payments structured?", "de": "Wie sind die Zahlungen strukturiert?", "fr": "Comment sont structurés les paiements ?", "es": "¿Cómo se estructuran los pagos?"}'::jsonb,
   '{"en": "Payments are milestone-based. A down payment starts the project, further installments follow each delivery stage, and the final payment is due at launch.", "de": "Zahlungen erfolgen meilensteinbasiert. Eine Anzahlung startet das Projekt, weitere Raten folgen nach jeder Lieferphase, und die Schlusszahlung ist zum Launch fällig.", "fr": "Les paiements sont échelonnés par jalons. Un acompte démarre le projet, des versements suivent chaque étape de livraison, et le paiement final est dû au lancement.", "es": "Los pagos se realizan por hitos. Un anticipo inicia el proyecto, los siguientes pagos se abonan tras cada fase de entrega y el pago final vence en el lanzamiento."}'::jsonb,
   'pricing', 'manual', 80, true, true),

  -- =========================================================================
  -- Process / Timelines
  -- =========================================================================
  ('process-overview',
   '{"en": "What is your process?", "de": "Wie läuft Ihr Prozess ab?", "fr": "Quel est votre processus ?", "es": "¿Cuál es su proceso?"}'::jsonb,
   '{"en": "Our process has four steps: Discovery (understanding your goals, audience, and challenges), Strategy (a comprehensive plan covering brand, web, AI, and growth), Build (implementation with precision engineering), and Launch and Grow (optimizing, scaling, and measuring everything).", "de": "Unser Prozess hat vier Schritte: Discovery (Verständnis Ihrer Ziele, Zielgruppe und Herausforderungen), Strategie (ein umfassender Plan für Marke, Web, KI und Wachstum), Umsetzung (Implementierung mit präziser Ingenieurskunst) und Start und Wachstum (Optimierung, Skalierung und Messung von allem).", "fr": "Notre processus comporte quatre étapes : Découverte (comprendre vos objectifs, votre audience et vos défis), Stratégie (un plan complet couvrant la marque, le web, l''IA et la croissance), Création (mise en œuvre avec une ingénierie de précision) et Lancement et croissance (optimiser, développer et mesurer tout).", "es": "Nuestro proceso tiene cuatro pasos: Descubrimiento (entender sus objetivos, audiencia y desafíos), Estrategia (un plan integral que cubre marca, web, IA y crecimiento), Construcción (implementación con ingeniería de precisión) y Lanzamiento y crecimiento (optimizar, escalar y medir todo)."}'::jsonb,
   'process', 'manual', 90, true, true),
  ('project-timeline',
   '{"en": "How long does a typical project take?", "de": "Wie lange dauert ein typisches Projekt?", "fr": "Combien de temps prend un projet typique ?", "es": "¿Cuánto tarda un proyecto típico?"}'::jsonb,
   '{"en": "A standard branding project spans 4-6 weeks from discovery to final delivery. Website projects and larger engagements vary by scope. We define clear timelines together before starting.", "de": "Ein Standard-Branding-Projekt dauert 4-6 Wochen von der Discovery bis zur finalen Auslieferung. Website-Projekte und größere Engagements variieren je nach Umfang. Wir definieren klare Zeitpläne gemeinsam, bevor wir starten.", "fr": "Un projet de branding standard s''étend sur 4 à 6 semaines, de la découverte à la livraison finale. Les projets web et les engagements plus importants varient selon le périmètre. Nous définissons ensemble des délais clairs avant de commencer.", "es": "Un proyecto de branding estándar dura de 4 a 6 semanas, desde el descubrimiento hasta la entrega final. Los proyectos web y los compromisos más grandes varían según el alcance. Definimos plazos claros juntos antes de comenzar."}'::jsonb,
   'process', 'manual', 90, true, true),
  ('tech-stack',
   '{"en": "Which technologies do you use?", "de": "Welche Technologien verwenden Sie?", "fr": "Quelles technologies utilisez-vous ?", "es": "¿Qué tecnologías utilizan?"}'::jsonb,
   '{"en": "We build with Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL), and GSAP, hosted on Vercel. It is a modern, fast, and scalable stack.", "de": "Wir entwickeln mit Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL) und GSAP, gehostet auf Vercel. Es ist ein moderner, schneller und skalierbarer Stack.", "fr": "Nous développons avec Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL) et GSAP, hébergés sur Vercel. C''est une stack moderne, rapide et scalable.", "es": "Desarrollamos con Next.js, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL) y GSAP, alojados en Vercel. Es un stack moderno, rápido y escalable."}'::jsonb,
   'process', 'manual', 70, true, true),
  ('post-launch-support',
   '{"en": "Do you offer post-launch support?", "de": "Bieten Sie Support nach dem Launch an?", "fr": "Proposez-vous un support après le lancement ?", "es": "¿Ofrecen soporte después del lanzamiento?"}'::jsonb,
   '{"en": "Yes. Every engagement includes a post-launch support window, and ongoing care plans are available to keep your systems optimized and updated.", "de": "Ja. Jedes Projekt umfasst ein Support-Fenster nach dem Launch, und laufende Pflegepläne halten Ihre Systeme optimiert und aktuell.", "fr": "Oui. Chaque mission inclut une période de support après le lancement, et des plans de maintenance continue gardent vos systèmes optimisés et à jour.", "es": "Sí. Cada proyecto incluye una ventana de soporte posterior al lanzamiento, y hay planes de mantenimiento continuo disponibles para mantener sus sistemas optimizados y actualizados."}'::jsonb,
   'process', 'manual', 80, true, true),
  ('ongoing-marketing',
   '{"en": "Do you handle marketing after launch?", "de": "Übernehmen Sie das Marketing nach dem Launch?", "fr": "Gérez-vous le marketing après le lancement ?", "es": "¿Se encargan del marketing después del lanzamiento?"}'::jsonb,
   '{"en": "Yes. We offer growth retainers for SEO, paid media, and conversion optimization to achieve continuous results even after launch.", "de": "Ja. Wir bieten Growth-Retainer für SEO, Paid Media und Conversion-Optimierung an, um auch nach dem Launch kontinuierliche Ergebnisse zu erzielen.", "fr": "Oui. Nous proposons des formules de growth pour le SEO, les médias payants et l''optimisation de la conversion afin d''obtenir des résultats continus même après le lancement.", "es": "Sí. Ofrecemos retainer de growth para SEO, medios de pago y optimización de conversión para lograr resultados continuos incluso después del lanzamiento."}'::jsonb,
   'process', 'manual', 70, true, true),
  ('success-measurement',
   '{"en": "How do you measure success?", "de": "Wie messen Sie Erfolg?", "fr": "Comment mesurez-vous le succès ?", "es": "¿Cómo miden el éxito?"}'::jsonb,
   '{"en": "We define success together in advance based on clear KPIs and report on it transparently throughout the entire project.", "de": "Wir definieren den Erfolg vorab gemeinsam anhand klarer KPIs und berichten transparent während des gesamten Projekts darüber.", "fr": "Nous définissons le succès ensemble à l''avance sur la base de KPI clairs et en rendons compte de manière transparente tout au long du projet.", "es": "Definimos el éxito juntos de antemano a partir de KPI claros e informamos de ello de forma transparente durante todo el proyecto."}'::jsonb,
   'process', 'manual', 60, true, true),
  ('ai-approach',
   '{"en": "What is your approach to AI and automation?", "de": "Wie gehen Sie mit KI und Automatisierung um?", "fr": "Quelle est votre approche de l''IA et de l''automatisation ?", "es": "¿Cuál es su enfoque de la IA y la automatización?"}'::jsonb,
   '{"en": "We identify valuable, repetitive processes and implement AI and automation where they deliver measurable time and cost savings.", "de": "Wir identifizieren wertvolle, wiederkehrende Prozesse und setzen KI und Automatisierung dort ein, wo sie messbare Zeit- und Kostenersparnisse bringen.", "fr": "Nous identifions les processus répétitifs à forte valeur et mettons en œuvre l''IA et l''automatisation là où elles apportent des gains de temps et de coûts mesurables.", "es": "Identificamos procesos valiosos y repetitivos e implementamos IA y automatización donde generan ahorros de tiempo y costos medibles."}'::jsonb,
   'services', 'manual', 70, true, true),

  -- =========================================================================
  -- Multilingual / International
  -- =========================================================================
  ('multilingual-sites',
   '{"en": "Do you build multilingual websites?", "de": "Bauen Sie mehrsprachige Websites?", "fr": "Construisez-vous des sites multilingues ?", "es": "¿Construyen sitios web multilingües?"}'::jsonb,
   '{"en": "Yes. We build websites in four languages: English, German, French, and Spanish. All content, navigation, and SEO metadata are localized with automatic fallback to English.", "de": "Ja. Wir bauen Websites in vier Sprachen: Englisch, Deutsch, Französisch und Spanisch. Alle Inhalte, Navigation und SEO-Metadaten sind lokalisiert, mit automatischem Fallback auf Englisch.", "fr": "Oui. Nous construisons des sites web en quatre langues : anglais, allemand, français et espagnol. Tout le contenu, la navigation et les métadonnées SEO sont localisés avec repli automatique sur l''anglais.", "es": "Sí. Construimos sitios web en cuatro idiomas: inglés, alemán, francés y español. Todo el contenido, la navegación y los metadatos SEO están localizados con respaldo automático al inglés."}'::jsonb,
   'general', 'manual', 80, true, true),
  ('international',
   '{"en": "Do you work internationally?", "de": "Arbeiten Sie international?", "fr": "Travaillez-vous à l''international ?", "es": "¿Trabajan internacionalmente?"}'::jsonb,
   '{"en": "Yes. We work with clients across 40+ countries. Our platform is fully multilingual and our team is async-first, so we collaborate smoothly across time zones.", "de": "Ja. Wir arbeiten mit Kunden in über 40 Ländern. Unsere Plattform ist vollständig mehrsprachig und unser Team arbeitet asynchron, sodass wir reibungslos über Zeitzonen hinweg zusammenarbeiten.", "fr": "Oui. Nous travaillons avec des clients dans plus de 40 pays. Notre plateforme est entièrement multilingue et notre équipe est async-first, ce qui permet une collaboration fluide entre les fuseaux horaires.", "es": "Sí. Trabajamos con clientes en más de 40 países. Nuestra plataforma es totalmente multilingüe y nuestro equipo trabaja de forma asíncrona, por lo que colaboramos sin problemas entre zonas horarias."}'::jsonb,
   'general', 'manual', 80, true, true),

  -- =========================================================================
  -- Acquisition / Buy a Business
  -- =========================================================================
  ('buy-business',
   '{"en": "Can you help me buy a business?", "de": "Können Sie mir beim Unternehmenskauf helfen?", "fr": "Pouvez-vous m''aider à acheter une entreprise ?", "es": "¿Pueden ayudarme a comprar un negocio?"}'::jsonb,
   '{"en": "Yes. We curate vetted digital businesses for acquisition across niches like e-commerce, SaaS, agencies, AI tools, personal brands, and local businesses. We support due diligence and guide you through the transition. See /buy-business for details.", "de": "Ja. Wir kuratieren geprüfte digitale Unternehmen zur Übernahme in Nischen wie E-Commerce, SaaS, Agenturen, KI-Tools, persönliche Marken und lokale Unternehmen. Wir unterstützen bei der Due Diligence und begleiten Sie durch den Übergang. Details unter /buy-business.", "fr": "Oui. Nous sélectionnons des entreprises numériques vérifiées à acquérir dans des niches comme l''e-commerce, le SaaS, les agences, les outils IA, les marques personnelles et les entreprises locales. Nous accompagnons la due diligence et guidons la transition. Voir /buy-business.", "es": "Sí. Seleccionamos negocios digitales verificados para adquirir en nichos como e-commerce, SaaS, agencias, herramientas de IA, marcas personales y negocios locales. Apoyamos la debida diligencia y guiamos la transición. Consulte /buy-business."}'::jsonb,
   'general', 'manual', 80, true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  content_translations = EXCLUDED.content_translations,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  is_enabled = EXCLUDED.is_enabled,
  is_ai_eligible = EXCLUDED.is_ai_eligible,
  source_type = EXCLUDED.source_type;

-- =============================================================================
-- Enable the main chatbot and set multilingual welcome/escalation messages.
-- =============================================================================

INSERT INTO public.chatbot_settings (
  singleton_key, is_enabled, welcome_message_translations,
  escalation_message_translations, fallback_message_translations,
  allowed_categories, response_style
)
VALUES (
  true,
  true,
  '{"en": "Hi! I am the Stratifit assistant. Ask me about our services, pricing, process, or how we can help your business.", "de": "Hallo! Ich bin der Stratifit-Assistent. Fragen Sie mich zu unseren Leistungen, Preisen, Prozessen oder wie wir Ihrem Unternehmen helfen können.", "fr": "Bonjour ! Je suis l''assistant Stratifit. Posez-moi des questions sur nos services, nos tarifs, notre processus ou la façon dont nous pouvons aider votre entreprise.", "es": "¡Hola! Soy el asistente de Stratifit. Pregúntame sobre nuestros servicios, precios, procesos o cómo podemos ayudar a tu negocio."}'::jsonb,
  '{"en": "A team member has been notified and will join this chat shortly.", "de": "Ein Teammitglied wurde benachrichtigt und wird sich gleich diesem Chat anschließen.", "fr": "Un membre de l''équipe a été prévenu et rejoindra bientôt cette conversation.", "es": "Se ha notificado a un miembro del equipo y se unirá a este chat en breve."}'::jsonb,
  '{"en": "I could not find a clear answer to that. A team member has been notified and will help you shortly.", "de": "Ich konnte dazu keine klare Antwort finden. Ein Teammitglied wurde benachrichtigt und hilft Ihnen gleich weiter.", "fr": "Je n''ai pas trouvé de réponse claire à cela. Un membre de l''équipe a été prévenu et vous aidera bientôt.", "es": "No pude encontrar una respuesta clara a eso. Se ha notificado a un miembro del equipo y le ayudará en breve."}'::jsonb,
  ARRAY['general', 'services', 'pricing', 'process', 'acquisition'],
  'professional'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  welcome_message_translations = EXCLUDED.welcome_message_translations,
  escalation_message_translations = EXCLUDED.escalation_message_translations,
  fallback_message_translations = EXCLUDED.fallback_message_translations,
  allowed_categories = EXCLUDED.allowed_categories,
  response_style = EXCLUDED.response_style;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DELETE FROM public.chatbot_knowledge WHERE source_type = 'manual' AND slug IN (
--   'about-stratifit', 'services-overview', 'why-choose-us', 'contact-info',
--   'service-brand-design', 'service-website-development', 'service-ai-automation',
--   'service-growth-marketing', 'existing-systems',
--   'pricing-overview', 'pricing-launch', 'pricing-grow', 'pricing-scale',
--   'pricing-custom', 'payment-terms',
--   'process-overview', 'project-timeline', 'tech-stack', 'post-launch-support',
--   'ongoing-marketing', 'success-measurement', 'ai-approach',
--   'multilingual-sites', 'international', 'buy-business'
-- );
