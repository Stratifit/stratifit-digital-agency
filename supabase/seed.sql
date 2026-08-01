-- Seed Data: Stratifit Digital Agency Platform
-- Description: Predictable development content for all major content types.
-- Safe to rerun: Uses ON CONFLICT for idempotency.
-- No production secrets included.

-- =============================================================================
-- Site Settings (Singleton)
-- =============================================================================

INSERT INTO public.site_settings (singleton_key, site_name, site_description_translations, contact_email, default_locale, supported_locales, default_seo)
VALUES (
  true,
  'Stratifit',
  '{"en": "Premium digital agency specializing in brand design, website development, AI automation, and growth marketing.", "de": "Premium-Digitalagentur spezialisiert auf Branding, Webentwicklung, KI-Automatisierung und Growth Marketing.", "fr": "Agence digitale premium spécialisée en design de marque, développement web, automatisation IA et marketing de croissance.", "es": "Agencia digital premium especializada en diseño de marca, desarrollo web, automatización de IA y marketing de crecimiento."}'::jsonb,
  'hello@stratifit.com',
  'en',
  ARRAY['en', 'de', 'fr', 'es'],
  '{"en": {"title": "Stratifit | Premium Digital Agency", "description": "We build premium digital experiences that drive growth."}}'::jsonb
)
ON CONFLICT (singleton_key) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_description_translations = EXCLUDED.site_description_translations,
  contact_email = EXCLUDED.contact_email,
  default_locale = EXCLUDED.default_locale,
  supported_locales = EXCLUDED.supported_locales,
  default_seo = EXCLUDED.default_seo;

-- =============================================================================
-- Announcement Bar (Singleton)
-- =============================================================================

INSERT INTO public.announcement_bar (singleton_key, message_translations, slides, link_label_translations, link_url, is_enabled, variant)
VALUES (
  true,
  '{"en": "We are now offering AI-powered business automation. Learn more.", "de": "Wir bieten jetzt KI-gestützte Geschäftsautomatisierung an. Erfahren Sie mehr.", "fr": "Nous proposons désormais l automatisation d entreprises par l IA. En savoir plus.", "es": "Ahora ofrecemos automatización empresarial con IA. Más información."}'::jsonb,
  '[
    {"en": "We are now offering AI-powered business automation.", "de": "Wir bieten jetzt KI-gestützte Geschäftsautomatisierung an.", "fr": "Nous proposons désormais l automatisation d entreprises par l IA.", "es": "Ahora ofrecemos automatización empresarial con IA."},
    {"en": "New: multilingual websites in four languages.", "de": "Neu: mehrsprachige Websites in vier Sprachen.", "fr": "Nouveau : sites web multilingues en quatre langues.", "es": "Nuevo: sitios web multilingües en cuatro idiomas."},
    {"en": "Book a free strategy call today.", "de": "Buchen Sie noch heute ein kostenloses Strategiegespräch.", "fr": "Réservez un appel stratégie gratuit dès aujourd hui.", "es": "Reserva una llamada estratégica gratuita hoy."}
  ]'::jsonb,
  '{"en": "Learn More", "de": "Mehr erfahren", "fr": "En savoir plus", "es": "Más información"}'::jsonb,
  '/acquisition',
  true,
  'primary'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  message_translations = EXCLUDED.message_translations,
  slides = EXCLUDED.slides,
  link_label_translations = EXCLUDED.link_label_translations,
  link_url = EXCLUDED.link_url,
  is_enabled = EXCLUDED.is_enabled,
  variant = EXCLUDED.variant;

-- =============================================================================
-- Navigation Items (Header)
-- Stable UUIDs for idempotent re-runs.
-- =============================================================================

