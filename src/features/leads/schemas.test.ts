import { describe, it, expect } from "vitest";
import { leadSchema } from "@/features/leads/schemas";

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    const result = leadSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like to discuss a website project.",
      source: "contact_form",
      preferred_locale: "en",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = leadSchema.safeParse({
      email: "jane@example.com",
      message: "I would like to discuss a website project.",
      source: "contact_form",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "I would like to discuss a website project.",
      source: "contact_form",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a short message", () => {
    const result = leadSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "hi",
      source: "contact_form",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-contact_form source", () => {
    const result = leadSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like to discuss a website project.",
      source: "other",
    });
    expect(result.success).toBe(false);
  });

  it("defaults preferred_locale to en", () => {
    const result = leadSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like to discuss a website project.",
      source: "contact_form",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferred_locale).toBe("en");
    }
  });

  it("accepts form values without source (never registered) and defaults it", () => {
    // The public contact form never registers a `source` field, so
    // react-hook-form's zodResolver receives values without it. If `source`
    // were required, the submit would be rejected silently and the lead would
    // never reach the database. Regression test for that bug.
    const result = leadSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "",
      company: "",
      requested_service_ids: [],
      budget_range: "",
      honeypot: "",
      message: "I would like to discuss a website project.",
      preferred_locale: "en",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("contact_form");
    }
  });
});
