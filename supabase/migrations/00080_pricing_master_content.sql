-- =============================================================================
-- Pricing: approved STRATIFIT master content (4 plans, 4 languages)
-- Adds footnote_translations to section_settings for the net-prices disclaimer.
-- =============================================================================

-- Footnote column for section-level disclaimers (used by the pricing section)
ALTER TABLE public.section_settings
  ADD COLUMN IF NOT EXISTS footnote_translations jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Header copy + net-prices disclaimer for the Pricing section (all 4 languages)
INSERT INTO public.section_settings (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, footnote_translations, is_visible, display_order)
VALUES
  ('pricing', 'Pricing', '{"en":"Pricing","de":"Preise","fr":"Tarifs","es":"Precios"}'::jsonb, '{"en":"Service","de":"Leistungs","fr":"Offres de","es":"Paquetes de"}'::jsonb, '{"en":"Packages","de":"pakete","fr":"services","es":"servicios"}'::jsonb, '{"en":"Clear starting prices for every stage of growth. Final scope, timeline, and investment are confirmed after discovery.","de":"Klare Startpreise für jede Wachstumsphase. Leistungsumfang, Zeitrahmen und Investition werden nach der Analyse verbindlich festgelegt.","fr":"Des tarifs de départ clairs pour chaque phase de croissance. Le périmètre, le calendrier et l’investissement définitifs sont confirmés après la phase de découverte.","es":"Precios iniciales claros para cada etapa de crecimiento. El alcance, el plazo y la inversión definitivos se confirman después de la fase de descubrimiento."}'::jsonb, '{"en":"Prices shown are starting net prices for business clients. VAT and external service costs are added where applicable.","de":"Alle genannten Preise verstehen sich als Nettopreise für Geschäftskunden. Umsatzsteuer und Kosten externer Anbieter werden gegebenenfalls zusätzlich berechnet.","fr":"Les prix indiqués sont des tarifs nets de départ destinés aux clients professionnels. La TVA et les frais de services externes s’ajoutent lorsqu’ils sont applicables.","es":"Los precios indicados son importes netos iniciales para clientes empresariales. El IVA y los costes de servicios externos se añadirán cuando corresponda."}'::jsonb, true, 70)
ON CONFLICT (section_key) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  footnote_translations = EXCLUDED.footnote_translations;

