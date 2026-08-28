"use client";

import * as React from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  faqBotSettingsSchema,
  FAQ_CATEGORIES,
  SUPPORTED_LOCALES,
  type FaqBotSettingsFormValues,
} from "@/features/chat/chat-admin-schemas";
import { updateFaqBotSettings } from "@/features/chat/chat-admin-actions";
import type { AdminFaqBotSettings } from "@/features/chat/chat-admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { LocaleTabs, type EditorLocale } from "@/components/admin/locale-tabs";

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

function toFormValues(settings: AdminFaqBotSettings): FaqBotSettingsFormValues {
  return {
    faq_bot_enabled: settings.faq_bot_enabled,
    welcome_message_translations: tr(settings.welcome_message_translations),
    faq_bot_fallback_translations: tr(settings.faq_bot_fallback_translations),
    suggested_question_translations: settings.suggested_question_translations?.length
      ? settings.suggested_question_translations.map(tr)
      : [{ en: "", de: "", fr: "", es: "" }],
    faq_bot_allowed_categories: settings.faq_bot_allowed_categories?.length
      ? settings.faq_bot_allowed_categories
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

export function FaqBotSettingsForm({
  settings,
}: {
  settings: AdminFaqBotSettings;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [locale, setLocale] = React.useState<EditorLocale>("en");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<FaqBotSettingsFormValues>({
    resolver: zodResolver(faqBotSettingsSchema),
    defaultValues: toFormValues(settings),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "suggested_question_translations",
  });

  const isEnabled = useWatch({ control, name: "faq_bot_enabled" });
  const allowedCategories = useWatch({ control, name: "faq_bot_allowed_categories" });

  function toggleCategory(category: string) {
    const current = getValues("faq_bot_allowed_categories");
    const next = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue("faq_bot_allowed_categories", next.length ? next : ["general"]);
  }

  async function onSubmit(values: FaqBotSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateFaqBotSettings(values);
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
          <p className="text-sm font-medium text-text-primary">FAQ bot enabled</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Turn the FAQ section bot (Ask More Questions) on or off.
          </p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => setValue("faq_bot_enabled", checked)}
          aria-label="FAQ bot enabled"
        />
      </div>

      {/* Suggested questions (multilingual) */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <Label className="mb-1 block">Default questions</Label>
        <p className="mb-3 text-xs text-text-muted">
          Question chips shown to visitors when the FAQ bot opens. Fill each language; rows
          without English text are dropped on save.
        </p>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-card border border-card-border bg-background/60 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
                  Question {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove question ${index + 1}`}
                  className="rounded-button border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-error/40 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SUPPORTED_LOCALES.map((code) => (
                  <div key={code} className="space-y-1">
                    <Label
                      htmlFor={`suggested-${index}-${code}`}
                      className="text-[10px] font-semibold uppercase tracking-wide text-text-muted"
                    >
                      {LOCALE_NAMES[code]}
                    </Label>
                    <Input
                      id={`suggested-${index}-${code}`}
                      placeholder={`Question ${index + 1} (${code})`}
                      {...register(`suggested_question_translations.${index}.${code}` as const)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ en: "", de: "", fr: "", es: "" })}
          className="mt-3 rounded-button border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add question
        </button>
      </div>

      {/* Allowed categories */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <Label className="mb-1 block">Categories the bot may answer from</Label>
        <p className="mb-3 text-xs text-text-muted">
          Restrict the FAQ bot to these knowledge categories (FAQs, services, knowledge base).
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

      {/* Bot messages */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-sm font-bold text-text-primary">Bot messages</p>
            <p className="mt-0.5 text-xs text-text-muted">Set what visitors see when the FAQ bot opens and when it cannot find an answer.</p>
          </div>
          <LocaleTabs value={locale} onChange={setLocale} />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`welcome-${locale}`}>Welcome message ({LOCALE_NAMES[locale]})</Label>
            <Textarea
              key={locale}
              id={`welcome-${locale}`}
              rows={3}
              placeholder="👋 Hi! Ask me anything about Stratifit…"
              {...register(`welcome_message_translations.${locale}`)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`fallback-${locale}`}>No-answer message ({LOCALE_NAMES[locale]})</Label>
            <Textarea
              key={locale}
              id={`fallback-${locale}`}
              rows={3}
              placeholder="I couldn't find an answer to that…"
              {...register(`faq_bot_fallback_translations.${locale}`)}
            />
          </div>
        </div>
        <p className="mt-4 text-xs text-text-muted">Switch languages above to translate these messages. English remains the fallback language.</p>
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
          {isSubmitting ? "Saving…" : "Save FAQ Bot Settings"}
        </Button>
      </div>
    </form>
  );
}