INSERT INTO public.navigation_items (id, location, label_translations, href, display_order, is_visible)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'header', '{"en": "Home", "de": "Startseite", "fr": "Accueil", "es": "Inicio"}'::jsonb, '/', 1, true),
  ('10000000-0000-4000-8000-000000000002', 'header', '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb, '/services', 2, true),
  ('10000000-0000-4000-8000-000000000003', 'header', '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb, '/work', 3, true),
  ('10000000-0000-4000-8000-000000000004', 'header', '{"en": "Insights", "de": "Einblicke", "fr": "Insights", "es": "Perspectivas"}'::jsonb, '/insights', 4, true),
  ('10000000-0000-4000-8000-000000000005', 'header', '{"en": "About", "de": "Über uns", "fr": "À propos", "es": "Nosotros"}'::jsonb, '/about', 5, true),
  ('10000000-0000-4000-8000-000000000006', 'header', '{"en": "Acquisition", "de": "Akquise", "fr": "Acquisition", "es": "Adquisición"}'::jsonb, '/acquisition', 6, true),
  ('10000000-0000-4000-8000-000000000007', 'header', '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb, '/contact', 7, true)
ON CONFLICT (id) DO UPDATE SET
  label_translations = EXCLUDED.label_translations,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Footer Groups
-- Stable UUIDs for idempotent re-runs.
-- =============================================================================

INSERT INTO public.footer_groups (id, title_translations, display_order, is_visible)
VALUES
  ('20000000-0000-4000-8000-000000000001', '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb, 1, true),
  ('20000000-0000-4000-8000-000000000002', '{"en": "Company", "de": "Unternehmen", "fr": "Entreprise", "es": "Empresa"}'::jsonb, 2, true),
  ('20000000-0000-4000-8000-000000000003', '{"en": "Legal", "de": "Rechtliches", "fr": "Mentions légales", "es": "Legal"}'::jsonb, 3, true)
ON CONFLICT (id) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Footer Links
-- Stable UUIDs referencing the stable footer group IDs.
-- =============================================================================

INSERT INTO public.footer_links (id, group_id, label_translations, href, is_external, display_order, is_visible)
VALUES
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '{"en": "Services", "de": "Leistungen", "fr": "Services", "es": "Servicios"}'::jsonb, '/services', false, 1, true),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '{"en": "Work", "de": "Arbeiten", "fr": "Réalisations", "es": "Proyectos"}'::jsonb, '/work', false, 2, true),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', '{"en": "Acquisition", "de": "Akquise", "fr": "Acquisition", "es": "Adquisición"}'::jsonb, '/acquisition', false, 3, true),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000002', '{"en": "About", "de": "Über uns", "fr": "À propos", "es": "Nosotros"}'::jsonb, '/about', false, 1, true),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000002', '{"en": "Insights", "de": "Einblicke", "fr": "Insights", "es": "Perspectivas"}'::jsonb, '/insights', false, 2, true),
  ('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000002', '{"en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"}'::jsonb, '/contact', false, 3, true),
  ('30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000003', '{"en": "Privacy Policy", "de": "Datenschutz", "fr": "Politique de confidentialité", "es": "Política de privacidad"}'::jsonb, '/privacy', false, 1, true),
  ('30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000003', '{"en": "Imprint", "de": "Impressum", "fr": "Mentions légales", "es": "Aviso legal"}'::jsonb, '/imprint', false, 2, true)
ON CONFLICT (id) DO UPDATE SET
  group_id = EXCLUDED.group_id,
  label_translations = EXCLUDED.label_translations,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Hero (Singleton)
-- =============================================================================

INSERT INTO public.hero (singleton_key, eyebrow_translations, title_translations, highlight_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, variant, is_visible)
VALUES (
  true,
  '{"en": "Premium Digital Agency", "de": "Premium-Digitalagentur", "fr": "Agence Digitale Premium", "es": "Agencia Digital Premium"}'::jsonb,
  '{"en": "We Build Digital Experiences That Drive Growth", "de": "Wir erstellen digitale Erlebnisse, die Wachstum fördern", "fr": "Nous créons des expériences numériques qui stimulent la croissance", "es": "Creamos experiencias digitales que impulsan el crecimiento"}'::jsonb,
  '{"en": "Drive Growth", "de": "Wachstum fördern", "fr": "Stimuler la croissance", "es": "Impulsar el crecimiento"}'::jsonb,
  '{"en": "Stratifit combines brand strategy, cutting-edge development, AI automation, and data-driven marketing to help businesses scale with confidence.", "de": "Stratifit kombiniert Markenstrategie, modernste Entwicklung, KI-Automatisierung und datengetriebenes Marketing, um Unternehmen beim skalieren zu unterstützen.", "fr": "Stratifit combine stratégie de marque, développement de pointe, automatisation IA et marketing axé sur les données pour aider les entreprises à se développer en confiance.", "es": "Stratifit combina estrategia de marca, desarrollo de vanguardia, automatización de IA y marketing basado en datos para ayudar a las empresas a escalar con confianza."}'::jsonb,
  '{"en": "Start Your Project", "de": "Projekt starten", "fr": "Démarrer votre projet", "es": "Iniciar tu proyecto"}'::jsonb,
  '/contact',
  '{"en": "View Our Work", "de": "Unsere Arbeiten ansehen", "fr": "Voir nos réalisations", "es": "Ver nuestro trabajo"}'::jsonb,
  '/work',
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  primary_cta_label_translations = EXCLUDED.primary_cta_label_translations,
  primary_cta_url = EXCLUDED.primary_cta_url,
  secondary_cta_label_translations = EXCLUDED.secondary_cta_label_translations,
  secondary_cta_url = EXCLUDED.secondary_cta_url;

-- =============================================================================
-- Services (4 Core Services)
-- =============================================================================

INSERT INTO public.services (slug, title_translations, short_description_translations, full_description_translations, deliverables_translations, icon_name, cta_label_translations, cta_url, display_order, is_featured, is_visible, status)
VALUES
  ('brand-design',
   '{"en": "Brand Design", "de": "Markengestaltung", "fr": "Design de Marque", "es": "Diseño de Marca"}'::jsonb,
   '{"en": "Distinctive brand identities that communicate credibility and strategic positioning.", "de": "Einzigartige Markenidentitäten, die Glaubwürdigkeit und strategische Positionierung vermitteln.", "fr": "Identités de marque distinctives qui communiquent crédibilité et positionnement stratégique.", "es": "Identidades de marca distintivas que comunican credibilidad y posicionamiento estratégico."}'::jsonb,
   '{"en": "We create comprehensive brand systems that resonate with your audience and stand out in the market.", "de": "Wir erstellen umfassende Markensysteme, die bei Ihrer Zielgruppe ankommen und sich am Markt abheben.", "fr": "Nous créons des systèmes de marque complets qui résonnent avec votre public et se démarquent sur le marché.", "es": "Creamos sistemas de marca completos que resuenan con tu audiencia y destacan en el mercado."}'::jsonb,
   '{"en": ["Brand Strategy", "Logo Design", "Visual Identity", "Color Systems", "Typography", "Brand Guidelines", "Asset Kits"], "de": ["Markenstrategie", "Logo-Design", "Visuelle Identität", "Farbsysteme", "Typografie", "Markenrichtlinien", "Asset-Kits"], "fr": ["Stratégie de marque", "Design de logo", "Identité visuelle", "Systèmes de couleurs", "Typographie", "Directives de marque", "Kits d assets"], "es": ["Estrategia de marca", "Diseño de logo", "Identidad visual", "Sistemas de colores", "Tipografía", "Directrices de marca", "Kits de recursos"]}'::jsonb,
   'Palette',
   '{"en": "Start Branding", "de": "Branding starten", "fr": "Commencer le branding", "es": "Iniciar branding"}'::jsonb,
   '/contact',
   1,
   true,
   true,
   'published'
  ),
  ('website-development',
   '{"en": "Website Development", "de": "Webentwicklung", "fr": "Développement Web", "es": "Desarrollo Web"}'::jsonb,
   '{"en": "High-performance websites engineered for speed, scalability, and conversion.", "de": "Leistungsstarke Websites für Geschwindigkeit, Skalierbarkeit und Conversion optimiert.", "fr": "Sites web haute performance conçus pour la vitesse, la scalabilité et la conversion.", "es": "Sitios web de alto rendimiento diseñados para velocidad, escalabilidad y conversión."}'::jsonb,
   '{"en": "From custom business sites to complex web applications, we build digital experiences that perform.", "de": "Von individuellen Business-Websites bis hin zu komplexen Webanwendungen erstellen wir digitale Erlebnisse, die funktionieren.", "fr": "Des sites d entreprises aux applications web complexes, nous créons des expériences numériques performantes.", "es": "Desde sitios empresariales personalizados hasta aplicaciones web complejas, creamos experiencias digitales que funcionan."}'::jsonb,
   '{"en": ["Custom Websites", "E-commerce", "Web Applications", "CMS Integration", "Multilingual Sites", "Performance Optimization", "Maintenance"], "de": ["Individuelle Websites", "E-Commerce", "Webanwendungen", "CMS-Integration", "Mehrsprachige Sites", "Performance-Optimierung", "Wartung"], "fr": ["Sites sur mesure", "E-commerce", "Applications web", "Intégration CMS", "Sites multilingues", "Optimisation des performances", "Maintenance"], "es": ["Sitios web personalizados", "E-commerce", "Aplicaciones web", "Integración CMS", "Sitios multilingües", "Optimización de rendimiento", "Mantenimiento"]}'::jsonb,
   'Code',
   '{"en": "Start Development", "de": "Entwicklung starten", "fr": "Commencer le développement", "es": "Iniciar desarrollo"}'::jsonb,
   '/contact',
   2,
   true,
   true,
   'published'
  ),
  ('ai-automation',
   '{"en": "AI & Automation", "de": "KI & Automatisierung", "fr": "IA & Automatisation", "es": "IA y Automatización"}'::jsonb,
   '{"en": "Intelligent systems that reduce repetitive work and improve customer communication.", "de": "Intelligente Systeme, die repetitive Arbeit reduzieren und die Kundenkommunikation verbessern.", "fr": "Systèmes intelligents qui réduisent le travail répétitif et améliorent la communication client.", "es": "Sistemas inteligentes que reducen el trabajo repetitivo y mejoran la comunicación con clientes."}'::jsonb,
   '{"en": "We build AI-powered chatbots, FAQ assistants, workflow automation, and custom integrations that save time and improve efficiency.", "de": "Wir erstellen KI-gestützte Chatbots, FAQ-Assistenten, Workflow-Automatisierung und individuelle Integrationen, die Zeit sparen und die Effizienz verbessern.", "fr": "Nous créons des chatbots IA, des assistants FAQ, l automatisation des workflows et des intégrations sur mesure qui font gagner du temps et améliorent l efficacité.", "es": "Creamos chatbots con IA, asistentes de FAQ, automatización de flujos de trabajo e integraciones personalizadas que ahorran tiempo y mejoran la eficiencia."}'::jsonb,
   '{"en": ["AI Chatbots", "FAQ Assistants", "Lead Qualification", "Workflow Automation", "CRM Integration", "Custom APIs", "Email Automation"], "de": ["KI-Chatbots", "FAQ-Assistenten", "Lead-Qualifizierung", "Workflow-Automatisierung", "CRM-Integration", "Individuelle APIs", "E-Mail-Automatisierung"], "fr": ["Chatbots IA", "Assistants FAQ", "Qualification des leads", "Automatisation des workflows", "Intégration CRM", "APIs sur mesure", "Automatisation email"], "es": ["Chatbots con IA", "Asistentes de FAQ", "Calificación de leads", "Automatización de flujos", "Integración CRM", "APIs personalizadas", "Automatización de email"]}'::jsonb,
   'Brain',
   '{"en": "Explore AI Solutions", "de": "KI-Lösungen erkunden", "fr": "Découvrir les solutions IA", "es": "Explorar soluciones de IA"}'::jsonb,
   '/contact',
   3,
   true,
   true,
   'published'
  ),
  ('growth-marketing',
   '{"en": "Growth & Marketing", "de": "Growth & Marketing", "fr": "Croissance & Marketing", "es": "Crecimiento y Marketing"}'::jsonb,
   '{"en": "Data-driven growth systems that improve visibility and attract qualified audiences.", "de": "Datengetriebene Growth-Systeme, die Sichtbarkeit verbessern und qualifizierte Zielgruppen anziehen.", "fr": "Systèmes de croissance basés sur les données qui améliorent la visibilité et attirent des audiences qualifiées.", "es": "Sistemas de crecimiento basados en datos que mejoran la visibilidad y atraen audiencias cualificadas."}'::jsonb,
   '{"en": "From SEO to performance marketing, we develop strategies that deliver measurable results and sustainable growth.", "de": "Von SEO bis Performance-Marketing entwickeln wir Strategien, die messbare Ergebnisse und nachhaltiges Wachstum liefern.", "fr": "Du SEO au marketing de performance, nous développons des stratégies qui offrent des résultats mesurables et une croissance durable.", "es": "Desde SEO hasta marketing de rendimiento, desarrollamos estrategias que ofrecen resultados medibles y crecimiento sostenible."}'::jsonb,
   '{"en": ["SEO", "SEM", "Performance Marketing", "Content Strategy", "Social Media", "CRO", "Analytics", "Growth Audits"], "de": ["SEO", "SEM", "Performance-Marketing", "Content-Strategie", "Social Media", "CRO", "Analytics", "Growth-Audits"], "fr": ["SEO", "SEM", "Marketing de performance", "Stratégie de contenu", "Réseaux sociaux", "CRO", "Analytique", "Audits de croissance"], "es": ["SEO", "SEM", "Marketing de rendimiento", "Estrategia de contenido", "Redes sociales", "CRO", "Analítica", "Auditorías de crecimiento"]}'::jsonb,
   'TrendingUp',
   '{"en": "Start Growing", "de": "Wachstum starten", "fr": "Commencer à grandir", "es": "Empezar a crecer"}'::jsonb,
   '/contact',
   4,
   true,
   true,
   'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  short_description_translations = EXCLUDED.short_description_translations,
  full_description_translations = EXCLUDED.full_description_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  icon_name = EXCLUDED.icon_name,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status;

-- =============================================================================
-- Process Steps
-- =============================================================================

INSERT INTO public.process_steps (step_key, number, title_translations, description_translations, icon_name, display_order, is_visible)
VALUES
  ('discovery', 1,
   '{"en": "Discovery", "de": "Analyse", "fr": "Découverte", "es": "Descubrimiento"}'::jsonb,
   '{"en": "We learn about your business, goals, and challenges to create a strategic foundation.", "de": "Wir lernen Ihr Unternehmen, Ihre Ziele und Herausforderungen kennen, um eine strategische Grundlage zu schaffen.", "fr": "Nous apprenons à connaître votre entreprise, vos objectifs et vos défis pour créer une base stratégique.", "es": "Conocemos tu negocio, objetivos y desafíos para crear una base estratégica."}'::jsonb,
   'Search',
   1,
   true
  ),
  ('strategy', 2,
   '{"en": "Strategy", "de": "Strategie", "fr": "Stratégie", "es": "Estrategia"}'::jsonb,
   '{"en": "We develop a clear roadmap with defined milestones and measurable outcomes.", "de": "Wir entwickeln eine klare Roadmap mit defininten Meilensteinen und messbaren Ergebnissen.", "fr": "Nous développons une feuille de route claire avec des jalons définis et des résultats mesurables.", "es": "Desarrollamos una hoja de ruta clara con hitos definidos y resultados medibles."}'::jsonb,
   'Map',
   2,
   true
  ),
  ('execution', 3,
   '{"en": "Execution", "de": "Umsetzung", "fr": "Exécution", "es": "Ejecución"}'::jsonb,
   '{"en": "Our team brings the strategy to life with precision development and design.", "de": "Unser Team setzt die Strategie mit präziser Entwicklung und Gestaltung um.", "fr": "Notre équipe donne vie à la stratégie avec un développement et un design précis.", "es": "Nuestro equipo da vida a la estrategia con desarrollo y diseño precisos."}'::jsonb,
   'Rocket',
   3,
   true
  ),
  ('growth', 4,
   '{"en": "Growth", "de": "Wachstum", "fr": "Croissance", "es": "Crecimiento"}'::jsonb,
   '{"en": "We optimize, measure, and scale to ensure long-term success.", "de": "Wir optimieren, messen und skalieren für langfristigen Erfolg.", "fr": "Nous optimisons, mesurons et développons pour assurer le succès à long terme.", "es": "Optimizamos, medimos y escalamos para garantizar el éxito a largo plazo."}'::jsonb,
   'TrendingUp',
   4,
   true
  )
ON CONFLICT (step_key) DO UPDATE SET
  number = EXCLUDED.number,
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Why Choose Us (Singleton)
-- =============================================================================

INSERT INTO public.why_choose_us (singleton_key, eyebrow_translations, title_translations, description_translations, items, variant, is_visible)
VALUES (
  true,
  '{"en": "Why Choose Us", "de": "Warum wir", "fr": "Pourquoi nous choisir", "es": "Por qué elegirnos"}'::jsonb,
  '{"en": "Built for Results, Not Just Looks", "de": "Für Ergebnisse gebaut, nicht nur für Aussehen", "fr": "Conçu pour les résultats, pas seulement l apparence", "es": "Diseñado para resultados, no solo para verse bien"}'::jsonb,
  '{"en": "We combine strategic thinking with technical excellence to deliver digital experiences that actually work.", "de": "Wir kombinieren strategisches Denken mit technischer Exzellenz, um digitale Erlebnisse zu liefern, die wirklich funktionieren.", "fr": "Nous combinons réflexion stratégique et excellence technique pour offrir des expériences numériques qui fonctionnent vraiment.", "es": "Combinamos pensamiento estratégico con excelencia técnica para ofrecer experiencias digitales que realmente funcionan."}'::jsonb,
   '[{"icon": "Shield", "title": {"en": "Proven Expertise", "de": "Bewährte Expertise", "fr": "Expertise éprouvée", "es": "Experiencia comprobada"}, "description": {"en": "Years of experience delivering premium digital solutions.", "de": "Jahre der Erfahrung bei der Bereitstellung premium digitaler Lösungen.", "fr": "Des années dexpérience à livrer des solutions numériques premium.", "es": "Años de experiencia ofreciendo soluciones digitales premium."}}, {"icon": "Zap", "title": {"en": "Speed & Quality", "de": "Geschwindigkeit & Qualität", "fr": "Vitesse & Qualité", "es": "Velocidad y Calidad"}, "description": {"en": "Fast delivery without compromising on quality.", "de": "Schnelle Lieferung ohne Kompromisse bei der Qualität.", "fr": "Livraison rapide sans compromettre la qualité.", "es": "Entrega rápida sin comprometer la calidad."}}, {"icon": "Users", "title": {"en": "Client-Centric", "de": "Kundenorientiert", "fr": "Centré sur le client", "es": "Orientado al cliente"}, "description": {"en": "Your success is our primary metric.", "de": "Ihr Erfolg ist unser primärer Messwert.", "fr": "Votre succès est notre métrique principale.", "es": "Tu éxito es nuestra métrica principal."}}]'::jsonb,
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  items = EXCLUDED.items;

-- =============================================================================
-- Acquisition Section (Singleton)
-- =============================================================================

INSERT INTO public.acquisition_section (singleton_key, title_translations, description_translations, benefits, cta_label_translations, cta_url, variant, is_visible)
VALUES (
  true,
  '{"en": "Buy a Business", "de": "Unternehmen kaufen", "fr": "Acheter une entreprise", "es": "Comprar un negocio"}'::jsonb,
  '{"en": "Looking to acquire a digital business? We help you find and evaluate opportunities.", "de": "Sie möchten ein digitales Unternehmen erwerben? Wir helfen Ihnen, Opportunities zu finden und zu bewerten.", "fr": "Vous cherchez à acquérir une entreprise numérique ? Nous vous aidons à trouver et évaluer les opportunités.", "es": "¿Buscas adquirir un negocio digital? Te ayudamos a encontrar y evaluar oportunidades."}'::jsonb,
   '[{"icon": "Check", "text": {"en": "Curated opportunities", "de": "Kuratierte Möglichkeiten", "fr": "Opportunités sélectionnées", "es": "Oportunidades seleccionadas"}}, {"icon": "Check", "text": {"en": "Due diligence support", "de": "Due-Diligence-Unterstützung", "fr": "Support de due diligence", "es": "Apoyo de debida diligencia"}}, {"icon": "Check", "text": {"en": "Transition guidance", "de": "Übergangsberatung", "fr": "Accompagnement de transition", "es": "Guía de transición"}}]'::jsonb,
  '{"en": "Explore Opportunities", "de": "Möglichkeiten erkunden", "fr": "Explorer les opportunités", "es": "Explorar oportunidades"}'::jsonb,
  '/acquisition',
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  benefits = EXCLUDED.benefits,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url;

-- =============================================================================
-- Pricing Plans
-- =============================================================================

INSERT INTO public.pricing_plans (slug, name_translations, description_translations, price_label_translations, billing_label_translations, features_translations, limitations_translations, cta_label_translations, cta_url, display_order, is_featured, is_visible, status)
VALUES
  ('starter',
   '{"en": "Starter", "de": "Starter", "fr": "Starter", "es": "Starter"}'::jsonb,
   '{"en": "Perfect for small businesses launching their digital presence.", "de": "Perfekt für kleine Unternehmen, die ihre digitale Präsenz starten.", "fr": "Parfait pour les petites entreprises lancent leur présence numérique.", "es": "Perfecto para pequeñas empresas que inician su presencia digital."}'::jsonb,
   '{"en": "From $2,990", "de": "Ab $2.990", "fr": "À partir de 2 990 $", "es": "Desde $2,990"}'::jsonb,
   '{"en": "One-time project", "de": "Einmaliges Projekt", "fr": "Projet ponctuel", "es": "Proyecto único"}'::jsonb,
   '{"en": ["Brand Identity", "Custom Website", "Mobile Responsive", "Basic SEO", "3 Months Support"], "de": ["Markenidentität", "Individuelle Website", "Mobil optimiert", "Basis-SEO", "3 Monate Support"], "fr": ["Identité de marque", "Site sur mesure", "Responsive", "SEO de base", "3 mois de support"], "es": ["Identidad de marca", "Sitio web personalizado", "Responsivo", "SEO básico", "3 meses de soporte"]}'::jsonb,
   '{"en": ["E-commerce", "Custom Integrations", "Advanced Analytics"], "de": ["E-Commerce", "Individuelle Integrationen", "Erweiterte Analytics"], "fr": ["E-commerce", "Intégrations avancées", "Analytique avancée"], "es": ["E-commerce", "Integraciones personalizadas", "Analítica avanzada"]}'::jsonb,
   '{"en": "Get Started", "de": "Jetzt starten", "fr": "Commencer", "es": "Empezar"}'::jsonb,
   '/contact',
   1,
   false,
   true,
   'published'
  ),
  ('professional',
   '{"en": "Professional", "de": "Professionell", "fr": "Professionnel", "es": "Profesional"}'::jsonb,
   '{"en": "For growing businesses that need comprehensive digital solutions.", "de": "Für wachsende Unternehmen, die umfassende digitale Lösungen benötigen.", "fr": "Pour les entreprises en croissance qui ont besoin de solutions numériques complètes.", "es": "Para empresas en crecimiento que necesitan soluciones digitales completas."}'::jsonb,
   '{"en": "From $7,990", "de": "Ab $7.990", "fr": "À partir de 7 990 $", "es": "Desde $7,990"}'::jsonb,
   '{"en": "One-time project", "de": "Einmaliges Projekt", "fr": "Projet ponctuel", "es": "Proyecto único"}'::jsonb,
   '{"en": ["Full Brand System", "Custom Website", "CMS Integration", "AI Chatbot", "Advanced SEO", "6 Months Support"], "de": ["Vollständiges Markensystem", "Individuelle Website", "CMS-Integration", "KI-Chatbot", "Erweitertes SEO", "6 Monate Support"], "fr": ["Système de marque complet", "Site sur mesure", "Intégration CMS", "Chatbot IA", "SEO avancé", "6 mois de support"], "es": ["Sistema de marca completo", "Sitio web personalizado", "Integración CMS", "Chatbot con IA", "SEO avanzado", "6 meses de soporte"]}'::jsonb,
   '{"en": ["Custom Integrations", "Multi-language", "Priority Support"], "de": ["Individuelle Integrationen", "Mehrsprachig", "Prioritäts-Support"], "fr": ["Intégrations avancées", "Multilingue", "Support prioritaire"], "es": ["Integraciones personalizadas", "Multilingüe", "Soporte prioritario"]}'::jsonb,
   '{"en": "Get Started", "de": "Jetzt starten", "fr": "Commencer", "es": "Empezar"}'::jsonb,
   '/contact',
   2,
   true,
   true,
   'published'
  ),
  ('enterprise',
   '{"en": "Enterprise", "de": "Enterprise", "fr": "Enterprise", "es": "Enterprise"}'::jsonb,
   '{"en": "For established businesses requiring custom digital transformation.", "de": "Für etablierte Unternehmen, die eine individuelle digitale Transformation benötigen.", "fr": "Pour les entreprises établies nécessitant une transformation numérique sur mesure.", "es": "Para empresas establecidas que requieren transformación digital personalizada."}'::jsonb,
   '{"en": "Custom Quote", "de": "Individuelles Angebot", "fr": "Devis personnalisé", "es": "Cotización personalizada"}'::jsonb,
   '{"en": "Tailored to your needs", "de": "Auf Ihre Bedürfnisse zugeschnitten", "fr": "Adapté à vos besoins", "es": "Adaptado a tus necesidades"}'::jsonb,
   '{"en": ["Everything in Professional", "Custom AI Solutions", "Enterprise Integrations", "Dedicated Support", "SLA", "Training"], "de": ["Alles aus Professionell", "Individuelle KI-Lösungen", "Enterprise-Integrationen", "Dedizierter Support", "SLA", "Schulung"], "fr": ["Tout dans Professionnel", "Solutions IA personnalisées", "Intégrations Enterprise", "Support dédié", "SLA", "Formation"], "es": ["Todo en Profesional", "Soluciones de IA personalizadas", "Integraciones Enterprise", "Soporte dedicado", "SLA", "Capacitación"]}'::jsonb,
   '{"en": [], "de": [], "fr": [], "es": []}'::jsonb,
   '{"en": "Contact Us", "de": "Kontaktieren Sie uns", "fr": "Contactez-nous", "es": "Contáctanos"}'::jsonb,
   '/contact',
   3,
   false,
   true,
   'published'
  )
ON CONFLICT (slug) DO UPDATE SET
  name_translations = EXCLUDED.name_translations,
  description_translations = EXCLUDED.description_translations,
  price_label_translations = EXCLUDED.price_label_translations,
  billing_label_translations = EXCLUDED.billing_label_translations,
  features_translations = EXCLUDED.features_translations,
  limitations_translations = EXCLUDED.limitations_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status;

-- =============================================================================
-- FAQs
-- =============================================================================

INSERT INTO public.faqs (question_translations, answer_translations, category, display_order, is_featured, is_visible, is_ai_eligible, status)
VALUES
  ('{"en": "What services does Stratifit offer?", "de": "Welche Dienstleistungen bietet Stratifit an?", "fr": "Quels services offre Stratifit ?", "es": "¿Qué servicios ofrece Stratifit?"}'::jsonb,
   '{"en": "We offer brand design, website development, AI & automation, and growth marketing services.", "de": "Wir bieten Markengestaltung, Webentwicklung, KI & Automatisierung und Growth Marketing an.", "fr": "Nous offrons design de marque, développement web, IA & automatisation et marketing de croissance.", "es": "Ofrecemos diseño de marca, desarrollo web, IA y automatización, y marketing de crecimiento."}'::jsonb,
   'general',
   1,
   true,
   true,
   true,
   'published'
  ),
  ('{"en": "How long does a typical project take?", "de": "Wie lange dauert ein typisches Projekt?", "fr": "Combien de temps dure un projet typique ?", "es": "¿Cuánto tiempo dura un proyecto típico?"}'::jsonb,
   '{"en": "Project timelines vary based on scope. A typical website project takes 4-8 weeks.", "de": "Projektzeitpläne variieren je nach Umfang. Ein typisches Website-Projekt dauert 4-8 Wochen.", "fr": "Les délais varient selon la portée. Un projet de site web typique prend 4 à 8 semaines.", "es": "Los plazos varían según el alcance. Un proyecto de sitio web típico toma 4-8 semanas."}'::jsonb,
   'general',
   2,
   false,
   true,
   true,
   'published'
  ),
  ('{"en": "Do you work with international clients?", "de": "Arbeiten Sie mit internationalen Kunden?", "fr": "Travaillez-vous avec des clients internationaux ?", "es": "¿Trabajan con clientes internacionales?"}'::jsonb,
   '{"en": "Yes, we work with clients worldwide and support multilingual projects in English, German, French, and Spanish.", "de": "Ja, wir arbeiten mit Kunden weltweit und unterstützen mehrsprachige Projekte in Englisch, Deutsch, Französisch und Spanisch.", "fr": "Oui, nous travaillons avec des clients du monde entier et supportons les projets multilingues en anglais, allemand, français et espagnol.", "es": "Sí, trabajamos con clientes de todo el mundo y apoyamos proyectos multilingües en inglés, alemán, francés y español."}'::jsonb,
   'general',
   3,
   false,
   true,
   true,
   'published'
  ),
  ('{"en": "What is your pricing structure?", "de": "Wie ist Ihre Preisstruktur?", "fr": "Quelle est votre structure de prix ?", "es": "¿Cuál es su estructura de precios?"}'::jsonb,
   '{"en": "We offer project-based pricing starting from $2,990. Contact us for a custom quote.", "de": "Wir bieten projektbasierte Preise ab $2.990. Kontaktieren Sie uns für ein individuelles Angebot.", "fr": "Nous proposons des tarifs basés sur les projets à partir de 2 990 $. Contactez-nous pour un devis personnalisé.", "es": "Ofrecemos precios por proyecto desde $2,990. Contáctanos para una cotización personalizada."}'::jsonb,
   'pricing',
   4,
   true,
   true,
   true,
   'published'
  ),
  ('{"en": "Do you provide ongoing support?", "de": "Bieten Sie laufenden Support an?", "fr": "Offrez-vous un support continu ?", "es": "¿Ofrecen soporte continuo?"}'::jsonb,
   '{"en": "Yes, all projects include support periods. We also offer ongoing maintenance plans.", "de": "Ja, alle Projekte beinhalten Support-Zeiträume. Wir bieten auch laufende Wartungspläne an.", "fr": "Oui, tous les projets incluent des périodes de support. Nous offrons aussi des plans de maintenance continue.", "es": "Sí, todos los proyectos incluyen períodos de soporte. También ofrecemos planes de mantenimiento continuo."}'::jsonb,
   'general',
   5,
   false,
   true,
   true,
   'published'
  )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- Chatbot Settings (Singleton)
-- =============================================================================

INSERT INTO public.chatbot_settings (singleton_key, is_enabled, welcome_message_translations, offline_message_translations, escalation_message_translations, fallback_message_translations, lead_capture_mode, human_support_enabled, allowed_categories, response_style)
VALUES (
  true,
  false,
  '{"en": "Hi! How can I help you today?", "de": "Hallo! Wie kann ich Ihnen heute helfen?", "fr": "Bonjour ! Comment puis-je vous aider ?", "es": "¡Hola! ¿Cómo puedo ayudarte hoy?"}'::jsonb,
  '{"en": "We are currently offline. Please leave your message and we will get back to you.", "de": "Wir sind derzeit offline. Bitte hinterlassen Sie Ihre Nachricht und wir melden uns bei Ihnen.", "fr": "Nous sommes actuellement hors ligne. Veuillez laisser votre message et nous vous répondrons.", "es": "Estamos fuera de línea actualmente. Por favor deja tu mensaje y te responderemos."}'::jsonb,
  '{"en": "Let me connect you with a team member.", "de": "Ich verbinde Sie mit einem Teammitglied.", "fr": "Je vous connecte avec un membre de l équipe.", "es": "Te conecto con un miembro del equipo."}'::jsonb,
  '{"en": "I am not sure about that. Let me connect you with a team member.", "de": "Das bin ich mir nicht sicher. Ich verbinde Sie mit einem Teammitglied.", "fr": "Je ne suis pas sûr de cela. Laissez-moi vous connecter avec un membre de l équipe.", "es": "No estoy seguro sobre eso. Déjame conectarte con un miembro del equipo."}'::jsonb,
  'after_resolution',
  true,
  ARRAY['general', 'services', 'pricing'],
  'professional'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  welcome_message_translations = EXCLUDED.welcome_message_translations,
  offline_message_translations = EXCLUDED.offline_message_translations,
  escalation_message_translations = EXCLUDED.escalation_message_translations,
  fallback_message_translations = EXCLUDED.fallback_message_translations;

-- =============================================================================
-- AI FAQ Settings (Singleton)
-- =============================================================================

INSERT INTO public.ai_faq_settings (singleton_key, is_enabled, intro_translations, suggested_questions, allowed_categories, fallback_translations, cta_label_translations, cta_url)
VALUES (
  true,
  false,
  '{"en": "Ask me anything about Stratifit!", "de": "Fragen Sie mich alles über Stratifit!", "fr": "Demandez-moi tout sur Stratifit !", "es": "¡Pregúntame cualquier cosa sobre Stratifit!"}'::jsonb,
   '["What services do you offer?", "How much does a website cost?", "How long does a project take?", "Do you work internationally?", "What is your process?"]'::jsonb,
  ARRAY['general', 'services', 'pricing', 'process'],
  '{"en": "I do not have an answer for that. Please contact our team directly.", "de": "Dafür habe ich keine Antwort. Bitte kontaktieren Sie unser Team direkt.", "fr": "Je n ai pas de réponse pour cela. Veuillez contacter directement notre équipe.", "es": "No tengo una respuesta para eso. Por favor contacta a nuestro equipo directamente."}'::jsonb,
  '{"en": "Contact Us", "de": "Kontaktieren Sie uns", "fr": "Contactez-nous", "es": "Contáctanos"}'::jsonb,
  '/contact'
)
ON CONFLICT (singleton_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled,
  intro_translations = EXCLUDED.intro_translations,
  suggested_questions = EXCLUDED.suggested_questions,
  allowed_categories = EXCLUDED.allowed_categories,
  fallback_translations = EXCLUDED.fallback_translations,
  cta_label_translations = EXCLUDED.cta_label_translations,
  cta_url = EXCLUDED.cta_url;

-- =============================================================================
-- Final CTA (Singleton)
-- =============================================================================

INSERT INTO public.final_cta (singleton_key, title_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, variant, is_visible)
VALUES (
  true,
  '{"en": "Ready to Transform Your Digital Presence?", "de": "Bereit, Ihre digitale Präsenz zu transformieren?", "fr": "Prêt à transformer votre présence numérique ?", "es": "¿Listo para transformar tu presencia digital?"}'::jsonb,
  '{"en": "Let us help you build something extraordinary. Start with a free consultation.", "de": "Lassen Sie uns Ihnen helfen, etwas Außergewöhnliches zu schaffen. Beginnen Sie mit einer kostenlosen Beratung.", "fr": "Laissez-nous vous aider à créer quelque chose d extraordinaire. Commencez par une consultation gratuite.", "es": "Permítenos ayudarte a construir algo extraordinario. Comienza con una consulta gratuita."}'::jsonb,
  '{"en": "Get Free Consultation", "de": "Kostenlose Beratung erhalten", "fr": "Obtenir une consultation gratuite", "es": "Obtener consulta gratuita"}'::jsonb,
  '/contact',
  '{"en": "View Our Work", "de": "Unsere Arbeiten ansehen", "fr": "Voir nos réalisations", "es": "Ver nuestro trabajo"}'::jsonb,
  '/work',
  'default',
  true
)
ON CONFLICT (singleton_key) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  primary_cta_label_translations = EXCLUDED.primary_cta_label_translations,
  primary_cta_url = EXCLUDED.primary_cta_url,
  secondary_cta_label_translations = EXCLUDED.secondary_cta_label_translations,
  secondary_cta_url = EXCLUDED.secondary_cta_url;

-- =============================================================================
-- Development-Only Portfolio Projects
-- NOTE: Development placeholders. Replace with approved client projects before launch.
-- =============================================================================

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'dev-brand-identity-system', 'Development Client', '{"en": "Brand Identity System", "de": "Markenidentitätssystem", "fr": "Système d identité de marque", "es": "Sistema de identidad de marca"}'::jsonb, '{"en": "A complete brand identity system for a growing business.", "de": "Ein vollständiges Markenidentitätssystem für ein wachsendes Unternehmen.", "fr": "Un système complet d identité de marque pour une entreprise en croissance.", "es": "Un sistema completo de identidad de marca para un negocio en crecimiento."}'::jsonb, '{"en": "Establishing a distinctive identity in a competitive market.", "de": "Eine unverwechselbare Identität in einem wettbewerbsintensiven Markt schaffen.", "fr": "Établir une identité distinctive sur un marché concurrentiel.", "es": "Establecer una identidad distintiva en un mercado competitivo."}'::jsonb, '{"en": "We combined brand strategy with a refined visual system.", "de": "Wir kombinierten Markenstrategie mit einem raffinierten visuellen System.", "fr": "Nous avons combiné stratégie de marque et système visuel raffiné.", "es": "Combinamos estrategia de marca con un sistema visual refinado."}'::jsonb, '{"en": "A cohesive identity with clear guidelines and asset kits.", "de": "Eine kohärente Identität mit klaren Richtlinien und Asset-Kits.", "fr": "Une identité cohérente avec des directives et kits d actifs clairs.", "es": "Una identidad coherente con pautas y kits de recursos claros."}'::jsonb, '{"en": ["Brand Strategy", "Logo Design", "Guidelines", "Asset Kits"], "de": ["Markenstrategie", "Logo-Design", "Richtlinien", "Asset-Kits"], "fr": ["Stratégie de marque", "Design de logo", "Directives", "Kits d actifs"], "es": ["Estrategia de marca", "Diseño de logo", "Pautas", "Kits de recursos"]}'::jsonb, '{"en": "A recognizable identity ready for market.", "de": "Eine wiedererkennbare Identität, bereit für den Markt.", "fr": "Une identité reconnaissable prête pour le marché.", "es": "Una identidad reconocible lista para el mercado."}'::jsonb, '[]'::jsonb, '{"en": "Brand Identity System — Stratifit", "de": "Markenidentitätssystem — Stratifit", "fr": "Système d identité de marque — Stratifit", "es": "Sistema de identidad de marca — Stratifit"}'::jsonb, '{"en": "A complete brand identity system delivered by Stratifit.", "de": "Ein vollständiges Markenidentitätssystem von Stratifit.", "fr": "Un système complet d identité de marque réalisé par Stratifit.", "es": "Un sistema completo de identidad de marca creado por Stratifit."}'::jsonb, false, 'published', now()),
  ('11111111-1111-4111-8111-111111111102', 'dev-multilingual-website', 'Development Client', '{"en": "Multilingual Business Website", "de": "Mehrsprachige Business-Website", "fr": "Site web multilingue", "es": "Sitio web multilingüe"}'::jsonb, '{"en": "A high-performance multilingual website for international growth.", "de": "Eine leistungsstarke mehrsprachige Website für internationales Wachstum.", "fr": "Un site web multilingue haute performance pour la croissance internationale.", "es": "Un sitio web multilingüe de alto rendimiento para el crecimiento internacional."}'::jsonb, '{"en": "Serving customers across four languages.", "de": "Kunden in vier Sprachen bedienen.", "fr": "Servir des clients dans quatre langues.", "es": "Atender clientes en cuatro idiomas."}'::jsonb, '{"en": "We built a fast, accessible site with centralized multilingual content.", "de": "Wir bauten eine schnelle, barrierefreie Website mit zentralisiertem mehrsprachigem Inhalt.", "fr": "Nous avons créé un site rapide et accessible avec contenu multilingue centralisé.", "es": "Creamos un sitio rápido y accesible con contenido multilingüe centralizado."}'::jsonb, '{"en": "A scalable site that adapts to every locale.", "de": "Eine skalierbare Website, die sich jeder Sprache anpasst.", "fr": "Un site évolutif qui s adapte à chaque langue.", "es": "Un sitio escalable que se adapta a cada idioma."}'::jsonb, '{"en": ["Custom Development", "CMS Integration", "Multilingual System", "Performance"], "de": ["Individuelle Entwicklung", "CMS-Integration", "Mehrsprachiges System", "Performance"], "fr": ["Développement sur mesure", "Intégration CMS", "Système multilingue", "Performance"], "es": ["Desarrollo personalizado", "Integración CMS", "Sistema multilingüe", "Rendimiento"]}'::jsonb, '{"en": "A multilingual site ready for global audiences.", "de": "Eine mehrsprachige Website, bereit für globale Zielgruppen.", "fr": "Un site multilingue prêt pour les audiences mondiales.", "es": "Un sitio multilingüe listo para audiencias globales."}'::jsonb, '[]'::jsonb, '{"en": "Multilingual Business Website — Stratifit", "de": "Mehrsprachige Business-Website — Stratifit", "fr": "Site web multilingue — Stratifit", "es": "Sitio web multilingüe — Stratifit"}'::jsonb, '{"en": "A high-performance multilingual website by Stratifit.", "de": "Eine leistungsstarke mehrsprachige Website von Stratifit.", "fr": "Un site web multilingue haute performance par Stratifit.", "es": "Un sitio web multilingüe de alto rendimiento de Stratifit."}'::jsonb, false, 'published', now()),
  ('11111111-1111-4111-8111-111111111103', 'dev-ai-support-assistant', 'Development Client', '{"en": "AI Support Assistant", "de": "KI-Support-Assistent", "fr": "Assistant de support IA", "es": "Asistente de soporte con IA"}'::jsonb, '{"en": "An AI assistant that answers customer questions from approved knowledge.", "de": "Ein KI-Assistent, der Kundenfragen aus genehmigtem Wissen beantwortet.", "fr": "Un assistant IA qui répond aux questions clients à partir de connaissances approuvées.", "es": "Un asistente de IA que responde preguntas de clientes con conocimiento aprobado."}'::jsonb, '{"en": "Reducing repetitive support workload.", "de": "Repetitive Support-Arbeit reduzieren.", "fr": "Réduire la charge de support répétitive.", "es": "Reducir la carga de soporte repetitiva."}'::jsonb, '{"en": "We built a secure, knowledge-grounded chatbot with human handover.", "de": "Wir bauten einen sicheren, wissensbasierten Chatbot mit menschlicher Übergabe.", "fr": "Nous avons créé un chatbot sécurisé fondé sur les connaissances avec prise en charge humaine.", "es": "Creamos un chatbot seguro basado en conocimiento con transferencia humana."}'::jsonb, '{"en": "A support assistant that knows when to escalate to a human.", "de": "Ein Support-Assistent, der weiß, wann er an einen Menschen eskalieren muss.", "fr": "Un assistant de support qui sait quand passer à un humain.", "es": "Un asistente de soporte que sabe cuándo escalar a un humano."}'::jsonb, '{"en": ["AI Chatbot", "Knowledge Base", "Human Handover"], "de": ["KI-Chatbot", "Wissensbasis", "Menschliche Übergabe"], "fr": ["Chatbot IA", "Base de connaissances", "Prise en charge humaine"], "es": ["Chatbot con IA", "Base de conocimiento", "Transferencia humana"]}'::jsonb, '{"en": "Faster, consistent responses with human escalation.", "de": "Schnellere, konsistente Antworten mit menschlicher Eskalation.", "fr": "Réponses plus rapides et cohérentes avec escalade humaine.", "es": "Respuestas más rápidas y consistentes con escalada humana."}'::jsonb, '[]'::jsonb, '{"en": "AI Support Assistant — Stratifit", "de": "KI-Support-Assistent — Stratifit", "fr": "Assistant de support IA — Stratifit", "es": "Asistente de soporte con IA — Stratifit"}'::jsonb, '{"en": "An AI support assistant built by Stratifit.", "de": "Ein KI-Support-Assistent von Stratifit.", "fr": "Un assistant de support IA créé par Stratifit.", "es": "Un asistente de soporte con IA creado por Stratifit."}'::jsonb, true, 'published', now())
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- =============================================================================
-- Development-Only Insights
-- NOTE: Development placeholders. Replace with approved editorial content before launch.
-- =============================================================================

INSERT INTO public.insights (id, slug, title_translations, excerpt_translations, content_translations, reading_time_minutes, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('22222222-2222-4222-8222-222222222201', 'dev-why-multilingual-matters', '{"en": "Why Multilingual Websites Matter", "de": "Warum mehrsprachige Websites wichtig sind", "fr": "Pourquoi les sites multilingues comptent", "es": "Por qué importan los sitios web multilingües"}'::jsonb, '{"en": "Reaching international audiences starts with content that speaks their language.", "de": "Internationale Zielgruppen zu erreichen beginnt mit Inhalten in ihrer Sprache.", "fr": "Atteindre les audiences internationales commence par un contenu dans leur langue.", "es": "Llegar a audiencias internacionales comienza con contenido en su idioma."}'::jsonb, '{"en": "Multilingual content builds trust and improves reach across markets.", "de": "Mehrsprachige Inhalte schaffen Vertrauen und verbessern die Reichweite über Märkte hinweg.", "fr": "Le contenu multilingue renforce la confiance et améliore la portée internationale.", "es": "El contenido multilingüe genera confianza y mejora el alcance internacional."}'::jsonb, 4, '{"en": "Why Multilingual Websites Matter", "de": "Warum mehrsprachige Websites wichtig sind", "fr": "Pourquoi les sites multilingues comptent", "es": "Por qué importan los sitios web multilingües"}'::jsonb, '{"en": "Insights on multilingual websites.", "de": "Einblicke in mehrsprachige Websites.", "fr": "Aperçus sur les sites multilingues.", "es": "Perspectivas sobre sitios web multilingües."}'::jsonb, false, 'published', now()),
  ('22222222-2222-4222-8222-222222222202', 'dev-ai-in-customer-support', '{"en": "AI in Customer Support", "de": "KI im Kundenservice", "fr": "L IA dans le support client", "es": "La IA en el soporte al cliente"}'::jsonb, '{"en": "How AI assistants reduce workload while keeping the human touch.", "de": "Wie KI-Assistenten die Arbeit reduzieren und den menschlichen Touch bewahren.", "fr": "Comment les assistants IA réduisent la charge tout en gardant le contact humain.", "es": "Cómo los asistentes de IA reducen la carga manteniendo el toque humano."}'::jsonb, '{"en": "AI support assistants handle routine questions and escalate when it matters.", "de": "KI-Support-Assistenten beantworten Routinefragen und eskalieren, wenn es zählt.", "fr": "Les assistants IA traitent les questions courantes et escaladent quand c est important.", "es": "Los asistentes de IA manejan preguntas rutinarias y escalan cuando importa."}'::jsonb, 5, '{"en": "AI in Customer Support", "de": "KI im Kundenservice", "fr": "L IA dans le support client", "es": "La IA en el soporte al cliente"}'::jsonb, '{"en": "Insights on AI customer support.", "de": "Einblicke in KI-Kundenservice.", "fr": "Aperçus sur le support client IA.", "es": "Perspectivas sobre el soporte al cliente con IA."}'::jsonb, true, 'published', now()),
  ('22222222-2222-4222-8222-222222222203', 'dev-website-performance-seo', '{"en": "Website Performance and SEO", "de": "Website-Performance und SEO", "fr": "Performance web et SEO", "es": "Rendimiento web y SEO"}'::jsonb, '{"en": "Speed is a ranking factor and a conversion factor.", "de": "Geschwindigkeit ist ein Ranking- und Conversion-Faktor.", "fr": "La vitesse est un facteur de classement et de conversion.", "es": "La velocidad es un factor de posicionamiento y de conversión."}'::jsonb, '{"en": "Fast websites rank better, convert better, and build trust.", "de": "Schnelle Websites ranken besser, konvertieren besser und schaffen Vertrauen.", "fr": "Les sites rapides se classent mieux, convertissent mieux et inspirent confiance.", "es": "Los sitios rápidos posicionan mejor, convierten mejor y generan confianza."}'::jsonb, 4, '{"en": "Website Performance and SEO", "de": "Website-Performance und SEO", "fr": "Performance web et SEO", "es": "Rendimiento web y SEO"}'::jsonb, '{"en": "Insights on performance and SEO.", "de": "Einblicke in Performance und SEO.", "fr": "Aperçus sur la performance et le SEO.", "es": "Perspectivas sobre rendimiento y SEO."}'::jsonb, false, 'published', now())
ON CONFLICT (id) DO UPDATE SET
  title_translations = EXCLUDED.title_translations,
  excerpt_translations = EXCLUDED.excerpt_translations,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- =============================================================================
-- Development-Only Testimonials
-- NOTE: Development placeholders. Replace with verified real client quotes before launch.
-- =============================================================================

INSERT INTO public.testimonials (id, quote_translations, person_name, person_role_translations, company_name, display_order, is_featured, is_visible, is_verified)
VALUES
  ('33333333-3333-4333-8333-333333333301', '{"en": "The Stratifit team delivered a website that truly reflects our brand.", "de": "Das Stratifit-Team hat eine Website geliefert, die unsere Marke wirklich widerspiegelt.", "fr": "L équipe Stratifit a livré un site qui reflète vraiment notre marque.", "es": "El equipo de Stratifit entregó un sitio que refleja realmente nuestra marca."}'::jsonb, 'Development Client One', '{"en": "Founder", "de": "Gründer", "fr": "Fondateur", "es": "Fundador"}'::jsonb, 'Example Company', 1, true, true, true),
  ('33333333-3333-4333-8333-333333333302', '{"en": "Professional, fast, and easy to work with from start to finish.", "de": "Professionell, schnell und von Anfang bis Ende angenehm zu arbeiten.", "fr": "Professionnel, rapide et agréable à travailler du début à la fin.", "es": "Profesional, rápido y fácil de trabajar de principio a fin."}'::jsonb, 'Development Client Two', '{"en": "Operations Lead", "de": "Leiter Betrieb", "fr": "Responsable des opérations", "es": "Líder de operaciones"}'::jsonb, 'Example Agency', 2, false, true, true),
  ('33333333-3333-4333-8333-333333333303', '{"en": "Our AI assistant now handles the questions customers ask most.", "de": "Unser KI-Assistent beantwortet jetzt die häufigsten Kundenfragen.", "fr": "Notre assistant IA répond désormais aux questions les plus posées.", "es": "Nuestro asistente de IA ahora maneja las preguntas más frecuentes."}'::jsonb, 'Development Client Three', '{"en": "Marketing Director", "de": "Marketingdirektor", "fr": "Directeur marketing", "es": "Director de marketing"}'::jsonb, 'Example Startup', 3, false, true, true)
ON CONFLICT (id) DO UPDATE SET
  quote_translations = EXCLUDED.quote_translations,
  person_name = EXCLUDED.person_name,
  is_visible = EXCLUDED.is_visible,
  is_verified = EXCLUDED.is_verified;
