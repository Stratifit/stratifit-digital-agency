"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sectionSettingsSchema,
  SUPPORTED_LOCALES,
  type SectionSettingsFormValues,
} from "@/features/section-settings/schemas";
import { updateSectionSettings } from "@/features/section-settings/mutations";
import type { AdminSectionSettings } from "@/features/section-settings/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

function toFormValues(settings: AdminSectionSettings): SectionSettingsFormValues {
  const eyebrow = settings.eyebrow_translations ?? {};
  const title = settings.title_translations ?? {};
  const highlight = settings.highlight_translations ?? {};
  const description = settings.description_translations ?? {};
  return {
    eyebrow_translations: {
      en: eyebrow.en ?? "",
      de: eyebrow.de ?? "",
      fr: eyebrow.fr ?? "",
      es: eyebrow.es ?? "",
    },
    title_translations: {
      en: title.en ?? "",
      de: title.de ?? "",
      fr: title.fr ?? "",
      es: title.es ?? "",
    },
    highlight_translations: {
      en: highlight.en ?? "",
      de: highlight.de ?? "",
      fr: highlight.fr ?? "",
      es: highlight.es ?? "",
    },
    description_translations: {
      en: description.en ?? "",
      de: description.de ?? "",
      fr: description.fr ?? "",
      es: description.es ?? "",
    },
    is_visible: settings.is_visible,
  };
}

export function SectionSettingsForm({
  settings,
}: {
  settings: AdminSectionSettings;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SectionSettingsFormValues>({
    resolver: zodResolver(sectionSettingsSchema),
    defaultValues: toFormValues(settings),
  });

  const isVisible = useWatch({ control, name: "is_visible" });

  async function onSubmit(values: SectionSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateSectionSettings(settings.section_key, values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between rounded-radius-md border border-border bg-background px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Show this section on the website
          </p>
          <p className="text-xs text-text-muted">
            Hide it without deleting your content.
          </p>
        </div>
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) => setValue("is_visible", checked)}
          aria-label="Section visible"
        />
      </div>

      <div className="space-y-6">
        {SUPPORTED_LOCALES.map((locale) => (
          <fieldset
            key={locale}
            className="rounded-radius-md border border-border bg-background p-5"
          >
            <legend className="px-2 text-sm font-semibold text-text-primary">
              {LOCALE_NAMES[locale]}
            </legend>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`eyebrow-${locale}`}>Eyebrow label</Label>
                  <Input
                    id={`eyebrow-${locale}`}
                    placeholder="Process"
                    {...register(`eyebrow_translations.${locale}`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`highlight-${locale}`}>
                    Amber highlight
                  </Label>
                  <Input
                    id={`highlight-${locale}`}
                    placeholder="Work"
                    {...register(`highlight_translations.${locale}`)}
                  />
                  <p className="text-xs text-text-muted">
                    Shown in amber right after the title. Leave empty to skip.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`title-${locale}`}>Title</Label>
                <Input
                  id={`title-${locale}`}
                  placeholder="How We"
                  {...register(`title_translations.${locale}`)}
                />
                {errors.title_translations?.en?.message ? (
                  <p className="mt-1 text-xs text-error">
                    {errors.title_translations.en.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${locale}`}>Description</Label>
                <Textarea
                  id={`description-${locale}`}
                  rows={3}
                  placeholder="A short sentence describing this section…"
                  {...register(`description_translations.${locale}`)}
                />
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-radius-sm bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p role="status" className="rounded-radius-sm bg-success-soft px-3 py-2 text-sm text-success">
          Saved successfully.
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Section"}
        </Button>
      </div>
    </form>
  );
}
