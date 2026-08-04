import { describe, it, expect } from "vitest";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

describe("resolveTranslation", () => {
  it("returns the requested locale when present", () => {
    const translations = { en: "Services", de: "Leistungen", fr: "Services", es: "Servicios" };
    expect(resolveTranslation(translations, "de")).toBe("Leistungen");
  });

  it("falls back to English when the locale is missing", () => {
    const translations = { en: "Services" };
    expect(resolveTranslation(translations, "fr")).toBe("Services");
  });

  it("falls back to English when the locale value is empty", () => {
    const translations = { en: "Services", de: "" };
    expect(resolveTranslation(translations, "de")).toBe("Services");
  });

  it("returns empty string for null or non-object input", () => {
    expect(resolveTranslation(null, "en")).toBe("");
    expect(resolveTranslation(undefined, "en")).toBe("");
  });

  it("returns empty string when no usable value exists", () => {
    expect(resolveTranslation({}, "en")).toBe("");
  });
});
