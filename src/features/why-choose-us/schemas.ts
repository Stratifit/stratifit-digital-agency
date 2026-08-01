import { z } from "zod";
import { WHY_CHOOSE_US_ICON_OPTIONS } from "@/components/ui/why-choose-us-icon";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const whyChooseUsItemSchema = z.object({
  icon: z
    .string()
    .refine(
      (v) => WHY_CHOOSE_US_ICON_OPTIONS.some((o) => o.value === v),
      "Choose an icon"
    ),
  title: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  description: translations().refine(
    (t) => t.en.trim().length > 0,
    "English description is required"
  ),
  stat_value: z.string().min(1, "Stat value is required"),
  stat_label: translations().refine(
    (t) => t.en.trim().length > 0,
    "English stat label is required"
  ),
});

export const whyChooseUsItemsSchema = z
  .array(whyChooseUsItemSchema)
  .min(1, "Add at least one feature");

export const whyChooseUsSchema = z.object({
  items: whyChooseUsItemsSchema,
});

export type WhyChooseUsItemFormValues = z.infer<typeof whyChooseUsItemSchema>;
