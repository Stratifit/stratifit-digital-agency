import { z } from "zod";
import { PROCESS_ICON_OPTIONS } from "@/components/ui/process-icon";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const processStepSchema = z.object({
  step_key: z
    .string()
    .min(1, "Key is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  number: z.number().int().min(1, "Step number is required"),
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  description_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English description is required"
  ),
  icon_name: z
    .string()
    .refine(
      (v) => PROCESS_ICON_OPTIONS.some((o) => o.value === v),
      "Choose an icon"
    ),
  display_order: z.number().int().min(0),
  is_visible: z.boolean(),
});

export type ProcessStepFormValues = z.infer<typeof processStepSchema>;
