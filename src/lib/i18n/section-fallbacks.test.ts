import { describe, expect, it } from "vitest";
import {
  SECTION_HEADER_FALLBACKS,
  type SectionHeaderFallback,
} from "./section-fallbacks";

const LOCALES = ["en", "de", "fr", "es"] as const;

function eachField(
  entry: SectionHeaderFallback,
  fn: (value: string) => void
) {
  for (const key of ["eyebrow", "title", "highlight", "description"] as const) {
    for (const locale of LOCALES) {
      fn(entry[key][locale]);
    }
  }
}

describe("SECTION_HEADER_FALLBACKS", () => {
  it("covers every homepage section key", () => {
    for (const key of [
      "services",
      "process",
      "why-choose-us",
      "insights",
      "portfolio",
      "acquisition",
      "testimonials",
      "pricing",
      "faq",
      "contact",
    ]) {
      expect(SECTION_HEADER_FALLBACKS[key], key).toBeDefined();
    }
  });

  it("provides all four locale values for every field", () => {
    for (const [sectionKey, entry] of Object.entries(SECTION_HEADER_FALLBACKS)) {
      eachField(entry, (value) => {
        expect(typeof value, `${sectionKey}: ${value}`).toBe("string");
      });
    }
  });

  it("always provides a non-empty English title and description", () => {
    for (const [sectionKey, entry] of Object.entries(SECTION_HEADER_FALLBACKS)) {
      expect(entry.title.en.trim().length, `${sectionKey} title.en`).toBeGreaterThan(0);
      expect(entry.description.en.trim().length, `${sectionKey} description.en`).toBeGreaterThan(0);
    }
  });
});
