import { z } from "zod";
import type { EmailTemplateKey } from "./types";

const contactAcknowledgmentDataSchema = z.object({
  name: z.string().min(1),
  locale: z.string().default("en"),
});

const leadNotificationDataSchema = z.object({
  lead_id: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  requested_service: z.string().optional().nullable(),
  budget_range: z.string().optional().nullable(),
  business_interest: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  locale: z.string().default("en"),
});

const chatEscalationDataSchema = z.object({
  conversation_id: z.string(),
  visitor_label: z.string().optional().default("Anonymous visitor"),
  locale: z.string().default("en"),
});

const adminInvitationDataSchema = z.object({
  email: z.string().email(),
  invite_url: z.string().url(),
  locale: z.string().default("en"),
});

// Auto-reply sent from the email inbox when a section has
// auto_reply_enabled. Subject/body come from the section's CMS-editable
// translations; this template only renders them inside the branded shell.
const emailInboxAutoReplyDataSchema = z.object({
  customer_name: z.string().optional().nullable(),
  section_name: z.string().optional().default("Stratifit"),
  subject: z.string().min(1),
  body: z.string().min(1),
});

// Free-form admin reply sent from the email inbox. The body is written by
// the admin and rendered as plain paragraphs inside the branded shell.
const emailInboxReplyDataSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

export const emailTemplateDataSchemas = {
  contact_acknowledgement: contactAcknowledgmentDataSchema,
  lead_notification: leadNotificationDataSchema,
  chat_escalation: chatEscalationDataSchema,
  admin_invitation: adminInvitationDataSchema,
  email_inbox_auto_reply: emailInboxAutoReplyDataSchema,
  email_inbox_reply: emailInboxReplyDataSchema,
} as const;

export type EmailTemplateData<TKey extends EmailTemplateKey> = z.input<
  (typeof emailTemplateDataSchemas)[TKey]
>;

export type EmailTemplateDataMap = {
  [TKey in EmailTemplateKey]: z.infer<
    (typeof emailTemplateDataSchemas)[TKey]
  >;
};

export function buildEmailSubject<TKey extends EmailTemplateKey>(
  templateKey: TKey,
  data: EmailTemplateDataMap[TKey]
): string {
  switch (templateKey) {
    case "contact_acknowledgement":
      return `Thank you for contacting Stratifit, ${
        (data as EmailTemplateDataMap["contact_acknowledgement"]).name
      }`;
    case "lead_notification":
      return `New lead: ${
        (data as EmailTemplateDataMap["lead_notification"]).name ?? "Anonymous"
      } (${(data as EmailTemplateDataMap["lead_notification"]).company ?? "no company"})`;
    case "chat_escalation":
      return `Chat escalation: ${
        (data as EmailTemplateDataMap["chat_escalation"]).visitor_label
      }`;
    case "admin_invitation":
      return "You have been invited to the Stratifit CMS";
    case "email_inbox_auto_reply":
      return (
        (data as EmailTemplateDataMap["email_inbox_auto_reply"]).subject
      );
    case "email_inbox_reply":
      return (data as EmailTemplateDataMap["email_inbox_reply"]).subject;
  }
}
