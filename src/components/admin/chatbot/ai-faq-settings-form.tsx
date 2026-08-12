"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  aiFaqSettingsSchema,
  FAQ_CATEGORIES,
  SUPPORTED_LOCALES,
  type AiFaqSettingsFormValues,
} from "@/features/chat/chat-admin-schemas";
import { updateAiFaqSettings } from "@/features/chat/chat-admin-actions";
import type { AdminAiFaqSettings } from "@/features/chat/chat-admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";

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
};

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

function toFormValues(settings: AdminAiFaqSettings): AiFaqSettingsFormValues {
  return {
    is_enabled: settings.is_enabled,
    intro_translations: tr(settings.intro_translations),
    fallback_translations: tr(settings.fallback_translations),
    cta_label_translations: tr(settings.cta_label_translations),
    cta_url: settings.cta_url ?? "",
    suggested_questions: settings.suggested_questions?.length
      ? settings.suggested_questions
      : [""],
    allowed_categories: settings.allowed_categories?.length
      ? settings.allowed_categories
      : ["general"],
  };
}

function CategoryToggle({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "rounded-button border px-3.5 py-2 text-xs font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        checked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-text-secondary hover:border-card-border-hover hover:text-text-primary"
      )}
    >
      {label}
    </button>
  );
}

export function AiFaqSettingsForm({
  settings,
}: {
  settings: AdminAiFaqSettings;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<AiFaqSettingsFormValues>({
    resolver: zodResolver(aiFaqSettingsSchema),
    defaultValues: toFormValues(settings),
  });

  const isEnabled = useWatch({ control, name: "is_enabled" });
  const allowedCategories = useWatch({ control, name: "allowed_categories" });
  const suggestedQuestions = useWatch({ control, name: "suggested_questions" });

  function toggleCategory(category: string) {
    const current = getValues("allowed_categories");
    const next = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue("allowed_categories", next.length ? next : ["general"]);
  }

  function updateQuestion(index: number, value: string) {
    const next = [...getValues("suggested_questions")];
    next[index] = value;
    setValue("suggested_questions", next);
  }

  function addQuestion() {
    setValue("suggested_questions", [...getValues("suggested_questions"), ""]);
  }

  function removeQuestion(index: number) {
    const next = getValues("suggested_questions").filter(
      (_q, i) => i !== index
    );
    setValue("suggested_questions", next.length ? next : [""]);
  }

  async function onSubmit(values: AiFaqSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateAiFaqSettings({
      ...values,
      suggested_questions: values.suggested_questions.filter((q) =>
        q.trim()
      ),
    });
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Enable */}
      <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
        <div>
          <p className="text-sm font-medium text-text-primary">AI FAQ enabled</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Turn the AI FAQ assistant panel on or off.
          </p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => setValue("is_enabled", checked)}
          aria-label="AI FAQ enabled"
        />
      </div>

      {/* Suggested questions */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <Label className="mb-1 block">Suggested questions</Label>
        <p className="mb-3 text-xs text-text-muted">
          Quick-start chips shown to visitors before they type.
        </p>
        <div className="space-y-2.5">
          {suggestedQuestions.map((_q, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={suggestedQuestions[index] ?? ""}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
                aria-label={`Suggested question ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                aria-label={`Remove question ${index + 1}`}
                className="rounded-button border border-border px-3 py-2 text-xs text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-error/40 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addQuestion}
          className="mt-3 rounded-button border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add question
        </button>
      </div>

      {/* Allowed categories */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <Label className="mb-1 block">Categories the FAQ may answer from</Label>
        <p className="mb-3 text-xs text-text-muted">
          Restrict the FAQ assistant to these knowledge categories.
        </p>
        <div className="flex flex-wrap gap-2">
          {FAQ_CATEGORIES.map((category) => (
            <CategoryToggle
              key={category}
              label={CATEGORY_LABELS[category] ?? category}
              checked={allowedCategories.includes(category)}
              onToggle={() => toggleCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cta_url">CTA URL</Label>
          <Input id="cta_url" placeholder="/contact" {...register("cta_url")} />
          <p className="text-xs text-text-muted">
            Where the FAQ card&apos;s button points.
          </p>
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
                <Label htmlFor={`intro-${locale}`}>Intro text</Label>
                <Textarea
                  id={`intro-${locale}`}
                  rows={2}
                  placeholder="Quick answers, powered by our AI…"
                  {...register(`intro_translations.${locale}`)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`fallback-${locale}`}>Fallback message</Label>
                  <Textarea
                    id={`fallback-${locale}`}
                    rows={2}
                    placeholder="I couldn't find an answer…"
                    {...register(`fallback_translations.${locale}`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cta-${locale}`}>CTA label</Label>
                  <Input
                    id={`cta-${locale}`}
                    placeholder="Contact our team"
                    {...register(`cta_label_translations.${locale}`)}
                  />
                </div>
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
          {isSubmitting ? "Saving…" : "Save AI FAQ Settings"}
        </Button>
      </div>
    </form>
  );
}
