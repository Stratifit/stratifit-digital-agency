import { describe, expect, it } from "vitest";
import {
  FALLBACK_FOOTER_GROUPS,
  mergeFooterGroups,
} from "./fallbacks";
import type { PublicFooterGroup } from "./queries";

const LOCALES = ["en", "de", "fr", "es"] as const;

describe("FALLBACK_FOOTER_GROUPS", () => {
  it("covers Platform, Company, and Legal with the canonical links", () => {
    const titles = FALLBACK_FOOTER_GROUPS.map((g) => g.title_translations?.en);
    expect(titles).toEqual(["Platform", "Company", "Legal"]);

    const company = FALLBACK_FOOTER_GROUPS[1];
    expect(company.links.map((l) => l.href)).toContain("/hiring");

    const legal = FALLBACK_FOOTER_GROUPS[2];
    expect(legal.links.map((l) => l.href)).toContain("/imprint");
  });

  it("provides all four locale values for every group and link", () => {
    for (const group of FALLBACK_FOOTER_GROUPS) {
      for (const locale of LOCALES) {
        expect(typeof group.title_translations?.[locale]).toBe("string");
      }
      for (const link of group.links) {
        for (const locale of LOCALES) {
          expect(typeof link.label_translations?.[locale]).toBe("string");
        }
      }
    }
  });
});

describe("mergeFooterGroups", () => {
  it("returns the canonical footer when the DB has no groups", () => {
    expect(mergeFooterGroups([])).toEqual(FALLBACK_FOOTER_GROUPS);
  });

  it("appends missing canonical links (Hiring, Imprint) to DB groups", () => {
    const dbGroups: PublicFooterGroup[] = [
      {
        id: "20000000-0000-4000-8000-000000000002",
        title_translations: { en: "Company", de: "Unternehmen", fr: "Entreprise", es: "Empresa" },
        display_order: 2,
        links: [
          {
            id: "custom-about",
            label_translations: { en: "About", de: "Über uns", fr: "À propos", es: "Nosotros" },
            href: "/about",
            is_external: false,
            display_order: 1,
          },
        ],
      },
      {
        id: "20000000-0000-4000-8000-000000000003",
        title_translations: { en: "Legal", de: "Rechtliches", fr: "Mentions légales", es: "Legal" },
        display_order: 3,
        links: [],
      },
    ];

    const merged = mergeFooterGroups(dbGroups);

    const company = merged.find((g) => g.id.endsWith("002"))!;
    expect(company.links.map((l) => l.href)).toContain("/hiring");

    const legal = merged.find((g) => g.id.endsWith("003"))!;
    expect(legal.links.map((l) => l.href)).toContain("/imprint");
  });

  it("keeps DB links and only appends canonical links missing by href", () => {
    const dbGroups: PublicFooterGroup[] = [
      {
        id: "20000000-0000-4000-8000-000000000002",
        title_translations: { en: "Company", de: "Unternehmen", fr: "Entreprise", es: "Empresa" },
        display_order: 2,
        links: [
          {
            id: "custom-hiring",
            label_translations: { en: "Hiring", de: "Karriere bei uns", fr: "Recrutement", es: "Contratación" },
            href: "/hiring",
            is_external: false,
            display_order: 5,
          },
        ],
      },
    ];

    const merged = mergeFooterGroups(dbGroups);
    // The DB link is kept as-is; the 4 remaining canonical Company links
    // (About, Careers, Contact, Pricing) are appended without duplication,
    // and everything is re-sorted by display_order.
    expect(merged[0].links).toHaveLength(5);
    expect(new Set(merged[0].links.map((l) => l.href)).size).toBe(5);
    expect(merged[0].links[0].href).toBe("/about");
    expect(merged[0].links[4].href).toBe("/hiring");
  });
});
