import { z } from "zod";
import { DETAIL_PAGE_ICON_KEYS } from "./icons";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

const englishRequired = (message: string) =>
  translations().refine((t) => t.en.trim().length > 0, message);

const listItemSchema = z.object({
  text_translations: englishRequired("English text is required"),
});

export const detailPageBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    icon: z.enum(DETAIL_PAGE_ICON_KEYS).optional(),
    text_translations: englishRequired("English text is required"),
  }),
  z.object({
    type: z.literal("subheading"),
    divider: z.boolean().optional(),
    text_translations: englishRequired("English text is required"),
  }),
  z.object({
    type: z.literal("paragraph"),
    text_translations: englishRequired("English text is required"),
  }),
  z.object({
    type: z.literal("list"),
    items: z.array(listItemSchema),
  }),
  z.object({
    type: z.literal("panel"),
    title_translations: englishRequired("English title is required"),
    tag_translations: translations(),
    body_translations: englishRequired("English text is required"),
  }),
  z.object({
    type: z.literal("note"),
    text_translations: englishRequired("English text is required"),
  }),
]);

export const detailPageSchema = z.object({
  eyebrow_translations: translations(),
  title_translations: englishRequired("English title is required"),
  description_translations: translations(),
  subtitle_translations: translations(),
  content: z.array(detailPageBlockSchema),
  seo_title_translations: translations().optional(),
  seo_description_translations: translations().optional(),
  is_visible: z.boolean(),
});

export type DetailPageFormValues = z.infer<typeof detailPageSchema>;
export type DetailPageBlockValue = z.infer<typeof detailPageBlockSchema>;
export type DetailPageListItemValue = z.infer<typeof listItemSchema>;
