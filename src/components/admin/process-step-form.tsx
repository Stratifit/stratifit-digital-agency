"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  processStepSchema,
  type ProcessStepFormValues,
} from "@/features/process/schemas";
import {
  createProcessStep,
  updateProcessStep,
} from "@/features/process/mutations";
import type { AdminProcessStep } from "@/features/process/admin-queries";
import { PROCESS_ICON_OPTIONS } from "@/components/ui/process-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const LOCALES = ["en", "de", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

function toFormValues(
  step: Partial<AdminProcessStep> | null
): ProcessStepFormValues {
  const title = step?.title_translations ?? {};
  const description = step?.description_translations ?? {};
  return {
    step_key: step?.step_key ?? "",
    number: step?.number ?? 1,
    title_translations: {
      en: title.en ?? "",
      de: title.de ?? "",
      fr: title.fr ?? "",
      es: title.es ?? "",
    },
    description_translations: {
      en: description.en ?? "",
      de: description.de ?? "",
      fr: description.fr ?? "",
      es: description.es ?? "",
    },
    icon_name: step?.icon_name ?? "search",
    display_order: step?.display_order ?? 0,
    is_visible: step?.is_visible ?? true,
  };
}

export function ProcessStepForm({
  step,
  isNew,
}: {
  step: AdminProcessStep | null;
  isNew: boolean;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProcessStepFormValues>({
    resolver: zodResolver(processStepSchema),
    defaultValues: toFormValues(step),
  });

  const isVisible = useWatch({ control, name: "is_visible" });

  async function onSubmit(values: ProcessStepFormValues) {
    setServerError(null);
    setSaved(false);
    const result = isNew
      ? await createProcessStep(values)
      : await updateProcessStep(step?.step_key ?? "", values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="step_key">Step key</Label>
          <Input
            id="step_key"
            placeholder="discovery"
            disabled={!isNew}
            {...register("step_key")}
          />
          {errors.step_key ? (
            <p className="mt-1 text-xs text-error">{errors.step_key.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Step number</Label>
          <Input
            id="number"
            type="number"
            min={1}
            placeholder="1"
            {...register("number", { valueAsNumber: true })}
          />
          {errors.number ? (
            <p className="mt-1 text-xs text-error">{errors.number.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="display_order">Display order</Label>
          <Input
            id="display_order"
            type="number"
            min={0}
            placeholder="0"
            {...register("display_order", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon_name">Icon</Label>
          <Select id="icon_name" {...register("icon_name")}>
            {PROCESS_ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {errors.icon_name ? (
            <p className="mt-1 text-xs text-error">{errors.icon_name.message}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Show this step</p>
            <p className="text-xs text-text-muted">
              Hide it without deleting.
            </p>
          </div>
          <Switch
            checked={isVisible}
            onCheckedChange={(checked) => setValue("is_visible", checked)}
            aria-label="Step visible"
          />
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
                <Input
                  id={`title-${locale}`}
                  placeholder="Discovery"
                  {...register(`title_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`description-${locale}`}>Description</Label>
                <Textarea
                  id={`description-${locale}`}
                  rows={3}
                  placeholder="Describe this step…"
                  {...register(`description_translations.${locale}`)}
                />
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
      {errors.description_translations?.en?.message ? (
        <p className="rounded-sm bg-error-soft px-3 py-2 text-sm text-error">
          {errors.description_translations.en.message}
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
        {isSubmitting ? "Saving…" : isNew ? "Create Step" : "Save Step"}
      </Button>
    </form>
  );
}
