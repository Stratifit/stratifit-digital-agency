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
  tech_stack: [{ name: "Next.js", icon: "▲" }],
  tech_stack_heading_translations: tr("Built with modern tools"),
  tech_stack_description_translations: tr("The stack behind our work"),
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

  it("rejects a tech stack chip without a name", () => {
    const result = heroSchema.safeParse({
      ...valid,
      tech_stack: [{ name: "", icon: "▲" }],
    });
    expect(result.success).toBe(false);
  });
});
