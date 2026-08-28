import { describe, it, expect } from "vitest";
import { cookieSettingsSchema } from "@/features/cookie-settings/schemas";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

const tr = (en: string) => ({ en, de: "", fr: "", es: "" });

const valid = {
  banner_enabled: true,
  policy_url: "/cookie-policy",
  banner_title_translations: tr("Cookie Preferences"),
  banner_text_translations: tr("We use cookies to enhance your experience."),
  accept_all_label_translations: tr("Accept All"),
  essential_only_label_translations: tr("Essential Only"),
  settings_label_translations: tr("Settings"),
  save_preferences_label_translations: tr("Save Preferences"),
  categories: [
    {
      key: "essential",
      essential: true,
      enabled: true,
      name_translations: tr("Essential cookies"),
      description_translations: tr("Required."),
    },
    {
      key: "analytics",
      essential: false,
      enabled: true,
      name_translations: tr("Analytics cookies"),
      description_translations: tr("Anonymous usage data."),
    },
    {
      key: "marketing",
      essential: false,
      enabled: false,
      name_translations: tr("Marketing cookies"),
      description_translations: tr("Ads."),
    },
  ],
};

describe("cookieSettingsSchema", () => {
  it("accepts valid settings", () => {
    expect(cookieSettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("supports every public cookie locale and falls back to English", () => {
    const translations = { en: "Cookie preferences", de: "Cookie-Einstellungen", fr: "Préférences de cookies", es: "Preferencias de cookies" };
    expect(resolveTranslation(translations, "en")).toBe("Cookie preferences");
    expect(resolveTranslation(translations, "de")).toBe("Cookie-Einstellungen");
    expect(resolveTranslation(translations, "fr")).toBe("Préférences de cookies");
    expect(resolveTranslation(translations, "es")).toBe("Preferencias de cookies");
    expect(resolveTranslation({ en: "Cookie preferences", de: "" }, "de")).toBe("Cookie preferences");
  });

  it("rejects a missing English title", () => {
    const result = cookieSettingsSchema.safeParse({
      ...valid,
      banner_title_translations: tr(""),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing policy URL", () => {
    const result = cookieSettingsSchema.safeParse({
      ...valid,
      policy_url: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty category list", () => {
    const result = cookieSettingsSchema.safeParse({
      ...valid,
      categories: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a category without a key", () => {
    const result = cookieSettingsSchema.safeParse({
      ...valid,
      categories: [{ essential: false, enabled: true }],
    });
    expect(result.success).toBe(false);
  });

  it("defaults category essential/enabled when omitted", () => {
    const result = cookieSettingsSchema.safeParse({
      ...valid,
      categories: [
        {
          key: "analytics",
          name_translations: tr("Analytics"),
          description_translations: tr("Data"),
        },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.categories[0].essential).toBe(false);
      expect(result.data.categories[0].enabled).toBe(true);
    }
  });
});
