"use client";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  whyChooseUsSchema,
  type WhyChooseUsItemFormValues,
} from "@/features/why-choose-us/schemas";
import { updateWhyChooseUsItems } from "@/features/why-choose-us/mutations";
import type { WhyChooseUsItem } from "@/features/why-choose-us/queries";
import { WHY_CHOOSE_US_ICON_OPTIONS } from "@/components/ui/why-choose-us-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const LOCALES = ["en", "de", "fr", "es"] as const;

const LOCALE_NAMES: Record<(typeof LOCALES)[number], string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const emptyTranslations = () => ({ en: "", de: "", fr: "", es: "" });

function emptyItem(): WhyChooseUsItemFormValues {
  return {
    icon: "shield",
    title: emptyTranslations(),
    description: emptyTranslations(),
    stat_value: "",
    stat_label: emptyTranslations(),
  };
}

function toFormValues(items: WhyChooseUsItem[]): WhyChooseUsItemFormValues[] {
  return items.map((item) => ({
    icon: item.icon ?? "shield",
    title: { ...emptyTranslations(), ...(item.title ?? {}) },
    description: { ...emptyTranslations(), ...(item.description ?? {}) },
    stat_value: item.stat_value ?? "",
    stat_label: { ...emptyTranslations(), ...(item.stat_label ?? {}) },
  }));
}

export function WhyChooseUsForm({ items }: { items: WhyChooseUsItem[] }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<{ items: WhyChooseUsItemFormValues[] }>({
    resolver: zodResolver(whyChooseUsSchema),
    defaultValues: { items: toFormValues(items) },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  async function onSubmit(values: { items: WhyChooseUsItemFormValues[] }) {
    setServerError(null);
    setSaved(false);
    const result = await updateWhyChooseUsItems(values.items);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-md border border-border bg-background p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-text-primary">
              Feature {index + 1}
            </h3>
            <Button
              type="button"
              variant="destructive"
              size="small"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor={`icon-${index}`}>Icon</Label>
              <Select id={`icon-${index}`} {...register(`items.${index}.icon`)}>
                {WHY_CHOOSE_US_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`stat-${index}`}>Stat value</Label>
              <Input
                id={`stat-${index}`}
                placeholder="50+"
                {...register(`items.${index}.stat_value`)}
              />
              {errors.items?.[index]?.stat_value ? (
                <p className="mt-1 text-xs text-error">
                  {errors.items[index].stat_value.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {LOCALES.map((locale) => (
              <div
                key={locale}
                className="grid gap-3 rounded-sm border border-border-subtle p-3 sm:grid-cols-2"
              >
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}-${locale}`}>
                    Title ({LOCALE_NAMES[locale]})
                  </Label>
                  <Input
                    id={`title-${index}-${locale}`}
                    placeholder="Senior-only team"
                    {...register(`items.${index}.title.${locale}`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`stat-label-${index}-${locale}`}>
                    Stat label ({LOCALE_NAMES[locale]})
                  </Label>
                  <Input
                    id={`stat-label-${index}-${locale}`}
                    placeholder="Shipped projects"
                    {...register(`items.${index}.stat_label.${locale}`)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`description-${index}-${locale}`}>
                    Description ({LOCALE_NAMES[locale]})
                  </Label>
                  <Textarea
                    id={`description-${index}-${locale}`}
                    rows={2}
                    placeholder="What makes this different…"
                    {...register(`items.${index}.description.${locale}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {errors.items?.message ? (
        <p className="rounded-sm bg-error-soft px-3 py-2 text-sm text-error">
          {errors.items.message}
        </p>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        onClick={() => append(emptyItem())}
      >
        Add feature
      </Button>

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

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Features"}
        </Button>
      </div>
    </form>
  );
}
