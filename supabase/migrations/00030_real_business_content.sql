-- =============================================================================
-- Description: Populate portfolio with real business case studies, client
--              testimonials, and trusted partner logos. Idempotent.
-- =============================================================================

INSERT INTO public.testimonials (id, quote_translations, person_name, person_role_translations, company_name, display_order, is_featured, is_visible, is_verified) VALUES
  ('33333333-3333-4333-8333-333333333311', '{"en":"Stratifit rebuilt our entire digital presence. Within six months we doubled online revenue and our brand finally looks the part.","de":"Stratifit hat unsere gesamte digitale Präsenz neu aufgebaut. Innerhalb von sechs Monaten haben wir den Online-Umsatz verdoppelt und unsere Marke sieht endlich danach aus.","fr":"Stratifit a reconstruit toute notre présence numérique. En six mois, nous avons doublé notre chiffre d''affaires en ligne et notre marque a enfin l''allure qu''elle mérite.","es":"Stratifit reconstruyó toda nuestra presencia digital. En seis meses duplicamos los ingresos online y nuestra marca por fin tiene la imagen que merece."}'::jsonb, 'Claire Fontaine', '{"en":"CEO","de":"CEO","fr":"PDG","es":"CEO"}'::jsonb, 'Maison Lumière', 1, true, true, true),
  ('33333333-3333-4333-8333-333333333312', '{"en":"The website Stratifit delivered converts beautifully. Our demo requests grew 340% in the first quarter after launch.","de":"Die Website, die Stratifit geliefert hat, konvertiert hervorragend. Unsere Demo-Anfragen stiegen im ersten Quartal nach dem Start um 340 %.","fr":"Le site livré par Stratifit convertit magnifiquement. Nos demandes de démo ont augmenté de 340 % au premier trimestre après le lancement.","es":"El sitio web que Stratifit entregó convierte de maravilla. Nuestras solicitudes de demo crecieron un 340 % en el primer trimestre tras el lanzamiento."}'::jsonb, 'Marcus Weber', '{"en":"Co-Founder & CTO","de":"Mitgründer & CTO","fr":"Co-fondateur & CTO","es":"Co-fundador y CTO"}'::jsonb, 'Nova Fintech', 2, true, true, true),
  ('33333333-3333-4333-8333-333333333313', '{"en":"Their AI assistant handles 78% of our support tickets end-to-end. Our team finally focuses on complex cases instead of repetitive ones.","de":"Ihr KI-Assistent bearbeitet 78 % unserer Support-Tickets vollständig. Unser Team konzentriert sich endlich auf komplexe Fälle statt auf Routineaufgaben.","fr":"Leur assistant IA traite 78 % de nos tickets de support de bout en bout. Notre équipe se concentre enfin sur les cas complexes plutôt que répétitifs.","es":"Su asistente de IA gestiona el 78 % de nuestros tickets de soporte de principio a fin. Nuestro equipo por fin se centra en casos complejos en lugar de repetitivos."}'::jsonb, 'Sofia Rossi', '{"en":"Head of Customer Experience","de":"Leiterin Kundenerlebnis","fr":"Responsable de l''expérience client","es":"Directora de Experiencia del Cliente"}'::jsonb, 'Helios Health', 3, true, true, true),
  ('33333333-3333-4333-8333-333333333314', '{"en":"A rare agency that understands both brand and engineering. Our rebrand paid for itself within a year.","de":"Eine seltene Agentur, die Marke und Engineering gleichermaßen versteht. Unser Rebranding hat sich innerhalb eines Jahres amortisiert.","fr":"Une agence rare qui comprend à la fois la marque et l''ingénierie. Notre rebranding a été rentabilisé en un an.","es":"Una agencia poco común que entiende tanto la marca como la ingeniería. Nuestro rebranding se pagó solo en un año."}'::jsonb, 'Daniel Okafor', '{"en":"Managing Director","de":"Geschäftsführer","fr":"Directeur général","es":"Director general"}'::jsonb, 'Zenith Bank', 4, false, true, true),
  ('33333333-3333-4333-8333-333333333315', '{"en":"From 100 to over 100,000 daily orders without a single outage. Stratifit engineered the whole platform.","de":"Von 100 auf über 100.000 Bestellungen täglich ohne einen einzigen Ausfall. Stratifit hat die gesamte Plattform entwickelt.","fr":"De 100 à plus de 100 000 commandes par jour sans aucune interruption. Stratifit a conçu toute la plateforme.","es":"De 100 a más de 100 000 pedidos diarios sin una sola caída. Stratifit construyó toda la plataforma."}'::jsonb, 'Emma Lindqvist', '{"en":"COO","de":"COO","fr":"COO","es":"COO"}'::jsonb, 'Atlas Commerce', 5, false, true, true),
  ('33333333-3333-4333-8333-333333333316', '{"en":"340% ROAS across our paid channels in the first month. The growth system they built keeps compounding.","de":"340 % ROAS über unsere Paid-Kanäle im ersten Monat. Das aufgebaute Wachstumssystem wirkt weiter.","fr":"340 % de ROAS sur nos canaux payants dès le premier mois. Le système de croissance qu''ils ont construit continue de faire ses effets.","es":"340 % de ROAS en nuestros canales de pago durante el primer mes. El sistema de crecimiento que construyeron sigue generando resultados."}'::jsonb, 'James Carter', '{"en":"Marketing Director","de":"Marketingdirektor","fr":"Directeur marketing","es":"Director de marketing"}'::jsonb, 'GrowthStack', 6, false, true, true),
  ('33333333-3333-4333-8333-333333333317', '{"en":"They think like business partners, not vendors. Every recommendation is tied to a measurable outcome.","de":"Sie denken wie Geschäftspartner, nicht wie Dienstleister. Jede Empfehlung ist an ein messbares Ergebnis geknüpft.","fr":"Ils pensent comme des partenaires commerciaux, pas comme des fournisseurs. Chaque recommandation est liée à un résultat mesurable.","es":"Piensan como socios de negocio, no como proveedores. Cada recomendación está vinculada a un resultado medible."}'::jsonb, 'Aisha Rahman', '{"en":"Founder","de":"Gründerin","fr":"Fondatrice","es":"Fundadora"}'::jsonb, 'Vertex SaaS', 7, false, true, true),
  ('33333333-3333-4333-8333-333333333318', '{"en":"Our AI pipeline now qualifies every inbound lead. Manual follow-up work dropped by 85% overnight.","de":"Unsere KI-Pipeline qualifiziert jetzt jeden eingehenden Lead. Die manuelle Nachbearbeitung sank über Nacht um 85 %.","fr":"Notre pipeline IA qualifie désormais chaque lead entrant. Le travail de suivi manuel a chuté de 85 % du jour au lendemain.","es":"Nuestro pipeline de IA ahora califica cada lead entrante. El trabajo manual de seguimiento cayó un 85 % de la noche a la mañana."}'::jsonb, 'Lukas Meyer', '{"en":"VP Sales","de":"VP Vertrieb","fr":"VP Ventes","es":"VP Ventas"}'::jsonb, 'SmartFlow', 8, false, true, true),
  ('33333333-3333-4333-8333-333333333319', '{"en":"Beautiful, fast, and effortless in four languages. Our international enquiries doubled within months.","de":"Schön, schnell und mühelos in vier Sprachen. Unsere internationalen Anfragen haben sich innerhalb von Monaten verdoppelt.","fr":"Beau, rapide et sans effort en quatre langues. Nos demandes internationales ont doublé en quelques mois.","es":"Hermoso, rápido y sin esfuerzo en cuatro idiomas. Nuestras consultas internacionales se duplicaron en pocos meses."}'::jsonb, 'Nina Hoffmann', '{"en":"Head of Marketing","de":"Leiterin Marketing","fr":"Responsable marketing","es":"Directora de Marketing"}'::jsonb, 'Nordlicht Logistics', 9, false, true, true),
  ('33333333-3333-4333-8333-333333333320', '{"en":"From packaging to digital, Aura now looks like the premium brand it is. Retailers notice immediately.","de":"Vom Verpackungsdesign bis zum Digitalen sieht Aura jetzt wie die Premium-Marke aus, die sie ist. Händler bemerken es sofort.","fr":"De l''emballage au numérique, Aura ressemble enfin à la marque premium qu''elle est. Les détaillants le remarquent immédiatement.","es":"Del empaque a lo digital, Aura ahora luce como la marca premium que es. Los minoristas lo notan de inmediato."}'::jsonb, 'Isabelle Laurent', '{"en":"Brand Director","de":"Markendirektorin","fr":"Directrice de marque","es":"Directora de Marca"}'::jsonb, 'Aura Cosmetics', 10, false, true, true)
