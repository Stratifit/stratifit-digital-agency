import type { PublicFooterGroup } from "@/features/footer/queries";

/**
 * Canonical footer structure used as a render fallback and as the source of
 * truth for which links must always be present. Content mirrors the seed in
 * supabase/seed.sql + migration 00047 in all 4 languages.
 *
 * Database content wins for anything it already provides; the merge helper
 * below only appends links that are missing from the DB (e.g. Hiring under
 * Company and Imprint under Legal before migration 00047 is applied), so the
 * footer never silently drops a canonical link.
 */
export const FALLBACK_FOOTER_GROUPS: PublicFooterGroup[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    title_translations: {
      en: "Platform",
      de: "Plattform",
      fr: "Plateforme",
      es: "Plataforma",
    },
    display_order: 1,
    links: [
      {
        id: "30000000-0000-4000-8000-000000000001",
        label_translations: { en: "Home", de: "Startseite", fr: "Accueil", es: "Inicio" },
        href: "/",
        is_external: false,
        display_order: 1,
      },
      {
        id: "30000000-0000-4000-8000-000000000002",
        label_translations: {
          en: "Services",
          de: "Leistungen",
          fr: "Services",
          es: "Servicios",
        },
        href: "/services",
        is_external: false,
        display_order: 2,
      },
      {
        id: "30000000-0000-4000-8000-000000000003",
        label_translations: {
          en: "Work",
          de: "Arbeiten",
          fr: "Réalisations",
          es: "Proyectos",
        },
        href: "/work",
        is_external: false,
        display_order: 3,
      },
      {
        id: "30000000-0000-4000-8000-000000000004",
        label_translations: {
          en: "Insights",
          de: "Einblicke",
          fr: "Insights",
          es: "Perspectivas",
        },
        href: "/insights",
        is_external: false,
        display_order: 4,
      },
      {
        id: "30000000-0000-4000-8000-000000000011",
        label_translations: {
          en: "Buy a Business",
          de: "Unternehmen kaufen",
          fr: "Acheter une entreprise",
          es: "Comprar un negocio",
        },
        href: "/buy-business",
        is_external: false,
        display_order: 5,
      },
    ],
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    title_translations: {
      en: "Company",
      de: "Unternehmen",
      fr: "Entreprise",
      es: "Empresa",
    },
    display_order: 2,
    links: [
      {
        id: "30000000-0000-4000-8000-000000000005",
        label_translations: { en: "About", de: "Über uns", fr: "À propos", es: "Nosotros" },
        href: "/about",
        is_external: false,
        display_order: 1,
      },
      {
        id: "30000000-0000-4000-8000-000000000006",
        label_translations: {
          en: "Careers",
          de: "Karriere",
          fr: "Carrières",
          es: "Carreras",
        },
        href: "/careers",
        is_external: false,
        display_order: 2,
      },
      {
        id: "30000000-0000-4000-8000-000000000007",
        label_translations: {
          en: "Contact",
          de: "Kontakt",
          fr: "Contact",
          es: "Contacto",
        },
        href: "/contact",
        is_external: false,
        display_order: 3,
      },
      {
        id: "30000000-0000-4000-8000-000000000012",
        label_translations: {
          en: "Pricing",
          de: "Preise",
          fr: "Tarifs",
          es: "Precios",
        },
        href: "/#pricing",
        is_external: false,
        display_order: 4,
      },
      {
        id: "30000000-0000-4000-8000-000000000014",
        label_translations: {
          en: "Hiring",
          de: "Karriere bei uns",
          fr: "Recrutement",
          es: "Contratación",
        },
        href: "/hiring",
        is_external: false,
        display_order: 5,
      },
    ],
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    title_translations: {
      en: "Legal",
      de: "Rechtliches",
      fr: "Mentions légales",
      es: "Legal",
    },
    display_order: 3,
    links: [
      {
        id: "30000000-0000-4000-8000-000000000008",
        label_translations: {
          en: "Privacy Policy",
          de: "Datenschutzerklärung",
          fr: "Politique de confidentialité",
          es: "Política de privacidad",
        },
        href: "/privacy",
        is_external: false,
        display_order: 1,
      },
      {
        id: "30000000-0000-4000-8000-000000000009",
        label_translations: {
          en: "Terms of Service",
          de: "Nutzungsbedingungen",
          fr: "Conditions d'utilisation",
          es: "Términos del servicio",
        },
        href: "/terms-conditions",
        is_external: false,
        display_order: 2,
      },
      {
        id: "30000000-0000-4000-8000-000000000010",
        label_translations: {
          en: "Cookie Policy",
          de: "Cookie-Richtlinie",
          fr: "Politique de cookies",
          es: "Política de cookies",
        },
        href: "/cookie-policy",
        is_external: false,
        display_order: 3,
      },
      {
        id: "30000000-0000-4000-8000-000000000013",
        label_translations: {
          en: "Imprint",
          de: "Impressum",
          fr: "Mentions légales",
          es: "Aviso legal",
        },
        href: "/imprint",
        is_external: false,
        display_order: 4,
      },
    ],
  },
];

/**
 * Merges the canonical footer links into the DB-provided groups:
 *  - If the DB returns no groups at all, the full canonical footer is used.
 *  - For each group, any canonical link missing from the DB (matched by href)
 *    is appended, preserving canonical ordering. DB-provided links are kept
 *    untouched, so CMS edits always win.
 */
export function mergeFooterGroups(
  dbGroups: PublicFooterGroup[]
): PublicFooterGroup[] {
  if (dbGroups.length === 0) {
    return FALLBACK_FOOTER_GROUPS;
  }

  return dbGroups.map((group) => {
    const canonical = FALLBACK_FOOTER_GROUPS.find(
      (c) => c.id === group.id
    );
    if (!canonical) {
      return group;
    }

    const existingHrefs = new Set(group.links.map((link) => link.href));
    const missing = canonical.links.filter(
      (link) => !existingHrefs.has(link.href)
    );

    if (missing.length === 0) {
      return group;
    }

    return {
      ...group,
      links: [...group.links, ...missing].sort(
        (a, b) => a.display_order - b.display_order
      ),
    };
  });
}
