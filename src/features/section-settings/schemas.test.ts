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

  it("accepts optional CTA fields", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      cta_label_translations: { en: "Schedule a Consultation", de: "", fr: "", es: "" },
      cta_url: "/contact",
    });
    expect(result.success).toBe(true);
    expect(result.data?.cta_url).toBe("/contact");
  });

  it("rejects a partial CTA label translation object", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      cta_label_translations: { en: "Schedule a Consultation" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts a full review summary", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      review_summary: {
        rating: "4.9",
        verifiedReviews: 47,
        googleRating: "4.9",
        googleReviews: 18,
        googleReviewsUrl: "https://www.google.com/maps",
      },
    });
    expect(result.success).toBe(true);
    expect(result.data?.review_summary?.verifiedReviews).toBe(47);
  });

  it("rejects a review summary with missing rating", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      review_summary: {
        rating: "",
        verifiedReviews: 47,
        googleRating: "4.9",
        googleReviews: 18,
        googleReviewsUrl: "",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric review counts", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      review_summary: {
        rating: "4.8",
        verifiedReviews: "47",
        googleRating: "4.8",
        googleReviews: 18,
        googleReviewsUrl: "",
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts portfolio card images (optional field)", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      cards: [
        {
          slug: "vertex-saas-landing",
          client_name: "Vertex",
          images: [
            { media_id: "", image_url: "https://example.com/a.jpg" },
            { media_id: "abc", image_url: "" },
            { media_id: "", image_url: "" },
          ],
        },
      ],
    });
    expect(result.success).toBe(true);
    expect(result.data?.cards?.[0]?.slug).toBe("vertex-saas-landing");
  });

  it("rejects cards without a slug", () => {
    const result = sectionSettingsSchema.safeParse({
      ...valid,
      cards: [{ images: [{ image_url: "https://example.com/a.jpg" }] }],
    });
    expect(result.success).toBe(false);
  });
});
