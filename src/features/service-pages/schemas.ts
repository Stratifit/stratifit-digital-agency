import { z } from "zod";

export const translationMapSchema = z
  .record(z.string(), z.string())
  .default({});

const statSchema = z.object({
  value: z.string(),
  label_translations: translationMapSchema,
  description_translations: translationMapSchema.nullable().optional(),
});

const badgeSchema = z.object({
  value: z.string(),
  label_translations: translationMapSchema,
  hint_translations: translationMapSchema.nullable().optional(),
  description_translations: translationMapSchema.nullable().optional(),
});

const stepSchema = z.object({
  label_translations: translationMapSchema,
  icon: z.string().nullable().optional(),
});

const capabilitySchema = z.object({
  title_translations: translationMapSchema,
  description_translations: translationMapSchema,
  steps: z.array(stepSchema).nullable().optional(),
});

const deliverableSchema = z.object({
  title_translations: translationMapSchema,
  description_translations: translationMapSchema,
  icon: z.string().nullable().optional(),
});

const processStepSchema = z.object({
  number: z.number().int(),
  title_translations: translationMapSchema,
  description_translations: translationMapSchema,
  icon: z.string().nullable().optional(),
});

export const servicePageSchema = z.object({
  is_visible: z.boolean().default(true),
  hero_eyebrow_translations: translationMapSchema,
  hero_title_translations: translationMapSchema,
  hero_highlight_translations: translationMapSchema,
  hero_description_translations: translationMapSchema,
  hero_stats: z.array(statSchema).default([]),
  why_title_translations: translationMapSchema,
  why_description_translations: translationMapSchema,
  why_badges: z.array(badgeSchema).default([]),
  capabilities_title_translations: translationMapSchema,
  capabilities_description_translations: translationMapSchema,
  capabilities: z.array(capabilitySchema).default([]),
  deliverables_title_translations: translationMapSchema,
  deliverables: z.array(deliverableSchema).default([]),
  process_title_translations: translationMapSchema,
  process: z.array(processStepSchema).default([]),
  toolkit_title_translations: translationMapSchema,
  toolkit: z.array(z.string()).default([]),
  cta_title_translations: translationMapSchema,
  cta_subtitle_translations: translationMapSchema,
  cta_button_label_translations: translationMapSchema,
});

export type ServicePageFormValues = z.infer<typeof servicePageSchema>;
