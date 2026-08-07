import type { PublicAcquisitionNiche } from "@/features/acquisition/niche-queries";

/**
 * Canonical acquisition niche catalog used as a render fallback when the
 * `acquisition_niches` table has no rows (e.g. before migration 00043 is
 * applied, or on a fresh local database). Content mirrors the seed data in
 * supabase/migrations/00043_acquisition_niches.sql in all 4 languages.
 *
 * Database content always wins: public queries are preferred and this list is
 * only used when the DB returns zero niches, so no page renders an empty grid.
 */
export const FALLBACK_ACQUISITION_NICHES: PublicAcquisitionNiche[] = [
  {
    id: "00000000-0000-4000-8000-0000000000e1",
    slug: "ecommerce",
    emoji: "🛒",
    accent: "#F59E0B",
    label_translations: {
      en: "Ecommerce",
      de: "E-Commerce",
      fr: "E-commerce",
      es: "Ecommerce",
    },
    description_translations: {
      en: "Acquire profitable, turnkey online stores with established traffic, revenue, and brand equity.",
      de: "Übernehmen Sie profitable, schlüsselfertige Online-Shops mit etabliertem Traffic, Umsatz und Markenwert.",
      fr: "Acquérez des boutiques en ligne rentables et clés en main, avec un trafic, un chiffre d'affaires et une marque établis.",
      es: "Adquiera tiendas online rentables y listas para operar, con tráfico, ingresos y valor de marca consolidados.",
    },
    why_title_translations: {
      en: "Why Ecommerce?",
      de: "Warum E-Commerce?",
      fr: "Pourquoi l'e-commerce ?",
      es: "¿Por qué Ecommerce?",
    },
    why_description_translations: {
      en: "Ecommerce businesses represent one of the most accessible acquisition opportunities in today's market. With proven product-market fit, established revenue streams, and significant growth potential, these assets offer a faster path to ownership than building from scratch.",
      de: "E-Commerce-Unternehmen gehören zu den zugänglichsten Übernahmechancen im heutigen Markt. Mit bewährtem Product-Market-Fit, etablierten Einnahmequellen und erheblichem Wachstumspotenzial bieten diese Assets einen schnelleren Weg in die Selbstständigkeit als ein Start von null.",
      fr: "Les entreprises e-commerce représentent l'une des opportunités d'acquisition les plus accessibles du marché actuel. Avec un produit validé, des revenus établis et un fort potentiel de croissance, ces actifs offrent un chemin plus rapide vers la propriété que de partir de zéro.",
      es: "Los negocios de ecommerce representan una de las oportunidades de adquisición más accesibles del mercado actual. Con un ajuste producto-mercado demostrado, flujos de ingresos consolidados y un gran potencial de crecimiento, estos activos ofrecen un camino más rápido hacia la propiedad que empezar de cero.",
    },
    stats: [
      {
        value: "$85K",
        label_translations: {
          en: "Avg. Revenue",
          de: "Ø-Umsatz",
          fr: "CA moyen",
          es: "Ingresos prom.",
        },
        hint_translations: {
          en: "across our ecommerce portfolio",
          de: "in unserem E-Commerce-Portfolio",
          fr: "dans notre portefeuille e-commerce",
          es: "en nuestro portafolio ecommerce",
        },
      },
      {
        value: "4.2×",
        label_translations: {
          en: "Multiplier",
          de: "Multiplikator",
          fr: "Multiple",
          es: "Multiplicador",
        },
        hint_translations: {
          en: "typical asking price multiple",
          de: "typisches Preis-Multiple",
          fr: "multiple de prix typique",
          es: "múltiplo de precio típico",
        },
      },
      {
        value: "12+",
        label_translations: {
          en: "Traffic Sources",
          de: "Traffic-Quellen",
          fr: "Sources de trafic",
          es: "Fuentes de tráfico",
        },
        hint_translations: {
          en: "diversified acquisition channels",
          de: "diversifizierte Akquise-Kanäle",
          fr: "canaux d'acquisition diversifiés",
          es: "canales de adquisición diversificados",
        },
      },
    ],
    is_visible: true,
    display_order: 10,
  },
  {
    id: "00000000-0000-4000-8000-0000000000e2",
    slug: "saas",
    emoji: "☁️",
    accent: "#6C5CE7",
    label_translations: {
      en: "SaaS",
      de: "SaaS",
      fr: "SaaS",
      es: "SaaS",
    },
    description_translations: {
      en: "Own established software businesses with recurring revenue, low churn, and scalable infrastructure.",
      de: "Übernehmen Sie etablierte Software-Unternehmen mit wiederkehrenden Umsätzen, niedriger Churn-Rate und skalierbarer Infrastruktur.",
      fr: "Possédez des logiciels établis avec des revenus récurrents, un faible taux de churn et une infrastructure scalable.",
      es: "Sea dueño de negocios de software consolidados con ingresos recurrentes, baja rotación e infraestructura escalable.",
    },
    why_title_translations: {
      en: "Why SaaS?",
      de: "Warum SaaS?",
      fr: "Pourquoi le SaaS ?",
      es: "¿Por qué SaaS?",
    },
    why_description_translations: {
      en: "SaaS businesses represent one of the most attractive acquisition opportunities in today's market. With proven business models, established revenue streams, and significant growth potential, these assets offer a faster path to ownership than building from scratch.",
      de: "SaaS-Unternehmen gehören zu den attraktivsten Übernahmechancen im heutigen Markt. Mit bewährtem Geschäftsmodell, etablierten Einnahmequellen und erheblichem Wachstumspotenzial bieten diese Assets einen schnelleren Weg in die Selbstständigkeit.",
      fr: "Les entreprises SaaS représentent l'une des opportunités d'acquisition les plus attractives du marché actuel. Avec un modèle éprouvé, des revenus établis et un fort potentiel de croissance, ces actifs offrent un chemin plus rapide vers la propriété.",
      es: "Los negocios SaaS representan una de las oportunidades de adquisición más atractivas del mercado actual. Con modelos de negocio probados, ingresos consolidados y un gran potencial de crecimiento, estos activos ofrecen un camino más rápido hacia la propiedad.",
    },
    stats: [
      {
        value: "$13.2K",
        label_translations: {
          en: "Avg. MRR",
          de: "Ø-MRR",
          fr: "MRR moyen",
          es: "MRR prom.",
        },
        hint_translations: {
          en: "across our SaaS portfolio",
          de: "in unserem SaaS-Portfolio",
          fr: "dans notre portefeuille SaaS",
          es: "en nuestro portafolio SaaS",
        },
      },
      {
        value: "92%",
        label_translations: {
          en: "Gross Margin",
          de: "Bruttomarge",
          fr: "Marge brute",
          es: "Margen bruto",
        },
        hint_translations: {
          en: "low infrastructure costs",
          de: "niedrige Infrastrukturkosten",
          fr: "coûts d'infrastructure faibles",
          es: "costes de infraestructura bajos",
        },
      },
      {
        value: "3.2%",
        label_translations: {
          en: "Avg. Churn Rate",
          de: "Ø-Churn-Rate",
          fr: "Taux de churn moyen",
          es: "Tasa de rotación prom.",
        },
        hint_translations: {
          en: "strong retention",
          de: "starke Kundenbindung",
          fr: "forte rétention",
          es: "fuerte retención",
        },
      },
    ],
    is_visible: true,
    display_order: 20,
  },
  {
    id: "00000000-0000-4000-8000-0000000000e3",
    slug: "agency",
    emoji: "🏢",
    accent: "#10B981",
    label_translations: {
      en: "Agency",
      de: "Agentur",
      fr: "Agence",
      es: "Agencia",
    },
    description_translations: {
      en: "Buy a fully operational digital agency with existing clients, team, systems, and recurring revenue.",
      de: "Kaufen Sie eine voll funktionsfähige Digitalagentur mit bestehenden Kunden, Team, Systemen und wiederkehrendem Umsatz.",
      fr: "Achetez une agence digitale entièrement opérationnelle, avec clients, équipe, systèmes et revenus récurrents.",
      es: "Compre una agencia digital totalmente operativa con clientes, equipo, sistemas e ingresos recurrentes.",
    },
    why_title_translations: {
      en: "Why Agency?",
      de: "Warum eine Agentur?",
      fr: "Pourquoi une agence ?",
      es: "¿Por qué una agencia?",
    },
    why_description_translations: {
      en: "Agencies combine recurring client revenue with a skilled team and established systems. Acquiring one gives you an operating business with pipelines, retainers, and a track record — without the years of client-building.",
      de: "Agenturen verbinden wiederkehrenden Kundenumsatz mit einem qualifizierten Team und etablierten Systemen. Eine Übernahme verschafft Ihnen ein operatives Geschäft mit Pipeline, Retainern und einer Erfolgsbilanz — ohne jahrelangen Kundenaufbau.",
      fr: "Les agences combinent des revenus récurrents, une équipe qualifiée et des systèmes éprouvés. En acquérir une, c'est reprendre une entreprise opérationnelle avec un pipeline, des contrats de retenue et un historique — sans des années de prospection.",
      es: "Las agencias combinan ingresos recurrentes de clientes con un equipo cualificado y sistemas consolidados. Adquirir una le da un negocio en funcionamiento con pipeline, contratos de retención y trayectoria, sin años de captación de clientes.",
    },
    stats: [
      {
        value: "$22K",
        label_translations: {
          en: "Avg. Monthly Revenue",
          de: "Ø-Monatsumsatz",
          fr: "CA mensuel moyen",
          es: "Ingresos mensuales prom.",
        },
        hint_translations: {
          en: "across our agency portfolio",
          de: "in unserem Agentur-Portfolio",
          fr: "dans notre portefeuille d'agences",
          es: "en nuestro portafolio de agencias",
        },
      },
      {
        value: "8+",
        label_translations: {
          en: "Retainer Clients",
          de: "Retainer-Kunden",
          fr: "Clients en rétention",
          es: "Clientes en retención",
        },
        hint_translations: {
          en: "average active accounts",
          de: "durchschnittliche aktive Konten",
          fr: "comptes actifs moyens",
          es: "cuentas activas promedio",
        },
      },
      {
        value: "95%",
        label_translations: {
          en: "Client Retention",
          de: "Kundenbindung",
          fr: "Rétention client",
          es: "Retención de clientes",
        },
        hint_translations: {
          en: "strong relationships",
          de: "starke Beziehungen",
          fr: "relations solides",
          es: "relaciones sólidas",
        },
      },
    ],
    is_visible: true,
    display_order: 30,
  },
  {
    id: "00000000-0000-4000-8000-0000000000e4",
    slug: "ai-tools",
    emoji: "🤖",
    accent: "#3B82F6",
    label_translations: {
      en: "AI Tools",
      de: "KI-Tools",
      fr: "Outils IA",
      es: "Herramientas IA",
    },
    description_translations: {
      en: "Acquire production AI applications generating real revenue with established user bases.",
      de: "Übernehmen Sie produktive KI-Anwendungen, die echten Umsatz generieren und etablierte Nutzerbasis besitzen.",
      fr: "Acquérez des applications IA en production qui génèrent des revenus réels et disposent d'une base d'utilisateurs établie.",
      es: "Adquiera aplicaciones de IA en producción que generan ingresos reales y cuentan con bases de usuarios consolidadas.",
    },
    why_title_translations: {
      en: "Why AI Tools?",
      de: "Warum KI-Tools?",
      fr: "Pourquoi les outils IA ?",
      es: "¿Por qué herramientas IA?",
    },
    why_description_translations: {
      en: "AI tool businesses sit at the intersection of high growth and proven demand. These are production applications with paying users, working infrastructure, and a fast-moving market — prime assets for operators who can scale.",
      de: "KI-Tool-Unternehmen liegen an der Schnittstelle von hohem Wachstum und bewährter Nachfrage. Es handelt sich um produktive Anwendungen mit zahlenden Nutzern, funktionierender Infrastruktur und einem sich schnell bewegenden Markt — erstklassige Assets für skalierende Betreiber.",
      fr: "Les outils IA se situent à l'intersection de la forte croissance et d'une demande prouvée. Ce sont des applications en production avec des utilisateurs payants, une infrastructure fonctionnelle et un marché en évolution rapide — des actifs de premier choix pour des opérateurs capables de scaler.",
      es: "Las herramientas de IA se sitúan en la intersección del alto crecimiento y la demanda probada. Son aplicaciones en producción con usuarios de pago, infraestructura funcional y un mercado en rápida evolución: activos de primera para operadores que pueden escalar.",
    },
    stats: [
      {
        value: "$18.5K",
        label_translations: {
          en: "Avg. MRR",
          de: "Ø-MRR",
          fr: "MRR moyen",
          es: "MRR prom.",
        },
        hint_translations: {
          en: "across our AI portfolio",
          de: "in unserem KI-Portfolio",
          fr: "dans notre portefeuille IA",
          es: "en nuestro portafolio de IA",
        },
      },
      {
        value: "40K+",
        label_translations: {
          en: "Active Users",
          de: "Aktive Nutzer",
          fr: "Utilisateurs actifs",
          es: "Usuarios activos",
        },
        hint_translations: {
          en: "average user base",
          de: "durchschnittliche Nutzerbasis",
          fr: "base d'utilisateurs moyenne",
          es: "base de usuarios promedio",
        },
      },
      {
        value: "5×",
        label_translations: {
          en: "Growth Multiple",
          de: "Wachstums-Multiple",
          fr: "Multiple de croissance",
          es: "Múltiplo de crecimiento",
        },
        hint_translations: {
          en: "market momentum",
          de: "Marktdynamik",
          fr: "dynamique du marché",
          es: "impulso del mercado",
        },
      },
    ],
    is_visible: true,
    display_order: 40,
  },
  {
    id: "00000000-0000-4000-8000-0000000000e5",
    slug: "personal-brand",
    emoji: "🌟",
    accent: "#F59E0B",
    label_translations: {
      en: "Personal Brand",
      de: "Persönliche Marke",
      fr: "Marque personnelle",
      es: "Marca personal",
    },
    description_translations: {
      en: "Acquire established personal brands with engaged audiences and diversified revenue streams.",
      de: "Übernehmen Sie etablierte persönliche Marken mit engagierter Community und diversifizierten Einnahmequellen.",
      fr: "Acquérez des marques personnelles établies avec des audiences engagées et des sources de revenus diversifiées.",
      es: "Adquiera marcas personales consolidadas con audiencias comprometidas y fuentes de ingresos diversificadas.",
    },
    why_title_translations: {
      en: "Why Personal Brand?",
      de: "Warum eine persönliche Marke?",
      fr: "Pourquoi une marque personnelle ?",
      es: "¿Por qué una marca personal?",
    },
    why_description_translations: {
      en: "Personal brands are attention assets. With a loyal audience and multiple revenue streams — sponsorships, products, community — they compound in value and transfer cleanly to a new owner who keeps the voice.",
      de: "Persönliche Marken sind Aufmerksamkeits-Assets. Mit einer loyalen Community und mehreren Einnahmequellen — Sponsoring, Produkte, Community — steigern sie ihren Wert und gehen sauber auf einen neuen Eigentümer über, der die Stimme beibehält.",
      fr: "Les marques personnelles sont des actifs d'attention. Avec une audience fidèle et plusieurs sources de revenus — sponsoring, produits, communauté — elles gagnent de la valeur et se transfèrent proprement à un nouveau propriétaire qui conserve la voix.",
      es: "Las marcas personales son activos de atención. Con una audiencia leal y múltiples fuentes de ingresos (patrocinios, productos, comunidad), aumentan de valor y se transfieren limpiamente a un nuevo propietario que mantiene la voz.",
    },
    stats: [
      {
        value: "$14K",
        label_translations: {
          en: "Avg. Monthly Revenue",
          de: "Ø-Monatsumsatz",
          fr: "CA mensuel moyen",
          es: "Ingresos mensuales prom.",
        },
        hint_translations: {
          en: "diversified income streams",
          de: "diversifizierte Einnahmen",
          fr: "sources de revenus diversifiées",
          es: "flujos de ingresos diversificados",
        },
      },
      {
        value: "120K+",
        label_translations: {
          en: "Avg. Followers",
          de: "Ø-Follower",
          fr: "Followers moyens",
          es: "Seguidores prom.",
        },
        hint_translations: {
          en: "across platforms",
          de: "über alle Plattformen",
          fr: "toutes plateformes",
          es: "en todas las plataformas",
        },
      },
      {
        value: "60%",
        label_translations: {
          en: "Audience Retention",
          de: "Community-Bindung",
          fr: "Rétention d'audience",
          es: "Retención de audiencia",
        },
        hint_translations: {
          en: "engaged community",
          de: "engagierte Community",
          fr: "communauté engagée",
          es: "comunidad comprometida",
        },
      },
    ],
    is_visible: true,
    display_order: 50,
  },
  {
    id: "00000000-0000-4000-8000-0000000000e6",
    slug: "local-business",
    emoji: "📍",
    accent: "#F97316",
    label_translations: {
      en: "Local Business",
      de: "Lokales Unternehmen",
      fr: "Entreprise locale",
      es: "Negocio local",
    },
    description_translations: {
      en: "Own profitable local businesses with established locations, loyal customers, and strong community presence.",
      de: "Übernehmen Sie profitable lokale Unternehmen mit etablierten Standorten, treuen Kunden und starker lokaler Präsenz.",
      fr: "Possédez des entreprises locales rentables avec des emplacements établis, des clients fidèles et une forte présence communautaire.",
      es: "Sea dueño de negocios locales rentables con ubicaciones consolidadas, clientes leales y fuerte presencia comunitaria.",
    },
    why_title_translations: {
      en: "Why Local Business?",
      de: "Warum ein lokales Unternehmen?",
      fr: "Pourquoi une entreprise locale ?",
      es: "¿Por qué un negocio local?",
    },
    why_description_translations: {
      en: "Local businesses deliver predictable cash flow with a physical moat. Established locations, loyal customers, and a strong community presence make these resilient, owner-operable assets.",
      de: "Lokale Unternehmen liefern planbaren Cashflow mit einem physischen Burggraben. Etablierte Standorte, treue Kunden und starke lokale Präsenz machen sie zu widerstandsfähigen, eigentümergeführten Assets.",
      fr: "Les entreprises locales génèrent un cash-flow prévisible avec un avantage physique. Des emplacements établis, des clients fidèles et une forte présence communautaire en font des actifs résilients, opérables par leur propriétaire.",
      es: "Los negocios locales generan un flujo de caja predecible con una ventaja física. Las ubicaciones consolidadas, los clientes leales y la fuerte presencia comunitaria los convierten en activos resistentes y operables por su propietario.",
    },
    stats: [
      {
        value: "4.8★",
        label_translations: {
          en: "Avg. Rating",
          de: "Ø-Bewertung",
          fr: "Note moyenne",
          es: "Calificación prom.",
        },
        hint_translations: {
          en: "across our local portfolio",
          de: "in unserem lokalen Portfolio",
          fr: "dans notre portefeuille local",
          es: "en nuestro portafolio local",
        },
      },
      {
        value: "10+",
        label_translations: {
          en: "Years Operating",
          de: "Jahre im Betrieb",
          fr: "Années d'activité",
          es: "Años en operación",
        },
        hint_translations: {
          en: "average track record",
          de: "durchschnittliche Erfolgsbilanz",
          fr: "historique moyen",
          es: "trayectoria promedio",
        },
      },
      {
        value: "82%",
        label_translations: {
          en: "Returning Customers",
          de: "Wiederkehrende Kunden",
          fr: "Clients fidèles",
          es: "Clientes recurrentes",
        },
        hint_translations: {
          en: "repeat business",
          de: "Stammkundschaft",
          fr: "fidélité client",
          es: "negocio recurrente",
        },
      },
    ],
    is_visible: true,
    display_order: 60,
  },
  {
    id: "00000000-0000-4000-8000-0000000000e7",
    slug: "digital-products",
    emoji: "📦",
    accent: "#8B5CF6",
    label_translations: {
      en: "Digital Products",
      de: "Digitale Produkte",
      fr: "Produits numériques",
      es: "Productos digitales",
    },
    description_translations: {
      en: "Own passive-income digital product businesses with zero inventory, high margins, and global reach.",
      de: "Übernehmen Sie Digitalprodukt-Unternehmen mit passivem Einkommen, null Lagerbestand, hohen Margen und globaler Reichweite.",
      fr: "Possédez des entreprises de produits numériques à revenus passifs, sans stock, à marges élevées et à portée mondiale.",
      es: "Sea dueño de negocios de productos digitales con ingresos pasivos, inventario cero, altos márgenes y alcance global.",
    },
    why_title_translations: {
      en: "Why Digital Products?",
      de: "Warum digitale Produkte?",
      fr: "Pourquoi les produits numériques ?",
      es: "¿Por qué productos digitales?",
    },
    why_description_translations: {
      en: "Digital products are the purest form of passive income: zero inventory, near-100% margins, and a global market. Acquiring one gives you an asset that sells while you sleep.",
      de: "Digitale Produkte sind die reinste Form des passiven Einkommens: kein Lagerbestand, fast 100 % Marge und ein globaler Markt. Die Übernahme verschafft Ihnen ein Asset, das verkauft, während Sie schlafen.",
      fr: "Les produits numériques sont la forme la plus pure de revenu passif : zéro stock, marges proches de 100 % et un marché mondial. En acquérir un, c'est posséder un actif qui vend pendant que vous dormez.",
      es: "Los productos digitales son la forma más pura de ingresos pasivos: inventario cero, márgenes cercanos al 100% y un mercado global. Adquirir uno le da un activo que vende mientras duerme.",
    },
    stats: [
      {
        value: "96%",
        label_translations: {
          en: "Avg. Margin",
          de: "Ø-Marge",
          fr: "Marge moyenne",
          es: "Margen prom.",
        },
        hint_translations: {
          en: "near-zero cost of goods",
          de: "fast keine Herstellungskosten",
          fr: "coût des marchandises quasi nul",
          es: "coste de mercancías casi nulo",
        },
      },
      {
        value: "$12K",
        label_translations: {
          en: "Avg. Monthly Revenue",
          de: "Ø-Monatsumsatz",
          fr: "CA mensuel moyen",
          es: "Ingresos mensuales prom.",
        },
        hint_translations: {
          en: "across our portfolio",
          de: "in unserem Portfolio",
          fr: "dans notre portefeuille",
          es: "en nuestro portafolio",
        },
      },
      {
        value: "40+",
        label_translations: {
          en: "Countries",
          de: "Länder",
          fr: "Pays",
          es: "Países",
        },
        hint_translations: {
          en: "global customer reach",
          de: "globale Kundenreichweite",
          fr: "portée client mondiale",
          es: "alcance global de clientes",
        },
      },
    ],
    is_visible: true,
    display_order: 70,
  },
];

/** Returns the fallback catalog, or a single niche by slug (or null). */
export function getFallbackAcquisitionNiche(
  slug: string
): PublicAcquisitionNiche | null {
  return (
    FALLBACK_ACQUISITION_NICHES.find((niche) => niche.slug === slug) ?? null
  );
}
