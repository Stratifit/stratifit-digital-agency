import { describe, it, expect } from "vitest";
import { detailPageSchema } from "@/features/detail-pages/schemas";

const translations = (value = "Text") => ({
  en: value,
  de: value,
  fr: value,
  es: value,
});

const valid = {
  eyebrow_translations: translations("Legal"),
  title_translations: translations("Privacy Policy"),
  description_translations: translations("How we use your data."),
  subtitle_translations: translations("Last updated: August 2026"),
  content: [
    {
      type: "heading",
      icon: "shield-check",
      text_translations: translations("1. Data we collect"),
    },
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

  it("accepts list and panel blocks", () => {
    const result = detailPageSchema.safeParse({
      ...valid,
      content: [
        {
          type: "list",
          items: [{ text_translations: translations("Item one") }],
        },
        {
          type: "panel",
          title_translations: translations("Essential cookies"),
          tag_translations: translations("Always active"),
          body_translations: translations("Required for the site."),
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid icon keys", () => {
    const result = detailPageSchema.safeParse({
      ...valid,
      content: [
        {
          type: "heading",
          icon: "hacker-man",
          text_translations: translations("Heading"),
        },
      ],
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
