import { z } from "zod";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

const englishRequired = (message: string) =>
  translations().refine((t) => t.en.trim().length > 0, message);

export const detailPageBlockSchema = z.object({
  type: z.enum(["heading", "paragraph", "note"]),
  text_translations: englishRequired("English text is required"),
});

export const detailPageSchema = z.object({
  title_translations: englishRequired("English title is required"),
  subtitle_translations: translations(),
  content: z.array(detailPageBlockSchema),
  is_visible: z.boolean(),
});

export type DetailPageFormValues = z.infer<typeof detailPageSchema>;
