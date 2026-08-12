"use client";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  acquisitionNicheSchema,
  type AcquisitionNicheFormValues,
} from "@/features/acquisition/niche-schemas";
import {
  createAcquisitionNiche,
  updateAcquisitionNiche,
} from "@/features/acquisition/niche-mutations";
import type { ActionResult } from "@/types/action-result";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

const SUPPORTED_LOCALES = ["en", "de", "fr", "es"] as const;
const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

interface NicheFormProps {
  slug?: string;
  initial?: AcquisitionNicheFormValues;
}

export function NicheForm({ slug, initial }: NicheFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [locale, setLocale] = React.useState<(typeof SUPPORTED_LOCALES)[number]>(
    "en"
  );
  const isEdit = Boolean(slug);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AcquisitionNicheFormValues>({
    resolver: zodResolver(acquisitionNicheSchema),
    defaultValues: initial,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stats",
  });

  async function onSubmit(values: AcquisitionNicheFormValues) {
    setServerError(null);
    const result: ActionResult = isEdit
      ? await updateAcquisitionNiche(slug!, values)
      : await createAcquisitionNiche(values);

    if (result.success) {
      router.push("/admin/content/acquisition/niches");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Language tabs */}
      <div className="flex overflow-hidden rounded-button border border-border">
        {SUPPORTED_LOCALES.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setLocale(key)}
            className={cn(
              "flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
              locale === key
                ? "bg-primary text-text-inverse"
                : "bg-card-dark text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            {LOCALE_NAMES[key]}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" placeholder="ecommerce" disabled={isEdit} {...register("slug")} />
          {errors.slug ? <p className="text-sm text-error">{errors.slug.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emoji">Emoji</Label>
          <Input id="emoji" placeholder="🛒" {...register("emoji")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accent">Accent color</Label>
          <Input id="accent" placeholder="#F59E0B" {...register("accent")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`label-${locale}`}>Label ({LOCALE_NAMES[locale]})</Label>
        <Input
          id={`label-${locale}`}
          placeholder="Ecommerce"
          {...register(`label_translations.${locale}`)}
        />
        {errors.label_translations?.en?.message ? (
          <p className="text-sm text-error">{errors.label_translations.en.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${locale}`}>
          Description ({LOCALE_NAMES[locale]})
        </Label>
        <Textarea
          id={`description-${locale}`}
          rows={3}
          placeholder="Short card description…"
          {...register(`description_translations.${locale}`)}
        />
        {errors.description_translations?.en?.message ? (
          <p className="text-sm text-error">{errors.description_translations.en.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`why-title-${locale}`}>
            Why title ({LOCALE_NAMES[locale]})
          </Label>
          <Input
            id={`why-title-${locale}`}
            placeholder="Why Ecommerce?"
            {...register(`why_title_translations.${locale}`)}
          />
          {errors.why_title_translations?.en?.message ? (
            <p className="text-sm text-error">{errors.why_title_translations.en.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`why-desc-${locale}`}>
            Why description ({LOCALE_NAMES[locale]})
          </Label>
          <Textarea
            id={`why-desc-${locale}`}
            rows={4}
            placeholder="Longer justification shown on the niche detail page…"
            {...register(`why_description_translations.${locale}`)}
          />
          {errors.why_description_translations?.en?.message ? (
            <p className="text-sm text-error">
              {errors.why_description_translations.en.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-display text-base font-semibold text-text-primary">
            Stats
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Up to 3 numbers shown on the niche detail page.
          </p>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-card border border-white/5 bg-background p-4"
            >
              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <div className="space-y-2">
                  <Label htmlFor={`stats.${index}.value`}>Value</Label>
                  <Input
                    id={`stats.${index}.value`}
                    placeholder="$85K"
                    {...register(`stats.${index}.value`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`stats.${index}.label_translations.en`}>
                    Label ({LOCALE_NAMES[locale]})
                  </Label>
                  <Input
                    id={`stats.${index}.label_translations.${locale}`}
                    placeholder="Avg. Revenue"
                    {...register(`stats.${index}.label_translations.${locale}`)}
                  />
                  <div className="grid gap-2 sm:grid-cols-4">
                    {SUPPORTED_LOCALES.map((l) => (
                      <Input
                        key={l}
                        placeholder={LOCALE_NAMES[l]}
                        {...register(
                          `stats.${index}.label_translations.${l}`
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <Label htmlFor={`stats.${index}.hint_translations.${locale}`}>
                  Hint ({LOCALE_NAMES[locale]})
                </Label>
                <div className="grid gap-2 sm:grid-cols-4">
                  {SUPPORTED_LOCALES.map((l) => (
                    <Input
                      key={l}
                      placeholder={LOCALE_NAMES[l]}
                      {...register(`stats.${index}.hint_translations.${l}`)}
                    />
                  ))}
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={() => remove(index)}
              >
                Remove stat
              </Button>
            </div>
          ))}
          {fields.length < 3 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  value: "",
                  label_translations: { en: "", de: "", fr: "", es: "" },
                  hint_translations: { en: "", de: "", fr: "", es: "" },
                })
              }
            >
              + Add stat
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" {...register("is_visible")} className="size-4" />
          Visible
        </label>
        <div className="space-y-2">
          <Label htmlFor="display-order">Display Order</Label>
          <Input
            id="display-order"
            type="number"
            min={0}
            className="w-32"
            {...register("display_order", { valueAsNumber: true })}
          />
        </div>
      </div>

      {serverError ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Save Changes" : "Create Niche"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/content/acquisition/niches")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
