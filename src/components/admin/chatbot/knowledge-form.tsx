"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  knowledgeEntrySchema,
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_SOURCE_TYPES,
  SUPPORTED_LOCALES,
  type KnowledgeEntryFormValues,
} from "@/features/chat/chat-admin-schemas";
import {
  createKnowledgeEntry,
  updateKnowledgeEntry,
} from "@/features/chat/chat-admin-actions";
import type { AdminKnowledgeEntry } from "@/features/chat/chat-admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  services: "Services",
  pricing: "Pricing",
  process: "Process",
  support: "Support",
  about: "About",
};

const SOURCE_LABELS: Record<string, string> = {
  manual: "Manual (written in this form)",
  service: "Service",
  faq: "FAQ",
  portfolio: "Portfolio",
  page: "Page",
  policy: "Policy",
};

function toFormValues(entry: AdminKnowledgeEntry): KnowledgeEntryFormValues {
  const title = entry.title_translations ?? {};
  const content = entry.content_translations ?? {};
  return {
    slug: entry.slug,
    title_translations: {
      en: title.en ?? "",
      de: title.de ?? "",
      fr: title.fr ?? "",
      es: title.es ?? "",
    },
    content_translations: {
      en: content.en ?? "",
      de: content.de ?? "",
      fr: content.fr ?? "",
      es: content.es ?? "",
    },
    category: (entry.category as KnowledgeEntryFormValues["category"]) ?? "general",
    source_type:
      (entry.source_type as KnowledgeEntryFormValues["source_type"]) ?? "manual",
    priority: entry.priority,
    is_enabled: entry.is_enabled,
    is_ai_eligible: entry.is_ai_eligible,
  };
}

export function KnowledgeForm({
  entry,
}: {
  entry?: AdminKnowledgeEntry | null;
}) {
  const isEdit = Boolean(entry);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<KnowledgeEntryFormValues>({
    resolver: zodResolver(knowledgeEntrySchema),
    defaultValues: entry
      ? toFormValues(entry)
      : {
          slug: "",
          title_translations: { en: "", de: "", fr: "", es: "" },
          content_translations: { en: "", de: "", fr: "", es: "" },
          category: "general",
          source_type: "manual",
          priority: 0,
          is_enabled: true,
          is_ai_eligible: true,
        },
  });

  const isEnabled = useWatch({ control, name: "is_enabled" });
  const isAiEligible = useWatch({ control, name: "is_ai_eligible" });

  async function onSubmit(values: KnowledgeEntryFormValues) {
    setServerError(null);
    setSaved(false);
    const result = isEdit && entry
      ? await updateKnowledgeEntry(entry.id, values)
      : await createKnowledgeEntry(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            placeholder="delivery-timeline"
            {...register("slug")}
            aria-invalid={errors.slug ? true : undefined}
          />
          {errors.slug ? (
            <p className="mt-1 text-xs text-error">{errors.slug.message}</p>
          ) : null}
          <p className="text-xs text-text-muted">
            Unique identifier. The AI references knowledge by this value.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            type="number"
            min={0}
            max={1000}
            placeholder="0"
            {...register("priority", { valueAsNumber: true })}
            aria-invalid={errors.priority ? true : undefined}
          />
          {errors.priority ? (
            <p className="mt-1 text-xs text-error">{errors.priority.message}</p>
          ) : null}
          <p className="text-xs text-text-muted">
            Higher values are ranked first by the chatbot.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" {...register("category")}>
            {KNOWLEDGE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] ?? c}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="source_type">Source type</Label>
          <Select id="source_type" {...register("source_type")}>
            {KNOWLEDGE_SOURCE_TYPES.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s] ?? s}
              </option>
            ))}
          </Select>
          <p className="text-xs text-text-muted">
            Informational — describes where this content originated.
          </p>
        </div>
      </div>

      {/* Toggles */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-text-primary">Enabled</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Disabled entries are ignored everywhere.
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => setValue("is_enabled", checked)}
            aria-label="Knowledge entry enabled"
          />
        </div>
        <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Available to the AI
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              Let the chatbot answer from this entry.
            </p>
          </div>
          <Switch
            checked={isAiEligible}
            onCheckedChange={(checked) => setValue("is_ai_eligible", checked)}
            aria-label="Knowledge entry available to the AI"
          />
        </div>
      </div>

      {/* Locale fieldsets */}
      <div className="space-y-6">
        {SUPPORTED_LOCALES.map((locale) => (
          <fieldset
            key={locale}
            className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm"
          >
            <legend className="px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              {LOCALE_NAMES[locale]}
            </legend>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${locale}`}>Title</Label>
                <Input
                  id={`title-${locale}`}
                  placeholder="How long does delivery take?"
                  {...register(`title_translations.${locale}`)}
                />
                {locale === "en" && errors.title_translations?.en?.message ? (
                  <p className="mt-1 text-xs text-error">
                    {errors.title_translations.en.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`content-${locale}`}>Content</Label>
                <Textarea
                  id={`content-${locale}`}
                  rows={5}
                  placeholder="The factual answer the AI should give…"
                  {...register(`content_translations.${locale}`)}
                />
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p role="status" className="rounded-card bg-success-soft px-3 py-2 text-sm text-success">
          Saved successfully.
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : isEdit
              ? "Save Knowledge Entry"
              : "Create Knowledge Entry"}
        </Button>
      </div>
    </form>
  );
}
