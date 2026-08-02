export const EMAIL_TEMPLATE_KEYS = [
  "contact_acknowledgement",
  "lead_notification",
  "acquisition_notification",
  "chat_escalation",
  "admin_invitation",
] as const;

export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number];

export const EMAIL_EVENT_STATUSES = [
  "queued",
  "sent",
  "delivered",
  "failed",
  "bounced",
  "complained",
] as const;

export type EmailEventStatus = (typeof EMAIL_EVENT_STATUSES)[number];
