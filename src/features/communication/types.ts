/** Supported languages for all communication templates. */
export const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Multilingual JSONB content stored on a template row. */
export type Translations = Record<SupportedLanguage, string> | null;

export const TEMPLATE_TYPES = ["auto", "manual"] as const;
export type TemplateType = (typeof TEMPLATE_TYPES)[number];

export const TEMPLATE_CATEGORIES = [
  "auto_reply",
  "lifecycle",
  "follow_up",
  "billing",
  "custom",
] as const;
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export const TEMPLATE_TRIGGERS = [
  "manual",
  "on_lead",
  "on_inbound_email",
  "on_thread_resolved",
] as const;
export type TemplateTrigger = (typeof TEMPLATE_TRIGGERS)[number];

/** Granular business events that automation_triggers maps to templates. */
export const TRIGGER_EVENTS = [
  "lead_created",
  "inbound_email",
  "project_started",
  "milestone_reached",
  "project_delayed",
  "problem_detected",
  "revision_requested",
  "project_completed",
  "invoice_sent",
  "payment_received",
  "payment_failed",
  "payment_upcoming",
  "payment_overdue",
  "meeting_scheduled",
  "document_needed",
  "approval_needed",
  "inactive_client",
  "file_uploaded",
  "form_submitted",
] as const;
export type TriggerEvent = (typeof TRIGGER_EVENTS)[number];

export const EMAIL_LOG_STATUSES = [
  "queued",
  "sent",
  "failed",
  "delivered",
  "bounced",
  "complained",
] as const;
export type EmailLogStatus = (typeof EMAIL_LOG_STATUSES)[number];

export const SCHEDULE_STATUSES = [
  "pending",
  "sent",
  "failed",
  "cancelled",
] as const;
export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];

/** A full email_templates row as exposed to the admin UI. */
export interface EmailTemplateRecord {
  id: string;
  key: string;
  template_type: TemplateType;
  category: TemplateCategory;
  name_translations: Translations;
  subject_translations: Translations;
  body_translations: Translations;
  description: string | null;
  trigger_event: TemplateTrigger | null;
  is_enabled: boolean;
  display_order: number;
}

/**
 * The parts of a template needed to render an email. Translation objects are
 * keyed by language code (en/de/fr/es) — on-the-fly templates (admin replies,
 * inline auto-replies) may supply only `en`, and `pickTranslation` falls back
 * to English for missing keys.
 */
export interface RenderableTemplate {
  subject_translations: Record<string, string> | null;
  body_translations: Record<string, string> | null;
}

/** An email_logs row. */
export interface EmailLogRecord {
  id: string;
  template_key: string | null;
  recipient_email: string;
  sender_email: string;
  subject: string | null;
  language: SupportedLanguage;
  status: EmailLogStatus;
  error_message: string | null;
  created_at: string;
  sent_at: string | null;
}

/** An email_schedules row. */
export interface EmailScheduleRecord {
  id: string;
  template_key: string;
  recipient_email: string;
  recipient_name: string | null;
  language: SupportedLanguage;
  send_at: string;
  status: ScheduleStatus;
  data: Record<string, string>;
  error_message: string | null;
  created_at: string;
}

/** An automation_triggers row. */
export interface AutomationTriggerRecord {
  id: string;
  event_type: TriggerEvent;
  template_key: string | null;
  enabled: boolean;
  display_order: number;
}
