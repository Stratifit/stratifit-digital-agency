import { z } from "zod";

const translationsSchema = z
  .record(z.string(), z.string())
  .refine((obj) => typeof obj?.en === "string", {
    message: "English translation is required",
  });

export const serviceSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens"),
  title_translations: translationsSchema,
  short_description_translations: translationsSchema,
  icon_name: z.string(),
  cta_label_translations: translationsSchema,
  cta_url: z.string(),
  cta_style: z.enum(["full", "compact"]),
  display_order: z.number().int().min(0),
  is_featured: z.boolean(),
  is_visible: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export function emptyServiceForm(): ServiceFormValues {
  return {
    slug: "",
    title_translations: { en: "" },
    short_description_translations: { en: "" },
    icon_name: "",
    cta_label_translations: { en: "" },
    cta_url: "",
    cta_style: "full",
    display_order: 0,
    is_featured: false,
    is_visible: true,
    status: "draft",
  };
}
