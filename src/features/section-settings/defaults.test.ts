import { describe, it, expect } from "vitest";
import {
  isEditableSectionKey,
  SECTION_KEY_META,
  DEFAULT_TECH_STACK,
  getDefaultAdminSectionSetting,
} from "@/features/section-settings/defaults";

describe("isEditableSectionKey", () => {
  it("accepts every editable section key", () => {
    for (const key of Object.keys(SECTION_KEY_META)) {
      expect(isEditableSectionKey(key)).toBe(true);
    }
  });

  it("rejects unknown and non-editable keys", () => {
    expect(isEditableSectionKey("nope")).toBe(false);
    expect(isEditableSectionKey("hero")).toBe(false);
    expect(isEditableSectionKey("acquisition-niches")).toBe(false);
  });
});

describe("getDefaultAdminSectionSetting", () => {
  it("returns null for unknown keys", () => {
    expect(getDefaultAdminSectionSetting("nope")).toBeNull();
  });

  it("pre-fills the tech-stack defaults with the marquee items", () => {
    const settings = getDefaultAdminSectionSetting("tech-stack");
    expect(settings).not.toBeNull();
    const s = settings!;
    expect(s.label).toBe("Tech Stack");
    expect(s.is_visible).toBe(true);
    expect(s.tech_stack).toEqual(DEFAULT_TECH_STACK);
    expect(s.title_translations?.en).toBe("Our");
  });

  it("defaults Similar Case Studies to paused", () => {
    const settings = getDefaultAdminSectionSetting("related-case-studies");
    expect(settings).not.toBeNull();
    expect(settings?.label).toBe("Similar Case Studies");
    expect(settings?.is_visible).toBe(false);
  });

  it("pre-fills canonical header content for other sections", () => {
    const settings = getDefaultAdminSectionSetting("services");
    expect(settings).not.toBeNull();
    const s = settings!;
    expect(s.label).toBe("Services");
    expect(s.title_translations?.en).toBe("Our Core");
    expect(s.tech_stack).toBeUndefined();
  });

  it("covers every editable key with metadata and a fallback", () => {
    for (const key of Object.keys(SECTION_KEY_META)) {
      const settings = getDefaultAdminSectionSetting(key);
      expect(settings).not.toBeNull();
      expect(settings?.section_key).toBe(key);
    }
  });
});
