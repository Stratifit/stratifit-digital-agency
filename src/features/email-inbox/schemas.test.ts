import { describe, it, expect } from "vitest";
import {
  inboundWebhookSchema,
  receivedEmailSchema,
  emailReplySchema,
  emailSectionSchema,
} from "./schemas";

const tr = (en: string) => ({ en, de: "", fr: "", es: "" });

const validSection = {
  slug: "support",
  name_translations: tr("Support"),
  enabled: true,
  routing_addresses: ["support@stratifit.com"],
  form_source_key: null,
  from_address: "hello@stratifit.com",
  auto_reply_enabled: false,
  auto_reply_subject_translations: tr("Thank you for contacting Stratifit"),
  auto_reply_body_translations: tr("We typically reply within 24 hours."),
  auto_reply_template_id: null,
  resolved_template_id: null,
  resolved_email_enabled: false,
  display_order: 6,
};

const TEMPLATE_ID = "11111111-1111-4111-8111-111111111111";

describe("inboundWebhookSchema", () => {
  it("accepts an email.received payload with an email_id", () => {
    const result = inboundWebhookSchema.safeParse({
      type: "email.received",
      data: {
        email_id: "email-123",
        message_id: "<abc@example.com>",
        from: "Jane <jane@example.com>",
        to: ["hello@stratifit.com"],
        subject: "Website enquiry",
        received_for: ["hello@stratifit.com"],
        created_at: "2026-08-18T10:00:00Z",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data?.email_id).toBe("email-123");
    }
  });

  it("accepts a payload without data (non-email events)", () => {
    expect(inboundWebhookSchema.safeParse({ type: "email.sent" }).success).toBe(true);
  });
});

describe("receivedEmailSchema", () => {
  it("accepts a full received email with headers and attachments", () => {
    const result = receivedEmailSchema.safeParse({
      id: "email-123",
      message_id: "<abc@example.com>",
      from: "Jane <jane@example.com>",
      to: ["hello@stratifit.com"],
      received_for: ["hello@stratifit.com"],
      subject: "Re: Website enquiry",
      text: "Thanks!",
      html: "<p>Thanks!</p>",
      created_at: "2026-08-18T10:00:00Z",
      headers: {
        "in-reply-to": "<reply-target@example.com>",
        references: "<reply-target@example.com> <older@example.com>",
      },
      attachments: [
        { filename: "brief.pdf", content_type: "application/pdf", size: 1200 },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.headers?.["in-reply-to"]).toBe("<reply-target@example.com>");
      expect(result.data.attachments).toHaveLength(1);
    }
  });

  it("defaults subject and attachments when absent", () => {
    const result = receivedEmailSchema.safeParse({
      id: "email-123",
      from: "jane@example.com",
      to: ["hello@stratifit.com"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.subject).toBe("");
      expect(result.data.attachments).toEqual([]);
    }
  });
});

describe("emailReplySchema", () => {
  it("accepts a valid reply", () => {
    expect(
      emailReplySchema.safeParse({
        thread_id: "11111111-1111-4111-8111-111111111111",
        body: "Thanks for reaching out — we will get back to you shortly.",
      }).success
    ).toBe(true);
  });

  it("rejects an empty body", () => {
    const result = emailReplySchema.safeParse({
      thread_id: "11111111-1111-4111-8111-111111111111",
      body: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-uuid thread id", () => {
    const result = emailReplySchema.safeParse({
      thread_id: "not-a-uuid",
      body: "Hello",
    });
    expect(result.success).toBe(false);
  });
});

describe("emailSectionSchema", () => {
  it("accepts a valid section", () => {
    expect(emailSectionSchema.safeParse(validSection).success).toBe(true);
  });

  it("rejects an invalid slug", () => {
    const result = emailSectionSchema.safeParse({
      ...validSection,
      slug: "Support Section!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a section without an English name", () => {
    const result = emailSectionSchema.safeParse({
      ...validSection,
      name_translations: tr(""),
    });
    expect(result.success).toBe(false);
  });

  it("normalizes an empty form_source_key to null", () => {
    const result = emailSectionSchema.safeParse({
      ...validSection,
      form_source_key: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.form_source_key).toBeNull();
    }
  });

  it("accepts linked auto-reply and resolved templates", () => {
    const result = emailSectionSchema.safeParse({
      ...validSection,
      auto_reply_template_id: TEMPLATE_ID,
      resolved_template_id: TEMPLATE_ID,
      resolved_email_enabled: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.auto_reply_template_id).toBe(TEMPLATE_ID);
      expect(result.data.resolved_template_id).toBe(TEMPLATE_ID);
    }
  });
});
