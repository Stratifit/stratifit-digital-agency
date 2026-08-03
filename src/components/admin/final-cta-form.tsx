"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { finalCtaSchema, type FinalCtaFormValues } from "@/features/final-cta/schemas";
import { updateFinalCta } from "@/features/final-cta/mutations";
import type { AdminFinalCta } from "@/features/final-cta/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const LOCALES = ["en", "de", "fr", "es"] as const;
const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

export function FinalCtaForm({ initial }: { initial: AdminFinalCta }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FinalCtaFormValues>({
    resolver: zodResolver(finalCtaSchema),
    defaultValues: {
      title_translations: tr(initial.title_translations),
      description_translations: tr(initial.description_translations),
      primary_cta_label_translations: tr(initial.primary_cta_label_translations),
      primary_cta_url: initial.primary_cta_url ?? "",
      secondary_cta_label_translations: tr(initial.secondary_cta_label_translations),
      secondary_cta_url: initial.secondary_cta_url ?? "",
      is_visible: initial.is_visible,
    },
  });

  const isVisible = useWatch({ control, name: "is_visible" });

  async function onSubmit(values: FinalCtaFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateFinalCta(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text-primary">Show this section</p>
          <p className="text-xs text-text-muted">Hide the final CTA without deleting it.</p>
        </div>
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) => setValue("is_visible", checked)}
          aria-label="Final CTA visible"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primary_cta_url">Primary CTA URL</Label>
          <Input id="primary_cta_url" placeholder="/contact" {...register("primary_cta_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondary_cta_url">Secondary CTA URL</Label>
          <Input id="secondary_cta_url" placeholder="/services" {...register("secondary_cta_url")} />
        </div>
      </div>

      <div className="space-y-6">
        {LOCALES.map((locale) => (
          <fieldset
            key={locale}
            className="rounded-md border border-border bg-background p-5"
          >
            <legend className="px-2 text-sm font-semibold text-text-primary">
              {LOCALE_NAMES[locale]}
            </legend>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${locale}`}>Title</Label>
                <Input id={`title-${locale}`} {...register(`title_translations.${locale}`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`description-${locale}`}>Description</Label>
                <Textarea
                  id={`description-${locale}`}
                  rows={2}
                  {...register(`description_translations.${locale}`)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`pcta-${locale}`}>Primary CTA label</Label>
                  <Input
                    id={`pcta-${locale}`}
                    {...register(`primary_cta_label_translations.${locale}`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`scta-${locale}`}>Secondary CTA label</Label>
                  <Input
                    id={`scta-${locale}`}
                    {...register(`secondary_cta_label_translations.${locale}`)}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {errors.title_translations?.en?.message ? (
        <p className="rounded-sm bg-error-soft px-3 py-2 text-sm text-error">
          {errors.title_translations.en.message}
        </p>
      ) : null}

      {serverError ? (
        <p role="alert" className="rounded-sm bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p role="status" className="rounded-sm bg-success-soft px-3 py-2 text-sm text-success">
          Saved successfully.
        </p>
      ) : null}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save Final CTA"}
      </Button>
    </form>
  );
}