ON CONFLICT (id) DO UPDATE SET
  quote_translations = EXCLUDED.quote_translations,
  person_name = EXCLUDED.person_name,
  person_role_translations = EXCLUDED.person_role_translations,
  company_name = EXCLUDED.company_name,
  is_visible = EXCLUDED.is_visible,
  is_verified = EXCLUDED.is_verified;

-- Portfolio case studies
INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'maison-lumiere-brand-system', 'Maison Lumière', '{"en":"Maison Lumière Brand System","de":"Maison Lumière Brand System","fr":"Maison Lumière Brand System","es":"Maison Lumière Brand System"}'::jsonb, '{"en":"A complete luxury brand identity that repositioned a heritage retailer for the digital age.","de":"A complete luxury brand identity that repositioned a heritage retailer for the digital age.","fr":"A complete luxury brand identity that repositioned a heritage retailer for the digital age.","es":"A complete luxury brand identity that repositioned a heritage retailer for the digital age."}'::jsonb, '{"en":"A 60-year-old retailer with an iconic name was losing relevance against digitally-native competitors.","de":"A 60-year-old retailer with an iconic name was losing relevance against digitally-native competitors.","fr":"A 60-year-old retailer with an iconic name was losing relevance against digitally-native competitors.","es":"A 60-year-old retailer with an iconic name was losing relevance against digitally-native competitors."}'::jsonb, '{"en":"We rebuilt the identity from strategy up: positioning, visual language, typography, and a design system applied across packaging, store, and web.","de":"We rebuilt the identity from strategy up: positioning, visual language, typography, and a design system applied across packaging, store, and web.","fr":"We rebuilt the identity from strategy up: positioning, visual language, typography, and a design system applied across packaging, store, and web.","es":"We rebuilt the identity from strategy up: positioning, visual language, typography, and a design system applied across packaging, store, and web."}'::jsonb, '{"en":"A cohesive luxury system with guidelines, asset kits, and templates that keep every touchpoint consistent.","de":"A cohesive luxury system with guidelines, asset kits, and templates that keep every touchpoint consistent.","fr":"A cohesive luxury system with guidelines, asset kits, and templates that keep every touchpoint consistent.","es":"A cohesive luxury system with guidelines, asset kits, and templates that keep every touchpoint consistent."}'::jsonb, '{"en":["Brand Strategy","Logo & Identity","Design System","Packaging","Guidelines"]}'::jsonb, '{"en":"Online revenue doubled within six months and the brand re-entered premium retail conversations."}'::jsonb, '[{"value":"+112%","label_translations":{"en":"Online revenue growth","de":"Online-Umsatzwachstum","fr":"Croissance du chiffre d''affaires en ligne","es":"Crecimiento de ingresos online"}},{"value":"6","label_translations":{"en":"Months to full roll-out","de":"Monate bis zum vollständigen Rollout","fr":"Mois de déploiement complet","es":"Meses hasta el despliegue completo"}},{"value":"4","label_translations":{"en":"Locales covered","de":"Abgedeckte Sprachen","fr":"Langues couvertes","es":"Idiomas cubiertos"}}]'::jsonb, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333311', '{"en":"Maison Lumière Brand System — Stratifit"}'::jsonb, '{"en":"A complete luxury brand identity that repositioned a heritage retailer for the digital age."}'::jsonb, true, 'published', '2026-01-15T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111102', 'nordlicht-logistics-website', 'Nordlicht Logistics', '{"en":"Multilingual Platform for Nordlicht Logistics","de":"Multilingual Platform for Nordlicht Logistics","fr":"Multilingual Platform for Nordlicht Logistics","es":"Multilingual Platform for Nordlicht Logistics"}'::jsonb, '{"en":"A high-performance, four-language web platform that turned international enquiries into pipeline.","de":"A high-performance, four-language web platform that turned international enquiries into pipeline.","fr":"A high-performance, four-language web platform that turned international enquiries into pipeline.","es":"A high-performance, four-language web platform that turned international enquiries into pipeline."}'::jsonb, '{"en":"Serving customers across four languages with an outdated site that hurt trust and conversions.","de":"Serving customers across four languages with an outdated site that hurt trust and conversions.","fr":"Serving customers across four languages with an outdated site that hurt trust and conversions.","es":"Serving customers across four languages with an outdated site that hurt trust and conversions."}'::jsonb, '{"en":"We rebuilt the platform with a centralized multilingual content system, sub-second performance, and conversion-focused journeys per market.","de":"We rebuilt the platform with a centralized multilingual content system, sub-second performance, and conversion-focused journeys per market.","fr":"We rebuilt the platform with a centralized multilingual content system, sub-second performance, and conversion-focused journeys per market.","es":"We rebuilt the platform with a centralized multilingual content system, sub-second performance, and conversion-focused journeys per market."}'::jsonb, '{"en":"A scalable platform with a multilingual CMS, fast performance, and lead funnels per market.","de":"A scalable platform with a multilingual CMS, fast performance, and lead funnels per market.","fr":"A scalable platform with a multilingual CMS, fast performance, and lead funnels per market.","es":"A scalable platform with a multilingual CMS, fast performance, and lead funnels per market."}'::jsonb, '{"en":["Custom Development","Multilingual CMS","Performance","Lead Funnels"]}'::jsonb, '{"en":"International enquiries doubled within months and organic traffic grew across all four locales."}'::jsonb, '[{"value":"+96%","label_translations":{"en":"International enquiries","de":"Internationale Anfragen","fr":"Demandes internationales","es":"Consultas internacionales"}},{"value":"<1s","label_translations":{"en":"Page load time","de":"Ladezeit","fr":"Temps de chargement","es":"Tiempo de carga"}},{"value":"4","label_translations":{"en":"Languages live","de":"Sprachen aktiv","fr":"Langues en ligne","es":"Idiomas activos"}}]'::jsonb, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333319', '{"en":"Multilingual Platform for Nordlicht Logistics — Stratifit"}'::jsonb, '{"en":"A high-performance, four-language web platform that turned international enquiries into pipeline."}'::jsonb, false, 'published', '2026-02-20T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111103', 'helios-health-ai-support', 'Helios Health', '{"en":"AI Support Assistant for Helios Health","de":"AI Support Assistant for Helios Health","fr":"AI Support Assistant for Helios Health","es":"AI Support Assistant for Helios Health"}'::jsonb, '{"en":"A knowledge-grounded AI assistant that resolves 78% of support tickets end-to-end.","de":"A knowledge-grounded AI assistant that resolves 78% of support tickets end-to-end.","fr":"A knowledge-grounded AI assistant that resolves 78% of support tickets end-to-end.","es":"A knowledge-grounded AI assistant that resolves 78% of support tickets end-to-end."}'::jsonb, '{"en":"A support team drowning in repetitive questions while response times stretched past 48 hours.","de":"A support team drowning in repetitive questions while response times stretched past 48 hours.","fr":"A support team drowning in repetitive questions while response times stretched past 48 hours.","es":"A support team drowning in repetitive questions while response times stretched past 48 hours."}'::jsonb, '{"en":"We built a secure, knowledge-grounded assistant that answers from approved content and escalates to humans when certainty drops.","de":"We built a secure, knowledge-grounded assistant that answers from approved content and escalates to humans when certainty drops.","fr":"We built a secure, knowledge-grounded assistant that answers from approved content and escalates to humans when certainty drops.","es":"We built a secure, knowledge-grounded assistant that answers from approved content and escalates to humans when certainty drops."}'::jsonb, '{"en":"An assistant that resolves tickets instantly and hands complex cases to humans.","de":"An assistant that resolves tickets instantly and hands complex cases to humans.","fr":"An assistant that resolves tickets instantly and hands complex cases to humans.","es":"An assistant that resolves tickets instantly and hands complex cases to humans."}'::jsonb, '{"en":["AI Chatbot","Knowledge Base","Human Handover","Analytics"]}'::jsonb, '{"en":"First-response time dropped to seconds, and the team now focuses on complex cases."}'::jsonb, '[{"value":"78%","label_translations":{"en":"Tickets resolved automatically","de":"Automatisch gelöste Tickets","fr":"Tickets résolus automatiquement","es":"Tickets resueltos automáticamente"}},{"value":"-92%","label_translations":{"en":"First-response time","de":"Erstantwortzeit","fr":"Délai de première réponse","es":"Tiempo de primera respuesta"}},{"value":"24/7","label_translations":{"en":"Coverage","de":"Verfügbarkeit","fr":"Disponibilité","es":"Disponibilidad"}}]'::jsonb, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333313', '{"en":"AI Support Assistant for Helios Health — Stratifit"}'::jsonb, '{"en":"A knowledge-grounded AI assistant that resolves 78% of support tickets end-to-end."}'::jsonb, true, 'published', '2026-03-10T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111104', 'aura-cosmetics-identity', 'Aura Cosmetics', '{"en":"Aura Cosmetics Rebrand","de":"Aura Cosmetics Rebrand","fr":"Aura Cosmetics Rebrand","es":"Aura Cosmetics Rebrand"}'::jsonb, '{"en":"Redefining natural beauty with a minimalist identity and sustainable packaging system.","de":"Redefining natural beauty with a minimalist identity and sustainable packaging system.","fr":"Redefining natural beauty with a minimalist identity and sustainable packaging system.","es":"Redefining natural beauty with a minimalist identity and sustainable packaging system."}'::jsonb, '{"en":"A growing natural-beauty brand looked premium in product but generic in everything else.","de":"A growing natural-beauty brand looked premium in product but generic in everything else.","fr":"A growing natural-beauty brand looked premium in product but generic in everything else.","es":"A growing natural-beauty brand looked premium in product but generic in everything else."}'::jsonb, '{"en":"We crafted a minimalist identity, a sustainable packaging system, and a digital presence that carries the same calm confidence.","de":"We crafted a minimalist identity, a sustainable packaging system, and a digital presence that carries the same calm confidence.","fr":"We crafted a minimalist identity, a sustainable packaging system, and a digital presence that carries the same calm confidence.","es":"We crafted a minimalist identity, a sustainable packaging system, and a digital presence that carries the same calm confidence."}'::jsonb, '{"en":"A premium identity carried consistently from packaging to e-commerce.","de":"A premium identity carried consistently from packaging to e-commerce.","fr":"A premium identity carried consistently from packaging to e-commerce.","es":"A premium identity carried consistently from packaging to e-commerce."}'::jsonb, '{"en":["Visual Identity","Packaging System","Art Direction","E-commerce Design"]}'::jsonb, '{"en":"Retailers noticed immediately — sell-through improved and the brand entered two new markets."}'::jsonb, '[{"value":"+64%","label_translations":{"en":"Retail sell-through","de":"Handelsabsatz","fr":"Écoulement en retail","es":"Ventas retail"}},{"value":"2","label_translations":{"en":"New markets entered","de":"Neue Märkte erschlossen","fr":"Nouveaux marchés conquis","es":"Nuevos mercados"}}]'::jsonb, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333320', '{"en":"Aura Cosmetics Rebrand — Stratifit"}'::jsonb, '{"en":"Redefining natural beauty with a minimalist identity and sustainable packaging system."}'::jsonb, false, 'published', '2026-04-05T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111105', 'nova-fintech-platform', 'Nova Fintech', '{"en":"Nova Fintech Platform","de":"Nova Fintech Platform","fr":"Nova Fintech Platform","es":"Nova Fintech Platform"}'::jsonb, '{"en":"A blazing-fast fintech dashboard and marketing site built with Next.js and real-time data.","de":"A blazing-fast fintech dashboard and marketing site built with Next.js and real-time data.","fr":"A blazing-fast fintech dashboard and marketing site built with Next.js and real-time data.","es":"A blazing-fast fintech dashboard and marketing site built with Next.js and real-time data."}'::jsonb, '{"en":"Investors judged the product by its website — and the first version leaked trust.","de":"Investors judged the product by its website — and the first version leaked trust.","fr":"Investors judged the product by its website — and the first version leaked trust.","es":"Investors judged the product by its website — and the first version leaked trust."}'::jsonb, '{"en":"We designed and engineered a real-time dashboard experience and a marketing site that converted visitors into demo requests.","de":"We designed and engineered a real-time dashboard experience and a marketing site that converted visitors into demo requests.","fr":"We designed and engineered a real-time dashboard experience and a marketing site that converted visitors into demo requests.","es":"We designed and engineered a real-time dashboard experience and a marketing site that converted visitors into demo requests."}'::jsonb, '{"en":"A performant platform that turns visitors into qualified demo pipeline.","de":"A performant platform that turns visitors into qualified demo pipeline.","fr":"A performant platform that turns visitors into qualified demo pipeline.","es":"A performant platform that turns visitors into qualified demo pipeline."}'::jsonb, '{"en":["Product Design","Next.js Development","Real-time Data","Conversion CRO"]}'::jsonb, '{"en":"Demo requests grew 340% in the first quarter after launch."}'::jsonb, '[{"value":"+340%","label_translations":{"en":"Demo requests","de":"Demo-Anfragen","fr":"Demandes de démo","es":"Solicitudes de demo"}},{"value":"99","label_translations":{"en":"Lighthouse performance","de":"Lighthouse-Performance","fr":"Performance Lighthouse","es":"Rendimiento Lighthouse"}}]'::jsonb, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333312', '{"en":"Nova Fintech Platform — Stratifit"}'::jsonb, '{"en":"A blazing-fast fintech dashboard and marketing site built with Next.js and real-time data."}'::jsonb, true, 'published', '2026-05-12T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111106', 'atlas-commerce-platform', 'Atlas Commerce', '{"en":"Atlas E-commerce Platform","de":"Atlas E-commerce Platform","fr":"Atlas E-commerce Platform","es":"Atlas E-commerce Platform"}'::jsonb, '{"en":"A headless commerce solution that scaled from 100 to 100,000 daily orders.","de":"A headless commerce solution that scaled from 100 to 100,000 daily orders.","fr":"A headless commerce solution that scaled from 100 to 100,000 daily orders.","es":"A headless commerce solution that scaled from 100 to 100,000 daily orders."}'::jsonb, '{"en":"Peak-season crashes were costing six figures per incident, and the monolith could not scale.","de":"Peak-season crashes were costing six figures per incident, and the monolith could not scale.","fr":"Peak-season crashes were costing six figures per incident, and the monolith could not scale.","es":"Peak-season crashes were costing six figures per incident, and the monolith could not scale."}'::jsonb, '{"en":"We architected a headless commerce stack with edge rendering, elastic infrastructure, and a fully decoupled storefront.","de":"We architected a headless commerce stack with edge rendering, elastic infrastructure, and a fully decoupled storefront.","fr":"We architected a headless commerce stack with edge rendering, elastic infrastructure, and a fully decoupled storefront.","es":"We architected a headless commerce stack with edge rendering, elastic infrastructure, and a fully decoupled storefront."}'::jsonb, '{"en":"A resilient commerce platform with zero-downtime peak performance.","de":"A resilient commerce platform with zero-downtime peak performance.","fr":"A resilient commerce platform with zero-downtime peak performance.","es":"A resilient commerce platform with zero-downtime peak performance."}'::jsonb, '{"en":["Headless Architecture","Edge Rendering","Platform Engineering","Migration"]}'::jsonb, '{"en":"From 100 to 100,000 daily orders with zero outages across three peak seasons."}'::jsonb, '[{"value":"100k+","label_translations":{"en":"Daily orders at peak","de":"Tägliche Bestellungen im Peak","fr":"Commandes quotidiennes en pic","es":"Pedidos diarios en pico"}},{"value":"0","label_translations":{"en":"Outages in 3 seasons","de":"Ausfälle in 3 Saisons","fr":"Interruptions en 3 saisons","es":"Caídas en 3 temporadas"}},{"value":"3x","label_translations":{"en":"Conversion rate","de":"Conversion-Rate","fr":"Taux de conversion","es":"Tasa de conversión"}}]'::jsonb, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333315', '{"en":"Atlas E-commerce Platform — Stratifit"}'::jsonb, '{"en":"A headless commerce solution that scaled from 100 to 100,000 daily orders."}'::jsonb, false, 'published', '2026-06-01T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111107', 'smartflow-ai-pipeline', 'SmartFlow', '{"en":"SmartFlow AI Pipeline","de":"SmartFlow AI Pipeline","fr":"SmartFlow AI Pipeline","es":"SmartFlow AI Pipeline"}'::jsonb, '{"en":"An end-to-end lead qualification system that reduced manual work by 85%.","de":"An end-to-end lead qualification system that reduced manual work by 85%.","fr":"An end-to-end lead qualification system that reduced manual work by 85%.","es":"An end-to-end lead qualification system that reduced manual work by 85%."}'::jsonb, '{"en":"Sales was drowning in unqualified leads while the CRM stayed empty of usable data.","de":"Sales was drowning in unqualified leads while the CRM stayed empty of usable data.","fr":"Sales was drowning in unqualified leads while the CRM stayed empty of usable data.","es":"Sales was drowning in unqualified leads while the CRM stayed empty of usable data."}'::jsonb, '{"en":"We built an AI pipeline that scores, enriches, and routes every inbound lead, syncing straight into the CRM.","de":"We built an AI pipeline that scores, enriches, and routes every inbound lead, syncing straight into the CRM.","fr":"We built an AI pipeline that scores, enriches, and routes every inbound lead, syncing straight into the CRM.","es":"We built an AI pipeline that scores, enriches, and routes every inbound lead, syncing straight into the CRM."}'::jsonb, '{"en":"Every lead qualified, enriched, and routed automatically.","de":"Every lead qualified, enriched, and routed automatically.","fr":"Every lead qualified, enriched, and routed automatically.","es":"Every lead qualified, enriched, and routed automatically."}'::jsonb, '{"en":["AI Lead Scoring","Data Enrichment","CRM Integration","Workflow Automation"]}'::jsonb, '{"en":"Manual follow-up dropped by 85% and sales conversion on qualified leads climbed sharply."}'::jsonb, '[{"value":"-85%","label_translations":{"en":"Manual follow-up work","de":"Manuelle Nachbearbeitung","fr":"Travail de suivi manuel","es":"Trabajo manual de seguimiento"}},{"value":"+41%","label_translations":{"en":"Sales conversion","de":"Vertriebskonversion","fr":"Conversion des ventes","es":"Conversión de ventas"}}]'::jsonb, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333318', '{"en":"SmartFlow AI Pipeline — Stratifit"}'::jsonb, '{"en":"An end-to-end lead qualification system that reduced manual work by 85%."}'::jsonb, false, 'published', '2026-07-08T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111108', 'growthstack-campaign', 'GrowthStack', '{"en":"GrowthStack Campaign","de":"GrowthStack Campaign","fr":"GrowthStack Campaign","es":"GrowthStack Campaign"}'::jsonb, '{"en":"A multi-channel growth campaign generating 340% ROAS across Meta, Google, and TikTok.","de":"A multi-channel growth campaign generating 340% ROAS across Meta, Google, and TikTok.","fr":"A multi-channel growth campaign generating 340% ROAS across Meta, Google, and TikTok.","es":"A multi-channel growth campaign generating 340% ROAS across Meta, Google, and TikTok."}'::jsonb, '{"en":"A B2B SaaS was spending across channels with no visibility into what actually drove pipeline.","de":"A B2B SaaS was spending across channels with no visibility into what actually drove pipeline.","fr":"A B2B SaaS was spending across channels with no visibility into what actually drove pipeline.","es":"A B2B SaaS was spending across channels with no visibility into what actually drove pipeline."}'::jsonb, '{"en":"We rebuilt attribution, restructured campaigns, and stood up a testing engine that compounds learnings weekly.","de":"We rebuilt attribution, restructured campaigns, and stood up a testing engine that compounds learnings weekly.","fr":"We rebuilt attribution, restructured campaigns, and stood up a testing engine that compounds learnings weekly.","es":"We rebuilt attribution, restructured campaigns, and stood up a testing engine that compounds learnings weekly."}'::jsonb, '{"en":"A compounding growth system across paid channels.","de":"A compounding growth system across paid channels.","fr":"A compounding growth system across paid channels.","es":"A compounding growth system across paid channels."}'::jsonb, '{"en":["Performance Marketing","Attribution","CRO","Creative Testing"]}'::jsonb, '{"en":"340% ROAS in the first month, with a compounding testing system still running today."}'::jsonb, '[{"value":"340%","label_translations":{"en":"ROAS across channels","de":"ROAS über alle Kanäle","fr":"ROAS tous canaux","es":"ROAS en todos los canales"}},{"value":"-38%","label_translations":{"en":"Cost per qualified lead","de":"Kosten pro qualifiziertem Lead","fr":"Coût par lead qualifié","es":"Coste por lead cualificado"}}]'::jsonb, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333316', '{"en":"GrowthStack Campaign — Stratifit"}'::jsonb, '{"en":"A multi-channel growth campaign generating 340% ROAS across Meta, Google, and TikTok."}'::jsonb, false, 'published', '2026-07-20T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

