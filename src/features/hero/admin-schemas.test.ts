import { describe, it, expect } from "vitest";
import { heroSchema } from "@/features/hero/admin-schemas";

const tr = (en: string) => ({ en, de: "", fr: "", es: "" });

const valid = {
  eyebrow_translations: tr("Premium Digital Agency"),
  title_translations: tr("We Build Websites"),
  highlight_translations: tr("That Grow Businesses."),
  description_translations: tr("We help startups and growing businesses."),
  primary_cta_label_translations: tr("Start Your Project"),
  primary_cta_url: "/contact",
  secondary_cta_label_translations: tr("View Our Work"),
  secondary_cta_url: "/work",
  metrics: [
    {
      value: "59+",
      label_translations: tr("Projects Delivered"),
    },
  ],
  trusted_by: [
    { name: "LUMEN", icon: "lumen" },
    { name: "NOVUS", icon: "novus" },
  ],
  is_visible: true,
};

describe("heroSchema", () => {
  it("accepts a valid hero", () => {
    expect(heroSchema.safeParse(valid).success).toBe(true);
  });

  it("requires an English title", () => {
    const result = heroSchema.safeParse({ ...valid, title_translations: tr("") });
    expect(result.success).toBe(false);
  });

  it("rejects a metric without a value", () => {
    const result = heroSchema.safeParse({
      ...valid,
      metrics: [{ value: "", label_translations: tr("Label") }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty trusted-by strip", () => {
    const result = heroSchema.safeParse({ ...valid, trusted_by: [] });
    expect(result.success).toBe(true);
  });

  it("rejects a trusted-by logo without a name", () => {
    const result = heroSchema.safeParse({
      ...valid,
      trusted_by: [{ name: "", icon: "lumen" }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a trusted-by logo with an uploaded image", () => {
    const result = heroSchema.safeParse({
      ...valid,
      trusted_by: [
        {
          name: "ACME",
          icon: "",
          media_id: "11111111-1111-1111-1111-111111111111",
          image_url: "https://xyz.supabase.co/storage/v1/object/public/logos/acme.png",
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
