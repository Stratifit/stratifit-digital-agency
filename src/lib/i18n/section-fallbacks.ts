/**
 * Fallback section-header content, keyed by `section_settings.section_key`.
 *
 * The homepage sections and the chat widget render their headings from
 * `section_settings` rows. If a row's translations are empty (or the row is
 * missing), the section header would render a blank title/description. This
 * registry mirrors the seed content so headers always render something
 * meaningful. The database remains the source of truth — these values only
 * kick in when the DB has no usable text.
 */

export type LocaleMap = { en: string; de: string; fr: string; es: string };

export interface SectionHeaderFallback {
  eyebrow: LocaleMap;
  title: LocaleMap;
  highlight: LocaleMap;
  description: LocaleMap;
}

export const SECTION_HEADER_FALLBACKS: Record<
  string,
  SectionHeaderFallback
> = {
  "tech-stack": {
    eyebrow: { en: "", de: "", fr: "", es: "" },
    title: { en: "Our", de: "Unser", fr: "Notre", es: "Nuestro" },
    highlight: {
      en: "Tech Stack",
      de: "Tech-Stack",
      fr: "stack technique",
      es: "stack tecnológico",
    },
    description: {
      en: "We build with trusted, modern technologies.",
      de: "Wir bauen mit vertrauenswürdigen, modernen Technologien.",
      fr: "Nous construisons avec des technologies modernes et éprouvées.",
      es: "Construimos con tecnologías modernas y confiables.",
    },
  },
  services: {
    eyebrow: { en: "Services", de: "Leistungen", fr: "Services", es: "Servicios" },
    title: {
      en: "Our Core",
      de: "Unsere Kernleistungen",
      fr: "Nos Services Principaux",
      es: "Nuestros Servicios Principales",
    },
    highlight: { en: "Services", de: "", fr: "", es: "" },
    description: {
      en: "Strategic solutions engineered to scale your digital presence with precision and luxury.",
      de: "Strategische Lösungen, die Ihre digitale Präsenz präzise und hochwertig skalieren.",
      fr: "Des solutions stratégiques conçues pour développer votre présence numérique avec précision et luxe.",
      es: "Soluciones estratégicas diseñadas para escalar su presencia digital con precisión y lujo.",
    },
  },
  process: {
    eyebrow: { en: "Process", de: "Prozess", fr: "Processus", es: "Proceso" },
    title: { en: "How We", de: "Wie wir", fr: "Comment nous", es: "Cómo" },
    highlight: { en: "Work", de: "arbeiten", fr: "travaillons", es: "trabajamos" },
    description: {
      en: "A proven framework that takes you from idea to scale, predictably and efficiently.",
      de: "Ein bewährtes Rahmenwerk, das Sie von der Idee bis zur Skalierung führt, vorhersehbar und effizient.",
      fr: "Un cadre éprouvé qui vous mène de l'idée à l'échelle, de manière prévisible et efficace.",
      es: "Un marco probado que le lleva de la idea a la escala, de forma predecible y eficiente.",
    },
  },
  "why-choose-us": {
    eyebrow: { en: "Why Us", de: "Warum wir", fr: "Pourquoi nous", es: "Por qué nosotros" },
    title: {
      en: "Not Just Another",
      de: "Nicht nur eine weitere",
      fr: "Pas juste une autre",
      es: "No solo otra",
    },
    highlight: { en: "Agency", de: "Agentur", fr: "agence", es: "agencia" },
    description: {
      en: "We build digital assets that drive valuation and market authority, not just websites.",
      de: "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern, nicht nur Websites.",
      fr: "Nous créons des actifs numériques qui augmentent la valorisation et l'autorité de marché, pas seulement des sites web.",
      es: "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web.",
    },
  },
  insights: {
    eyebrow: { en: "Knowledge", de: "Wissen", fr: "Savoir", es: "Conocimiento" },
    title: {
      en: "Insights &",
      de: "Einblicke &",
      fr: "Insights &",
      es: "Perspectivas y",
    },
    highlight: { en: "Expertise", de: "Expertise", fr: "Expertise", es: "Expertise" },
    description: {
      en: "Thought leadership, industry perspectives, and actionable strategies from our team of strategists, designers, and engineers.",
      de: "Thought Leadership, Branchenperspektiven und umsetzbare Strategien von unserem Team aus Strategen, Designern und Ingenieuren.",
      fr: "Leadership éclairé, perspectives sectorielles et stratégies concrètes de notre équipe de stratèges, designers et ingénieurs.",
      es: "Liderazgo de pensamiento, perspectivas de la industria y estrategias accionables de nuestro equipo de estrategas, diseñadores e ingenieros.",
    },
  },
  portfolio: {
    eyebrow: { en: "Portfolio", de: "Portfolio", fr: "Portfolio", es: "Portafolio" },
    title: { en: "Our", de: "Unsere", fr: "Nos", es: "Nuestros" },
    highlight: { en: "Work", de: "Arbeiten", fr: "Réalisations", es: "Proyectos" },
    description: {
      en: "We craft digital experiences that define industries and elevate brands through precision and creativity.",
      de: "Wir gestalten digitale Erlebnisse, die Branchen definieren und Marken durch Präzision und Kreativität aufwerten.",
      fr: "Nous créons des expériences numériques qui définissent les industries et élèvent les marques grâce à la précision et la créativité.",
      es: "Creamos experiencias digitales que definen industrias y elevan marcas a través de la precisión y la creatividad.",
    },
  },
  acquisition: {
    eyebrow: { en: "Acquisition", de: "Akquisition", fr: "Acquisition", es: "Adquisición" },
    title: { en: "Buy a", de: "Kaufen Sie ein", fr: "Achetez une", es: "Compre un" },
    highlight: { en: "Business", de: "Unternehmen", fr: "entreprise", es: "negocio" },
    description: {
      en: "Skip the startup grind. Browse turnkey businesses with real revenue, existing customers, and systems already in place.",
      de: "Überspringen Sie den Startup-Marathon. Stöbern Sie durch schlüsselfertige Unternehmen mit echten Einnahmen, bestehenden Kunden und vorhandenen Systemen.",
      fr: "Sautez l'étape startup. Parcourez des entreprises clés en main avec un vrai chiffre d'affaires, des clients existants et des systèmes déjà en place.",
      es: "Omita la rutina de las startups. Explore negocios llave en mano con ingresos reales, clientes existentes y sistemas ya implementados.",
    },
  },
  testimonials: {
    eyebrow: { en: "Testimonials", de: "Referenzen", fr: "Témoignages", es: "Testimonios" },
    title: {
      en: "What Our Clients",
      de: "Was unsere Kunden",
      fr: "Ce que disent nos clients",
      es: "Lo que dicen nuestros clientes",
    },
    highlight: { en: "Say", de: "sagen", fr: "", es: "" },
    description: {
      en: "Don't take our word for it, hear from the brands we've helped scale.",
      de: "Verlassen Sie sich nicht nur auf unser Wort, hören Sie, was die Marken sagen, denen wir zum Wachstum verholfen haben.",
      fr: "Ne nous croyez pas sur parole, écoutez les marques que nous avons aidées à se développer.",
      es: "No confíe solo en nuestra palabra: escuche a las marcas que hemos ayudado a escalar.",
    },
  },
  pricing: {
    eyebrow: { en: "Pricing", de: "Preise", fr: "Tarifs", es: "Precios" },
    title: {
      en: "Service",
      de: "Service",
      fr: "Forfaits de",
      es: "Paquetes de",
    },
    highlight: { en: "Packages", de: "Pakete", fr: "services", es: "servicios" },
    description: {
      en: "Transparent pricing for every stage of growth. Start where you are and scale with confidence.",
      de: "Transparente Preise für jede Wachstumsphase. Starten Sie dort, wo Sie sind, und skalieren Sie mit Zuversicht.",
      fr: "Des tarifs transparents pour chaque étape de croissance. Commencez là où vous êtes et développez-vous en confiance.",
      es: "Precios transparentes para cada etapa de crecimiento. Empiece donde está y escale con confianza.",
    },
  },
  faq: {
    eyebrow: { en: "Support", de: "Support", fr: "Support", es: "Soporte" },
    title: {
      en: "Frequently Asked",
      de: "Häufig gestellte",
      fr: "Questions",
      es: "Preguntas",
    },
    highlight: { en: "Questions", de: "Fragen", fr: "fréquentes", es: "frecuentes" },
    description: {
      en: "Clear answers to the most common questions we hear from clients.",
      de: "Klare Antworten auf die häufigsten Fragen, die wir von Kunden hören.",
      fr: "Des réponses claires aux questions les plus courantes que nous recevons de nos clients.",
      es: "Respuestas claras a las preguntas más comunes que recibimos de los clientes.",
    },
  },
  contact: {
    eyebrow: { en: "Contact", de: "Kontakt", fr: "Contact", es: "Contacto" },
    title: { en: "Let's Talk", de: "Sprechen wir", fr: "Parlons-en", es: "Hablemos" },
    highlight: { en: "", de: "", fr: "", es: "" },
    description: {
      en: "Ready to start your project? Fill out the form and we'll get back to you within 24 hours.",
      de: "Bereit, Ihr Projekt zu starten? Füllen Sie das Formular aus, wir melden uns innerhalb von 24 Stunden.",
      fr: "Prêt à lancer votre projet ? Remplissez le formulaire et nous vous répondrons sous 24 heures.",
      es: "¿Listo para empezar su proyecto? Complete el formulario y le responderemos en 24 horas.",
    },
  },
};
