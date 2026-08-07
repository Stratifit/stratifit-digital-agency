import { describe, it, expect } from "vitest";
import { detailPageSchema } from "@/features/detail-pages/schemas";

const translations = (value = "Text") => ({
  en: value,
  de: value,
  fr: value,
  es: value,
});

const valid = {
  title_translations: translations("Privacy Policy"),
  subtitle_translations: translations("Last updated: August 2026"),
  content: [
    { type: "heading", text_translations: translations("1. Data we collect") },
    { type: "paragraph", text_translations: translations("We collect data.") },
    { type: "note", text_translations: translations("Note: review before launch.") },
  ],
  is_visible: true,
};

describe("detailPageSchema", () => {
  it("accepts valid detail pages", () => {
    expect(detailPageSchema.safeParse(valid).success).toBe(true);
  });

  it("requires an English title", () => {
    const result = detailPageSchema.safeParse({
      ...valid,
      title_translations: { en: "", de: "", fr: "", es: "" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects partial translation objects", () => {
    const result = detailPageSchema.safeParse({
      ...valid,
      subtitle_translations: { en: "Last updated" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown block types", () => {
    const result = detailPageSchema.safeParse({
      ...valid,
      content: [{ type: "quote", text_translations: translations() }],
    });
    expect(result.success).toBe(false);
  });

  it("requires English text on every block", () => {
    const result = detailPageSchema.safeParse({
      ...valid,
      content: [{ type: "paragraph", text_translations: { en: "", de: "", fr: "", es: "" } }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty block list", () => {
    const result = detailPageSchema.safeParse({ ...valid, content: [] });
    expect(result.success).toBe(true);
  });

  it("accepts is_visible false", () => {
    const result = detailPageSchema.safeParse({ ...valid, is_visible: false });
    expect(result.success).toBe(true);
  });
});
