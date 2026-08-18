// Template library queries now live in the Communication Engine.
export {
  getEmailTemplatesForAdmin,
  getEnabledEmailTemplates,
  templateLabel,
} from "@/features/communication/queries";
export type {
  EmailLogRecord,
  EmailScheduleRecord,
  AutomationTriggerRecord,
} from "@/features/communication/types";
export type { EmailTemplateRecord } from "@/features/communication/types";
