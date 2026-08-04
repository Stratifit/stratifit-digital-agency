import { z } from "zod";

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

// The public bar renders the slides carousel (see src/components/layout/announcement-bar.tsx),
// falling back to message_translations only when no slides exist. The editor therefore
// manages slides; message_translations is kept in sync with the first slide on save.
const slideSchema = translations().refine(
  (t) => t.en.trim().length > 0,
  "English message is required"
);

export const announcementSchema = z.object({
  slides: z.array(slideSchema).min(1, "Add at least one announcement message"),
  link_label_translations: translations(),
  link_url: z.string(),
  is_enabled: z.boolean(),
  starts_at: z.string(),
  ends_at: z.string(),
  variant: z.enum(["primary", "neutral", "ai"]),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