-- Update the pricing plans with the approved master content
INSERT INTO public.pricing_plans (slug, name_translations, description_translations, price_label_translations, billing_label_translations, features_translations, limitations_translations, cta_label_translations, cta_url, display_order, is_featured, is_visible, status)
VALUES
  ('launch',
   '{"en":"Launch","de":"Start","fr":"Lancement","es":"Lanzamiento"}'::jsonb,
   '{"en":"For startups and new businesses building a credible digital foundation.","de":"Für Start-ups und neue Unternehmen, die eine überzeugende digitale Grundlage schaffen möchten.","fr":"Pour les startups et nouvelles entreprises qui souhaitent construire une base numérique crédible.","es":"Para startups y nuevas empresas que necesitan una base digital sólida y profesional."}'::jsonb,
   '{"en":"From €7,500","de":"Ab 7.500 €","fr":"À partir de 7 500 €","es":"Desde 7.500 €"}'::jsonb,
   '{"en":"Per project","de":"Pro Projekt","fr":"Par projet","es":"Por proyecto"}'::jsonb,
   '{"en":["Project discovery and strategy","Core brand identity","Custom website with up to 5 pages","CMS, analytics, and technical SEO setup","14 days of support after launch"],"de":["Projektanalyse und Strategie","Grundlegende Markenidentität","Individuelle Website mit bis zu 5 Seiten","Einrichtung von CMS, Webanalyse und technischen SEO-Grundlagen","14 Tage Support nach dem Launch"],"fr":["Découverte et stratégie de projet","Identité de marque essentielle","Site web sur mesure jusqu’à 5 pages","Configuration du CMS, des outils d’analyse et du SEO technique","14 jours d’assistance après le lancement"],"es":["Descubrimiento y estrategia del proyecto","Identidad de marca esencial","Sitio web a medida de hasta 5 páginas","Configuración del CMS, analítica y SEO técnico","14 días de soporte después del lanzamiento"]}'::jsonb,
   '[]'::jsonb,
   '{"en":"Start Your Project","de":"Projekt starten","fr":"Démarrer votre projet","es":"Iniciar su proyecto"}'::jsonb,
   '/contact',
   1,
   false,
   true,
   'published'),
  ('grow',
   '{"en":"Grow","de":"Wachstum","fr":"Croissance","es":"Crecimiento"}'::jsonb,
   '{"en":"For growing businesses ready to strengthen their brand and convert more customers.","de":"Für wachsende Unternehmen, die ihre Marke stärken und mehr Kunden gewinnen möchten.","fr":"Pour les entreprises en croissance qui souhaitent renforcer leur marque et convertir davantage de clients.","es":"Para empresas en crecimiento que desean reforzar su marca y convertir más clientes."}'::jsonb,
   '{"en":"From €15,000","de":"Ab 15.000 €","fr":"À partir de 15 000 €","es":"Desde 15.000 €"}'::jsonb,
   '{"en":"Per project","de":"Pro Projekt","fr":"Par projet","es":"Por proyecto"}'::jsonb,
   '{"en":["Brand strategy and visual identity system","Custom website with up to 12 pages","Conversion strategy and user experience","CMS and business integrations","30 days of support after launch"],"de":["Markenstrategie und visuelles Identitätssystem","Individuelle Website mit bis zu 12 Seiten","Conversion-Strategie und Nutzererlebnis","CMS und Geschäftsintegrationen","30 Tage Support nach dem Launch"],"fr":["Stratégie de marque et système d’identité visuelle","Site web sur mesure jusqu’à 12 pages","Stratégie de conversion et expérience utilisateur","CMS et intégrations métier","30 jours d’assistance après le lancement"],"es":["Estrategia de marca y sistema de identidad visual","Sitio web a medida de hasta 12 páginas","Estrategia de conversión y experiencia de usuario","CMS e integraciones empresariales","30 días de soporte después del lanzamiento"]}'::jsonb,
   '[]'::jsonb,
   '{"en":"Start Your Project","de":"Projekt starten","fr":"Démarrer votre projet","es":"Iniciar su proyecto"}'::jsonb,
   '/contact',
   2,
   true,
   true,
   'published'),
  ('scale',
   '{"en":"Scale","de":"Skalierung","fr":"Expansion","es":"Expansión"}'::jsonb,
   '{"en":"For established businesses building advanced digital products, platforms, or automation.","de":"Für etablierte Unternehmen, die anspruchsvolle digitale Produkte, Plattformen oder Automatisierungen entwickeln möchten.","fr":"Pour les entreprises établies qui développent des produits numériques, des plateformes ou des automatisations avancées.","es":"Para empresas consolidadas que desarrollan productos digitales, plataformas o automatizaciones avanzadas."}'::jsonb,
   '{"en":"From €30,000","de":"Ab 30.000 €","fr":"À partir de 30 000 €","es":"Desde 30.000 €"}'::jsonb,
   '{"en":"Per project","de":"Pro Projekt","fr":"Par projet","es":"Por proyecto"}'::jsonb,
   '{"en":["Product strategy and UX architecture","Web application, portal, or e-commerce platform","Advanced CMS and data integrations","AI and workflow automation","60 days of support after launch"],"de":["Produktstrategie und UX-Architektur","Webanwendung, Portal oder E-Commerce-Plattform","Erweiterte CMS- und Datenintegrationen","KI- und Workflow-Automatisierung","60 Tage Support nach dem Launch"],"fr":["Stratégie produit et architecture de l’expérience utilisateur","Application web, portail ou plateforme e-commerce","CMS avancé et intégrations de données","Solutions d’IA et automatisation des processus","60 jours d’assistance après le lancement"],"es":["Estrategia de producto y arquitectura de experiencia de usuario","Aplicación web, portal o plataforma de comercio electrónico","CMS avanzado e integraciones de datos","IA y automatización de flujos de trabajo","60 días de soporte después del lanzamiento"]}'::jsonb,
   '[]'::jsonb,
   '{"en":"Discuss Your Project","de":"Projekt besprechen","fr":"Parler de votre projet","es":"Hablar sobre su proyecto"}'::jsonb,
   '/contact',
   3,
   false,
   true,
   'published'),
  ('custom',
   '{"en":"Custom","de":"Individuell","fr":"Sur mesure","es":"A medida"}'::jsonb,
   '{"en":"For complex initiatives requiring a tailored team, scope, and delivery model.","de":"Für komplexe Vorhaben, die ein passendes Team, einen flexiblen Leistungsumfang und ein individuelles Umsetzungsmodell erfordern.","fr":"Pour les projets complexes nécessitant une équipe, un périmètre et un modèle de réalisation sur mesure.","es":"Para iniciativas complejas que requieren un equipo, un alcance y un modelo de ejecución adaptados al proyecto."}'::jsonb,
   '{"en":"Tailored Proposal","de":"Individuelles Angebot","fr":"Offre personnalisée","es":"Propuesta personalizada"}'::jsonb,
   '{"en":"","de":"","fr":"","es":""}'::jsonb,
   '{"en":["Custom discovery, scope, and roadmap","Dedicated multidisciplinary team","Complex platforms and system integrations","Brand, web, AI, and growth workstreams","Support and SLA options"],"de":["Individuelle Analyse, Leistungsumfang und Roadmap","Festes multidisziplinäres Team","Komplexe Plattformen und Systemintegrationen","Koordinierte Leistungen für Marke, Web, KI und Wachstum","Support- und SLA-Optionen"],"fr":["Découverte, cadrage et feuille de route personnalisés","Équipe multidisciplinaire dédiée","Plateformes complexes et intégrations de systèmes","Expertise coordonnée en marque, web, IA et croissance","Options d’assistance et de niveau de service"],"es":["Descubrimiento, alcance y hoja de ruta personalizados","Equipo multidisciplinario dedicado","Plataformas complejas e integraciones de sistemas","Servicios coordinados de marca, web, IA y crecimiento","Opciones de soporte y acuerdos de nivel de servicio"]}'::jsonb,
   '[]'::jsonb,
   '{"en":"Book a Consultation","de":"Beratung vereinbaren","fr":"Réserver une consultation","es":"Reservar una consulta"}'::jsonb,
   '/contact',
   4,
   false,
   true,
   'published')
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

-- Rollback
-- ALTER TABLE public.section_settings DROP COLUMN footnote_translations;
