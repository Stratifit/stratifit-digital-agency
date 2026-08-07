import { describe, expect, it } from "vitest";
import {
  FALLBACK_ACQUISITION_NICHES,
  getFallbackAcquisitionNiche,
} from "./niche-fallbacks";

const LOCALES = ["en", "de", "fr", "es"] as const;

const EXPECTED_SLUGS = [
  "ecommerce",
  "saas",
  "agency",
  "ai-tools",
  "personal-brand",
  "local-business",
  "digital-products",
];

describe("FALLBACK_ACQUISITION_NICHES", () => {
  it("covers every niche slug from the seed catalog", () => {
    const slugs = FALLBACK_ACQUISITION_NICHES.map((n) => n.slug);
    for (const slug of EXPECTED_SLUGS) {
      expect(slugs, slug).toContain(slug);
    }
  });

  it("provides all four locale values for every translation field", () => {
    for (const niche of FALLBACK_ACQUISITION_NICHES) {
      for (const key of [
        "label_translations",
        "description_translations",
        "why_title_translations",
        "why_description_translations",
      ] as const) {
        for (const locale of LOCALES) {
          const value = niche[key]?.[locale];
          expect(typeof value, `${niche.slug} ${key}.${locale}`).toBe("string");
        }
      }
      for (const stat of niche.stats) {
        for (const locale of LOCALES) {
          expect(typeof stat.label_translations?.[locale], `${niche.slug} stat label.${locale}`).toBe(
            "string"
          );
          expect(typeof stat.hint_translations?.[locale], `${niche.slug} stat hint.${locale}`).toBe(
            "string"
          );
        }
      }
    }
  });

  it("always provides a non-empty English label and description", () => {
    for (const niche of FALLBACK_ACQUISITION_NICHES) {
      expect(niche.label_translations?.en.trim().length, `${niche.slug} label.en`).toBeGreaterThan(
        0
      );
      expect(
        niche.description_translations?.en.trim().length,
        `${niche.slug} description.en`
      ).toBeGreaterThan(0);
    }
  });

  it("getFallbackAcquisitionNiche resolves known slugs and rejects unknown ones", () => {
    expect(getFallbackAcquisitionNiche("saas")?.slug).toBe("saas");
    expect(getFallbackAcquisitionNiche("does-not-exist")).toBeNull();
  });
});
