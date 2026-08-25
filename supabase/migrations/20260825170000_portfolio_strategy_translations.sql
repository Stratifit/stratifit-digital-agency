-- Migration: 20260825170000_portfolio_strategy_translations
-- Description: Adds `strategy_translations` to portfolio_projects so brand
--              case studies can carry the "Discovery & Strategy" phase
--              document (subtitle, tagline, headline, audience insights,
--              brand challenges, positioning, messaging direction, identity
--              direction) per locale, and backfills the CLENQO case study
--              with the approved rollout copy.
-- Stratifit Digital Agency Platform

ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS strategy_translations jsonb;

COMMENT ON COLUMN public.portfolio_projects.strategy_translations
  IS 'Multilingual Discovery & Strategy phase document for brand case studies: subtitle, tagline, headline, audience, challenges, positioning, messaging, identity.';

-- Backfill the CLENQO brand case study.
UPDATE public.portfolio_projects
SET strategy_translations = '{
  "en": {
    "subtitle": "Professional cleaning · eco-friendly products · trusted service for your home and business.",
    "tagline": "Clean Spaces. Better Living.",
    "headline": "CLEAN, PREMIUM STRUCTURE",
    "audience": "Busy homeowners and small businesses who value cleanliness, trust, and environmentally conscious solutions, but need a brand that clearly communicates professionalism.",
    "challenges": "The previous identity lacked authority, visual consistency, and a clear hierarchy—making it difficult to stand out in a competitive market. Research showed customers respond strongly to brands that feel modern, trustworthy, and transparent about eco-friendly practices.",
    "positioning": "Define CLENQO as a modern, trustworthy, eco-focused cleaning service that delivers professional results with environmental responsibility at its core.",
    "messaging": "Craft a clear, confident voice that communicates reliability, eco-awareness, and service excellence removing ambiguity and reinforcing trust.",
    "identity": "Craft a clear, confident voice that communicates reliability, eco-awareness, and service excellence removing ambiguity and reinforcing trust."
  },
  "de": {
    "subtitle": "Professionelle Reinigung · umweltfreundliche Produkte · vertrauensvoller Service für Zuhause und Unternehmen.",
    "tagline": "Saubere Räume. Besser leben.",
    "headline": "SAUBERE, PREMIUM-STRUKTUR",
    "audience": "Vielbeschäftigte Hausbesitzer und kleine Unternehmen, die Wert auf Sauberkeit, Vertrauen und umweltbewusste Lösungen legen, aber eine Marke brauchen, die Professionalität klar kommuniziert.",
    "challenges": "Die bisherige Identität entbehrte Autorität, visueller Konsistenz und einer klaren Hierarchie — was es schwer machte, sich in einem wettbewerbsintensiven Markt abzuheben. Recherchen zeigten, dass Kunden stark auf Marken reagieren, die modern, vertrauenswürdig und transparent in Bezug auf umweltfreundliche Praktiken wirken.",
    "positioning": "CLENQO als modernen, vertrauenswürdigen, umweltorientierten Reinigungsservice positionieren, der professionelle Ergebnisse liefert und ökologische Verantwortung in den Mittelpunkt stellt.",
    "messaging": "Eine klare, selbstbewusste Stimme schaffen, die Zuverlässigkeit, Umweltbewusstsein und Service-Exzellenz kommuniziert, Mehrdeutigkeiten beseitigt und Vertrauen stärkt.",
    "identity": "Eine klare, selbstbewusste Stimme schaffen, die Zuverlässigkeit, Umweltbewusstsein und Service-Exzellenz kommuniziert, Mehrdeutigkeiten beseitigt und Vertrauen stärkt."
  },
  "fr": {
    "subtitle": "Nettoyage professionnel · produits écologiques · service de confiance pour votre maison et votre entreprise.",
    "tagline": "Des espaces propres. Une vie meilleure.",
    "headline": "STRUCTURE PROPRE ET PREMIUM",
    "audience": "Des propriétaires occupés et des petites entreprises qui attachent de l''importance à la propreté, à la confiance et aux solutions respectueuses de l''environnement, mais qui ont besoin d''une marque communiquant clairement son professionnalisme.",
    "challenges": "L''identité précédente manquait d''autorité, de cohérence visuelle et d''une hiérarchie claire — ce qui rendait difficile de se démarquer sur un marché concurrentiel. Les recherches ont montré que les clients réagissent fortement aux marques qui semblent modernes, dignes de confiance et transparentes quant à leurs pratiques écologiques.",
    "positioning": "Positionner CLENQO comme un service de nettoyage moderne, digne de confiance et axé sur l''écologie, qui offre des résultats professionnels avec la responsabilité environnementale au cœur de son approche.",
    "messaging": "Forger une voix claire et confiante qui communique fiabilité, conscience écologique et excellence du service, en éliminant l''ambiguïté et en renforçant la confiance.",
    "identity": "Forger une voix claire et confiante qui communique fiabilité, conscience écologique et excellence du service, en éliminant l''ambiguïté et en renforçant la confiance."
  },
  "es": {
    "subtitle": "Limpieza profesional · productos ecológicos · servicio de confianza para tu hogar y tu negocio.",
    "tagline": "Espacios limpios. Mejor vida.",
    "headline": "ESTRUCTURA LIMPIA Y PREMIUM",
    "audience": "Propietarios ocupados y pequeñas empresas que valoran la limpieza, la confianza y las soluciones respetuosas con el medio ambiente, pero necesitan una marca que comunique claramente el profesionalismo.",
    "challenges": "La identidad anterior carecía de autoridad, coherencia visual y una jerarquía clara, lo que dificultaba destacar en un mercado competitivo. La investigación mostró que los clientes responden con fuerza a las marcas que se perciben modernas, confiables y transparentes en cuanto a prácticas ecológicas.",
    "positioning": "Posicionar a CLENQO como un servicio de limpieza moderno, confiable y centrado en lo ecológico que ofrece resultados profesionales con la responsabilidad ambiental en su núcleo.",
    "messaging": "Crear una voz clara y segura que comunique confiabilidad, conciencia ecológica y excelencia en el servicio, eliminando la ambigüedad y reforzando la confianza.",
    "identity": "Crear una voz clara y segura que comunique confiabilidad, conciencia ecológica y excelencia en el servicio, eliminando la ambigüedad y reforzando la confianza."
  }
}'::jsonb
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.portfolio_projects DROP COLUMN IF EXISTS strategy_translations;
