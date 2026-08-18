// Template library schema + constants now live in the Communication Engine.
export { TEMPLATE_CATEGORIES, TEMPLATE_TRIGGERS } from "@/features/communication/types";
export type {
  TemplateCategory,
  TemplateTrigger,
} from "@/features/communication/types";
export { emailTemplateSchema } from "@/features/communication/schemas";
export type { EmailTemplateInput } from "@/features/communication/schemas";
