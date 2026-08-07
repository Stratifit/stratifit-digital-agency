import { describe, expect, it } from "vitest";
import {
  PRIVACY_FALLBACK_BLOCKS,
  TERMS_FALLBACK_BLOCKS,
  COOKIE_FALLBACK_BLOCKS,
  IMPRINT_FALLBACK_BLOCKS,
  CAREERS_FALLBACK_BLOCKS,
  HIRING_FALLBACK_BLOCKS,
} from "./detail-page-fallbacks";

const REGISTRIES = {
  privacy: PRIVACY_FALLBACK_BLOCKS,
  terms: TERMS_FALLBACK_BLOCKS,
  cookie: COOKIE_FALLBACK_BLOCKS,
  imprint: IMPRINT_FALLBACK_BLOCKS,
  careers: CAREERS_FALLBACK_BLOCKS,
  hiring: HIRING_FALLBACK_BLOCKS,
};

const LOCALES = ["en", "de", "fr", "es"] as const;

function translationValues(
  block: Record<string, unknown>
): Record<string, string>[] {
  const values: Record<string, string>[] = [];
  for (const [key, value] of Object.entries(block)) {
    if (key.endsWith("_translations") && value && typeof value === "object") {
      values.push(value as Record<string, string>);
    }
  }
  // List items carry nested text_translations that must also be complete.
  if (Array.isArray(block.items)) {
    for (const item of block.items as Record<string, unknown>[]) {
      values.push(...translationValues(item));
    }
  }
  return values;
}

describe("detail-page fallback content", () => {
  for (const [name, blocks] of Object.entries(REGISTRIES)) {
    it(`${name} has heading blocks with icons and complete 4-language content`, () => {
      expect(blocks.length).toBeGreaterThan(0);

      const heading = blocks.find((block) => block.type === "heading");
      expect(heading).toBeDefined();
      expect(heading?.icon).toBeTruthy();

      for (const block of blocks) {
        for (const translations of translationValues(
          block as unknown as Record<string, unknown>
        )) {
          for (const locale of LOCALES) {
            const text = translations[locale] ?? "";
            expect(text.trim().length).toBeGreaterThan(0);
          }
        }
      }
    });
  }

  it("every registry ships an English title within a heading block", () => {
    for (const [name, blocks] of Object.entries(REGISTRIES)) {
      const heading = blocks.find((block) => block.type === "heading");
      const enTitle = heading?.text_translations?.en?.trim() ?? "";
      expect(enTitle.length, `${name} missing English heading`).toBeGreaterThan(
        0
      );
    }
  });
});
