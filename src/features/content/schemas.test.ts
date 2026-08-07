import { describe, it, expect } from "vitest";
import {
  portfolioSchema,
  insightSchema,
  testimonialSchema,
  pricingSchema,
  faqSchema,
} from "./schemas";

const fullTranslations = {
  en: "English content",
  de: "Deutscher Inhalt",
  fr: "Contenu français",
  es: "Contenido español",
};

describe("portfolioSchema", () => {
  it("accepts all four locales", () => {
    const result = portfolioSchema.safeParse({
      slug: "maison-lumiere-brand-system",
      client_name: "Maison Lumière",
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "https://example.com/cover.jpg",
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing English title", () => {
    const result = portfolioSchema.safeParse({
      slug: "maison-lumiere-brand-system",
      client_name: "Maison Lumière",
      title_translations: { en: "", de: "Titel", fr: "", es: "" },
      summary_translations: fullTranslations,
      image_url: "",
      status: "draft",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title_translations).toBeDefined();
    }
  });

  it("rejects invalid slug", () => {
    const result = portfolioSchema.safeParse({
      slug: "Bad Slug!",
      client_name: "Client",
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "",
      status: "draft",
    });
    expect(result.success).toBe(false);
  });
});

describe("insightSchema", () => {
  it("accepts all four locales", () => {
    const result = insightSchema.safeParse({
      slug: "ai-automation-guide",
      title_translations: fullTranslations,
      excerpt_translations: fullTranslations,
      reading_time_minutes: 5,
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing English excerpt", () => {
    const result = insightSchema.safeParse({
      slug: "ai-automation-guide",
      title_translations: fullTranslations,
      excerpt_translations: { en: "", de: "", fr: "", es: "" },
      reading_time_minutes: 5,
      status: "draft",
    });
    expect(result.success).toBe(false);
  });
});

describe("testimonialSchema", () => {
  it("accepts all four locales", () => {
    const result = testimonialSchema.safeParse({
      person_name: "Claire Fontaine",
      quote_translations: fullTranslations,
      company_name: "Maison Lumière",
      is_visible: true,
      is_verified: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing English quote", () => {
    const result = testimonialSchema.safeParse({
      person_name: "Claire Fontaine",
      quote_translations: { en: "", de: "", fr: "", es: "" },
      company_name: null,
      is_visible: true,
      is_verified: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("pricingSchema", () => {
  it("accepts all four locales", () => {
    const result = pricingSchema.safeParse({
      slug: "growth",
      name_translations: fullTranslations,
      price_label_translations: fullTranslations,
      display_order: 2,
      is_visible: true,
      is_featured: false,
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing English name", () => {
    const result = pricingSchema.safeParse({
      slug: "growth",
      name_translations: { en: "", de: "", fr: "", es: "" },
      price_label_translations: fullTranslations,
      display_order: 2,
      is_visible: true,
      is_featured: false,
      status: "draft",
    });
    expect(result.success).toBe(false);
  });
});

describe("faqSchema", () => {
  it("accepts all four locales", () => {
    const result = faqSchema.safeParse({
      question_translations: fullTranslations,
      answer_translations: fullTranslations,
      category: "general",
      display_order: 1,
      is_visible: true,
      is_ai_eligible: true,
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing English answer", () => {
    const result = faqSchema.safeParse({
      question_translations: fullTranslations,
      answer_translations: { en: "", de: "", fr: "", es: "" },
      category: "general",
      display_order: 1,
      is_visible: true,
      is_ai_eligible: false,
      status: "draft",
    });
    expect(result.success).toBe(false);
  });
});
