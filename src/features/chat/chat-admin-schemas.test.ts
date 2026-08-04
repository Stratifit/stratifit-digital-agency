import { describe, it, expect } from "vitest";
import {
  knowledgeEntrySchema,
  chatbotSettingsSchema,
  aiFaqSettingsSchema,
} from "@/features/chat/chat-admin-schemas";

describe("knowledgeEntrySchema", () => {
  const valid = {
    slug: "delivery-timeline",
    title_translations: { en: "Delivery timeline", de: "", fr: "", es: "" },
    content_translations: { en: "Delivery takes 5-7 days.", de: "", fr: "", es: "" },
    category: "general",
    source_type: "manual",
    priority: 0,
    is_enabled: true,
    is_ai_eligible: true,
  };

  it("accepts a valid entry", () => {
    expect(knowledgeEntrySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid slugs", () => {
    const badSlugs = ["UPPER", "has space", "under_score", "-leading", "trailing-"];
    for (const slug of badSlugs) {
      expect(knowledgeEntrySchema.safeParse({ ...valid, slug }).success).toBe(false);
    }
  });

  it("rejects an unknown category", () => {
    const result = knowledgeEntrySchema.safeParse({ ...valid, category: "finance" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative priority", () => {
    const result = knowledgeEntrySchema.safeParse({ ...valid, priority: -5 });
    expect(result.success).toBe(false);
  });
});

describe("chatbotSettingsSchema", () => {
  const valid = {
    is_enabled: true,
    response_style: "friendly",
    lead_capture_mode: "after_resolution",
    human_support_enabled: true,
    allowed_categories: ["general", "services"],
    welcome_message_translations: { en: "Hi!", de: "", fr: "", es: "" },
    offline_message_translations: { en: "", de: "", fr: "", es: "" },
    escalation_message_translations: { en: "", de: "", fr: "", es: "" },
    fallback_message_translations: { en: "", de: "", fr: "", es: "" },
  };

  it("accepts valid settings", () => {
    expect(chatbotSettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid response style", () => {
    const result = chatbotSettingsSchema.safeParse({ ...valid, response_style: "angry" });
    expect(result.success).toBe(false);
  });
});

describe("aiFaqSettingsSchema", () => {
  it("accepts valid settings with suggested questions", () => {
    const result = aiFaqSettingsSchema.safeParse({
      is_enabled: true,
      intro_translations: { en: "Ask me anything", de: "", fr: "", es: "" },
      fallback_translations: { en: "", de: "", fr: "", es: "" },
      cta_label_translations: { en: "Contact", de: "", fr: "", es: "" },
      cta_url: "/contact",
      suggested_questions: ["What do you build?", "How much does it cost?"],
      allowed_categories: ["general"],
    });
    expect(result.success).toBe(true);
  });
});
