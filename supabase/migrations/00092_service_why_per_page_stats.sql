-- Migration: 00092_service_why_per_page_stats
-- Description: Give Brand Design, Website Development, and AI & Automation
--              their own page-specific Why It Matters stat cards (output and
--              experience counts credible for the agency's client base),
--              instead of all sharing the Growth & Marketing ROAS figures.
--              Growth & Marketing already has its matching numbers and is
--              left untouched. All values remain CMS-editable via why_badges.
-- Stratifit Digital Agency Platform

-- Brand Design — brand output & experience
UPDATE public.service_pages
SET why_badges = '[
  {
    "value": "50+",
    "label_translations": {
      "de": "Markenidentitäten",
      "en": "Brand Systems",
      "es": "Sistemas de marca",
      "fr": "Identités de marque"
    },
    "hint_translations": {
      "de": "entwickelte Markensysteme",
      "en": "identities designed",
      "es": "identidades diseñadas",
      "fr": "identités conçues"
    }
  },
  {
    "value": "120+",
    "label_translations": {
      "de": "Design-Assets",
      "en": "Design Assets",
      "es": "Activos de diseño",
      "fr": "Supports de design"
    },
    "hint_translations": {
      "de": "Logos & Markenrichtlinien",
      "en": "logos & guidelines produced",
      "es": "logotipos y directrices",
      "fr": "logos et chartes livrés"
    }
  },
  {
    "value": "12+",
    "label_translations": {
      "de": "Jahre Erfahrung",
      "en": "Years of Experience",
      "es": "Años de experiencia",
      "fr": "Ans d''expérience"
    },
    "hint_translations": {
      "de": "in Marke und Design",
      "en": "in brand & design",
      "es": "en marca y diseño",
      "fr": "en marque et design"
    }
  }
]'::jsonb
WHERE slug = 'brand-design';

-- Web Development — delivery output & experience
UPDATE public.service_pages
SET why_badges = '[
  {
    "value": "50+",
    "label_translations": {
      "de": "Websites gelauncht",
      "en": "Websites Launched",
      "es": "Sitios web lanzados",
      "fr": "Sites web lancés"
    },
    "hint_translations": {
      "de": "live und betreut",
      "en": "live & maintained",
      "es": "en producción y mantenidos",
      "fr": "en ligne et maintenus"
    }
  },
  {
    "value": "120+",
    "label_translations": {
      "de": "Projekte umgesetzt",
      "en": "Projects Delivered",
      "es": "Proyectos entregados",
      "fr": "Projets livrés"
    },
    "hint_translations": {
      "de": "Web & Anwendungen",
      "en": "web & application builds",
      "es": "web y aplicaciones",
      "fr": "sites et applications"
    }
  },
  {
    "value": "12+",
    "label_translations": {
      "de": "Jahre Erfahrung",
      "en": "Years of Experience",
      "es": "Años de experiencia",
      "fr": "Ans d''expérience"
    },
    "hint_translations": {
      "de": "in Web und Technik",
      "en": "in web & engineering",
      "es": "en web e ingeniería",
      "fr": "en web et ingénierie"
    }
  }
]'::jsonb
WHERE slug = 'website-development';

-- AI & Automation — automation output & support
UPDATE public.service_pages
SET why_badges = '[
  {
    "value": "50+",
    "label_translations": {
      "de": "Automatisierungen",
      "en": "Automations Built",
      "es": "Automatizaciones",
      "fr": "Automatisations"
    },
    "hint_translations": {
      "de": "implementierte Workflows",
      "en": "workflows deployed",
      "es": "flujos implementados",
      "fr": "flux de travail déployés"
    }
  },
  {
    "value": "25+",
    "label_translations": {
      "de": "KI-Assistenten",
      "en": "AI Assistants",
      "es": "Asistentes de IA",
      "fr": "Assistants IA"
    },
    "hint_translations": {
      "de": "für Kunden gelauncht",
      "en": "launched for clients",
      "es": "lanzados para clientes",
      "fr": "lancés pour les clients"
    }
  },
  {
    "value": "24/7",
    "label_translations": {
      "de": "Überwachung",
      "en": "Monitoring",
      "es": "Supervisión",
      "fr": "Surveillance"
    },
    "hint_translations": {
      "de": "und laufender Support",
      "en": "& ongoing support",
      "es": "y soporte continuo",
      "fr": "et assistance continue"
    }
  }
]'::jsonb
WHERE slug = 'ai-automation';
