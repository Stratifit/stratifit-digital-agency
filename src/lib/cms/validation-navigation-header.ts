// ============================================================================
// Stratifit — Navigation Header Zod Validation
// ============================================================================

import { z } from "zod";
import { SERVICE_ICON_IDS } from "@/components/ui/icons";

const languageSchema = z.enum(["en", "fr", "de", "es"]);

const navLinkSchema = z.object({
  id: z.string().min(1, "Link id is required"),
  label: z.string().min(1, "Link label is required"),
  href: z.string().min(1, "Link href is required"),
});

const languageOptionSchema = z.object({
  id: languageSchema,
  flag: z.string().min(1, "Flag is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
});

const serviceSchema = z.object({
  id: z.string().min(1, "Service id is required"),
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Service description is required"),
  href: z.string().min(1, "Service href is required"),
  iconId: z.enum(SERVICE_ICON_IDS, { message: "Service icon id must be a known icon" }),
});

const footerLinkSchema = z.object({
  id: z.string().min(1, "Footer link id is required"),
  label: z.string().min(1, "Footer link label is required"),
  href: z.string().min(1, "Footer link href is required"),
});

const quickActionSchema = z.object({
  id: z.string().min(1, "Quick action id is required"),
  label: z.string().min(1, "Quick action label is required"),
});

const chatLanguageSchema = z.object({
  flag: z.string().min(1, "Flag is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
});

const chatSchema = z.object({
  title: z.string().min(1, "Chat title is required"),
  subtitle: z.string().min(1, "Chat subtitle is required"),
  welcomeMessage: z.string().min(1, "Welcome message is required"),
  inputPlaceholder: z.string().min(1, "Input placeholder is required"),
  userMessage: z.string().min(1, "User message is required"),
  quickActions: z.array(quickActionSchema).min(1, "At least one quick action is required"),
});

export const navigationHeaderContentSchema = z.object({
  logo: z.string().min(1, "Logo text is required"),
  links: z.array(navLinkSchema).min(1, "At least one link is required"),
  cta: navLinkSchema,
  languages: z.array(languageOptionSchema).min(1, "At least one language is required"),
  services: z.array(serviceSchema).min(1, "At least one service is required"),
  footerLinks: z.array(footerLinkSchema).min(1, "At least one footer link is required"),
  chat: chatSchema,
  chatLanguages: z.array(chatLanguageSchema).min(1, "At least one chat language is required"),
  desktopChatPill: z.string().min(1, "Desktop chat pill text is required"),
  builtBy: z.string().min(1, "Built by text is required"),
  copyright: z.string().min(1, "Copyright text is required"),
});

export type NavigationHeaderContentInput = z.infer<typeof navigationHeaderContentSchema>;

/** Flat dot-notation translation dictionary per language */
export const navigationHeaderTranslationsSchema = z.record(
  languageSchema,
  z.record(z.string(), z.string())
);

export type NavigationHeaderTranslationsInput = z.infer<typeof navigationHeaderTranslationsSchema>;

export const navigationHeaderSchema = z.object({
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  sticky: z.boolean().default(false),
  content: navigationHeaderContentSchema,
  translations: navigationHeaderTranslationsSchema,
  url: z.string().default(""),
});

export type NavigationHeaderInput = z.infer<typeof navigationHeaderSchema>;
