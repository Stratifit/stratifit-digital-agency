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

  it("accepts a service slug and gallery images", () => {
    const result = portfolioSchema.safeParse({
      slug: "aura-cosmetics-identity",
      client_name: "Aura Cosmetics",
      service_slug: "brand-design",
      gallery: [
        { media_id: "11111111-1111-4111-8111-111111111111", image_url: "https://example.com/1.jpg" },
        { image_url: "https://example.com/2.jpg" },
        { image_url: "https://example.com/3.jpg" },
        { image_url: "https://example.com/4.jpg" },
        { image_url: "https://example.com/5.jpg" },
        { image_url: "https://example.com/6.jpg" },
      ],
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "https://example.com/cover.jpg",
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("rejects more than six gallery images", () => {
    const result = portfolioSchema.safeParse({
      slug: "aura-cosmetics-identity",
      client_name: "Aura Cosmetics",
      gallery: Array.from({ length: 7 }, (_, i) => ({
        image_url: `https://example.com/${i}.jpg`,
      })),
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "",
      status: "draft",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a project without a category or gallery", () => {
    const result = portfolioSchema.safeParse({
      slug: "vertex-saas-landing",
      client_name: "Vertex SaaS",
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "",
      status: "draft",
    });
    expect(result.success).toBe(true);
  });

  it("accepts full case study details", () => {
    const result = portfolioSchema.safeParse({
      slug: "vertex-saas-landing",
      client_name: "Vertex SaaS",
      deliverables_translations: {
        en: ["Conversion Design", "A/B Testing"],
        de: ["Conversion-Design", "A/B-Tests"],
        fr: ["Design de conversion", "Tests A/B"],
        es: ["Diseño de conversión", "Pruebas A/B"],
      },
      brand_story_translations: fullTranslations,
      challenge_translations: fullTranslations,
      solution_translations: fullTranslations,
      results_translations: fullTranslations,
      metrics: [
        {
          value: "12%",
          label_translations: fullTranslations,
        },
        {
          value: "12x",
          label_translations: fullTranslations,
        },
      ],
      year: "2026",
      testimonial_id: "40000000-0000-4000-8000-000000000001",
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "https://example.com/cover.jpg",
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid year", () => {
    const result = portfolioSchema.safeParse({
      slug: "vertex-saas-landing",
      client_name: "Vertex SaaS",
      year: "last year",
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "",
      status: "draft",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.year).toBeDefined();
    }
  });

  it("accepts an empty year", () => {
    const result = portfolioSchema.safeParse({
      slug: "vertex-saas-landing",
      client_name: "Vertex SaaS",
      year: "",
      title_translations: fullTranslations,
      summary_translations: fullTranslations,
      image_url: "",
      status: "draft",
    });
    expect(result.success).toBe(true);
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

  it("accepts a person role translation", () => {
    const result = testimonialSchema.safeParse({
      person_name: "Claire Fontaine",
      quote_translations: fullTranslations,
      person_role_translations: fullTranslations,
      company_name: "Maison Lumière",
      is_visible: true,
      is_verified: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("pricingSchema", () => {
  it("accepts all four locales", () => {
    const result = pricingSchema.safeParse({
      slug: "growth",
      name_translations: fullTranslations,
      description_translations: fullTranslations,
      price_label_translations: fullTranslations,
      display_order: 2,
      is_visible: true,
      is_featured: false,
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a plan without a description", () => {
    const result = pricingSchema.safeParse({
      slug: "growth",
      name_translations: fullTranslations,
      price_label_translations: fullTranslations,
      display_order: 2,
      is_visible: true,
      is_featured: false,
      status: "draft",
    });
    expect(result.success).toBe(true);
  });

  it("accepts billing, features, and CTA fields", () => {
    const result = pricingSchema.safeParse({
      slug: "growth",
      name_translations: fullTranslations,
      price_label_translations: fullTranslations,
      billing_label_translations: fullTranslations,
      features_translations: {
        en: ["Identity & Logo", "5-Page Site"],
        de: ["Identität & Logo", "5-Seiten Website"],
        fr: ["Identité & logo", "Site de 5 pages"],
        es: ["Identidad y logo", "Sitio de 5 páginas"],
      },
      cta_label_translations: fullTranslations,
      cta_url: "/contact",
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