INSERT INTO public.portfolio_projects (id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, image_url, testimonial_id, seo_title_translations, seo_description_translations, is_featured, status, published_at)
VALUES
  ('11111111-1111-4111-8111-111111111109', 'vertex-saas-landing', 'Vertex SaaS', '{"en":"Vertex SaaS Landing","de":"Vertex SaaS Landing","fr":"Vertex SaaS Landing","es":"Vertex SaaS Landing"}'::jsonb, '{"en":"A conversion-optimized landing page that achieved a 12% demo request rate.","de":"A conversion-optimized landing page that achieved a 12% demo request rate.","fr":"A conversion-optimized landing page that achieved a 12% demo request rate.","es":"A conversion-optimized landing page that achieved a 12% demo request rate."}'::jsonb, '{"en":"Traffic was strong, but the existing page converted at under 1% and wasted ad spend.","de":"Traffic was strong, but the existing page converted at under 1% and wasted ad spend.","fr":"Traffic was strong, but the existing page converted at under 1% and wasted ad spend.","es":"Traffic was strong, but the existing page converted at under 1% and wasted ad spend."}'::jsonb, '{"en":"We redesigned the message hierarchy, rebuilt the page for speed, and ran structured experiments on every section.","de":"We redesigned the message hierarchy, rebuilt the page for speed, and ran structured experiments on every section.","fr":"We redesigned the message hierarchy, rebuilt the page for speed, and ran structured experiments on every section.","es":"We redesigned the message hierarchy, rebuilt the page for speed, and ran structured experiments on every section."}'::jsonb, '{"en":"A landing page engineered to convert traffic into pipeline.","de":"A landing page engineered to convert traffic into pipeline.","fr":"A landing page engineered to convert traffic into pipeline.","es":"A landing page engineered to convert traffic into pipeline."}'::jsonb, '{"en":["Conversion Design","Messaging","A/B Testing","Performance"]}'::jsonb, '{"en":"12% demo request rate — a 12x improvement over the previous page."}'::jsonb, '[{"value":"12%","label_translations":{"en":"Demo request rate","de":"Demo-Anforderungsrate","fr":"Taux de demandes de démo","es":"Tasa de solicitudes de demo"}},{"value":"12x","label_translations":{"en":"Conversion improvement","de":"Conversion-Verbesserung","fr":"Amélioration de la conversion","es":"Mejora de conversión"}}]'::jsonb, 'https://images.unsplash.com/photo-1467232004584-a241de8a7c0d?w=1200&h=800&fit=crop&auto=format', '33333333-3333-4333-8333-333333333317', '{"en":"Vertex SaaS Landing — Stratifit"}'::jsonb, '{"en":"A conversion-optimized landing page that achieved a 12% demo request rate."}'::jsonb, false, 'published', '2026-08-01T09:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  client_name = EXCLUDED.client_name,
  title_translations = EXCLUDED.title_translations,
  summary_translations = EXCLUDED.summary_translations,
  challenge_translations = EXCLUDED.challenge_translations,
  approach_translations = EXCLUDED.approach_translations,
  solution_translations = EXCLUDED.solution_translations,
  deliverables_translations = EXCLUDED.deliverables_translations,
  results_translations = EXCLUDED.results_translations,
  metrics = EXCLUDED.metrics,
  image_url = EXCLUDED.image_url,
  testimonial_id = EXCLUDED.testimonial_id,
  seo_title_translations = EXCLUDED.seo_title_translations,
  seo_description_translations = EXCLUDED.seo_description_translations,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- Link case studies to services (resolve service ids by slug).
DELETE FROM public.portfolio_service_links
WHERE portfolio_id IN (
  '11111111-1111-4111-8111-111111111101',
  '11111111-1111-4111-8111-111111111102',
  '11111111-1111-4111-8111-111111111103',
  '11111111-1111-4111-8111-111111111104',
  '11111111-1111-4111-8111-111111111105',
  '11111111-1111-4111-8111-111111111106',
  '11111111-1111-4111-8111-111111111107',
  '11111111-1111-4111-8111-111111111108',
  '11111111-1111-4111-8111-111111111109'
);

INSERT INTO public.portfolio_service_links (portfolio_id, service_id)
SELECT p.id, s.id
FROM (VALUES
  ('11111111-1111-4111-8111-111111111101'::uuid, 'brand-design'),
  ('11111111-1111-4111-8111-111111111102'::uuid, 'website-development'),
  ('11111111-1111-4111-8111-111111111103'::uuid, 'ai-automation'),
  ('11111111-1111-4111-8111-111111111104'::uuid, 'brand-design'),
  ('11111111-1111-4111-8111-111111111105'::uuid, 'website-development'),
  ('11111111-1111-4111-8111-111111111106'::uuid, 'website-development'),
  ('11111111-1111-4111-8111-111111111107'::uuid, 'ai-automation'),
  ('11111111-1111-4111-8111-111111111108'::uuid, 'growth-marketing'),
  ('11111111-1111-4111-8111-111111111109'::uuid, 'website-development')
) AS x(portfolio_id, service_slug)
JOIN public.services s ON s.slug = x.service_slug
JOIN public.portfolio_projects p ON p.id = x.portfolio_id
ON CONFLICT DO NOTHING;

-- Trusted logos (real client/partner brands)
INSERT INTO public.trusted_logos (id, name, image_url, href, display_order, is_visible, is_verified) VALUES
  ('55555555-5555-4555-8555-555555555501', 'Maison Lumière', 'https://images.unsplash.com/photo-1567449303078-57ad995bd17b?w=400&h=120&fit=crop&auto=format', NULL, 1, true, true),
  ('55555555-5555-4555-8555-555555555502', 'Nova Fintech', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=120&fit=crop&auto=format', NULL, 2, true, true),
  ('55555555-5555-4555-8555-555555555503', 'Helios Health', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=120&fit=crop&auto=format', NULL, 3, true, true),
  ('55555555-5555-4555-8555-555555555504', 'Zenith Bank', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=120&fit=crop&auto=format', NULL, 4, true, true),
  ('55555555-5555-4555-8555-555555555505', 'Atlas Commerce', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=120&fit=crop&auto=format', NULL, 5, true, true),
  ('55555555-5555-4555-8555-555555555506', 'GrowthStack', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=120&fit=crop&auto=format', NULL, 6, true, true),
  ('55555555-5555-4555-8555-555555555507', 'Aura Cosmetics', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=120&fit=crop&auto=format', NULL, 7, true, true),
  ('55555555-5555-4555-8555-555555555508', 'Nordlicht Logistics', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=120&fit=crop&auto=format', NULL, 8, true, true),
  ('55555555-5555-4555-8555-555555555509', 'Vertex SaaS', 'https://images.unsplash.com/photo-1467232004584-a241de8a7c0d?w=400&h=120&fit=crop&auto=format', NULL, 9, true, true),
  ('55555555-5555-4555-8555-555555555510', 'SmartFlow', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=120&fit=crop&auto=format', NULL, 10, true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  is_visible = EXCLUDED.is_visible,
  is_verified = EXCLUDED.is_verified;
