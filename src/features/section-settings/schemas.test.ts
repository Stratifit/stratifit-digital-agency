import { describe, it, expect } from "vitest";
import { sectionSettingsSchema } from "@/features/section-settings/schemas";

const valid = {
  eyebrow_translations: { en: "Services", de: "Leistungen", fr: "Services", es: "Servicios" },
  title_translations: { en: "Our Core", de: "Unsere Kernleistungen", fr: "Nos Services", es: "Nuestros" },
  highlight_translations: { en: "Services", de: "", fr: "", es: "" },
  description_translations: { en: "Description", de: "", fr: "", es: "" },
  is_visible: true,
};

describe("sectionSettingsSchema", () => {
  it("accepts valid settings", () => {
    expect(sectionSettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("requires an English title", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      title_translations: { en: "", de: "", fr: "", es: "" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects partial translation objects", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      eyebrow_translations: { en: "Services" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts is_visible false", () => {
    const result = sectionSettingsSchema.safeParse({ ...valid, is_visible: false });
    expect(result.success).toBe(true);
  });
});
