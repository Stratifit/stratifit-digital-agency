import { describe, it, expect } from "vitest";
import { announcementSchema } from "@/features/announcement/schemas";

const tr = (en: string) => ({ en, de: "", fr: "", es: "" });

const valid = {
  slides: [tr("We are now offering AI automation."), tr("Book a strategy call today.")],
  link_label_translations: tr("Learn More"),
  link_url: "/acquisition",
  is_enabled: true,
  starts_at: "",
  ends_at: "",
  variant: "primary",
};

describe("announcementSchema", () => {
  it("accepts a valid announcement with multiple slides", () => {
    expect(announcementSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a single slide", () => {
    expect(
      announcementSchema.safeParse({ ...valid, slides: [tr("Only one message.")] }).success
    ).toBe(true);
  });

  it("rejects an announcement with no slides", () => {
    const result = announcementSchema.safeParse({ ...valid, slides: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a slide without an English message", () => {
    const result = announcementSchema.safeParse({
      ...valid,
      slides: [{ en: "", de: "Nur Deutsch", fr: "", es: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown variant", () => {
    const result = announcementSchema.safeParse({ ...valid, variant: "fancy" });
    expect(result.success).toBe(false);
  });
});
