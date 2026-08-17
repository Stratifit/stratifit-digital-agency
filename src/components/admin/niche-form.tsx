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
import {
  EditorSectionSwitcher,
  type EditorSectionOption,
} from "@/components/admin/editor-section-switcher";
import {
  LocaleTabs,
  type EditorLocale,
} from "@/components/admin/locale-tabs";

type SectionKey = "details" | "why" | "stats" | "publishing";

interface NicheFormProps {
  slug?: string;
  initial?: AcquisitionNicheFormValues;
}

export function NicheForm({ slug, initial }: NicheFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [locale, setLocale] = React.useState<EditorLocale>("en");
  const [activeSection, setActiveSection] = React.useState<SectionKey>(
    "details"
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

  const sectionOptions: EditorSectionOption<SectionKey>[] = [
    {
      key: "details",
      label: "Details",
      description: "Slug, emoji, accent, label, and description.",
      hasError: Boolean(
        errors.label_translations?.en || errors.description_translations?.en
      ),
    },
    {
      key: "why",
      label: "Why this niche",
      description: "The longer justification shown on the niche page.",
      hasError: Boolean(
        errors.why_title_translations?.en ||
          errors.why_description_translations?.en
      ),
    },
    {
      key: "stats",
      label: "Stats",
      description: "Up to 3 numbers shown on the niche detail page.",
      action: fields.length < 3 ? (
        <button
          type="button"
          onClick={() =>
            append({
              value: "",
              label_translations: { en: "", de: "", fr: "", es: "" },
              hint_translations: { en: "", de: "", fr: "", es: "" },
            })
          }
          className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add stat
        </button>
      ) : undefined,
    },
    {
      key: "publishing",
      label: "Publishing",
      description: "Visibility and display order.",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <EditorSectionSwitcher
        options={sectionOptions}
        value={activeSection}
        onChange={setActiveSection}
        headerRight={
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium text-text-muted">Language</p>
            <LocaleTabs value={locale} onChange={setLocale} />
          </div>
        }
      >
        {activeSection === "details" ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
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
              <Label htmlFor={`label-${locale}`}>Label ({locale.toUpperCase()})</Label>
              <Input
                key={locale} id={`label-${locale}`}
                placeholder="Ecommerce"
                {...register(`label_translations.${locale}`)}
              />
              {errors.label_translations?.en?.message ? (
                <p className="text-sm text-error">{errors.label_translations.en.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${locale}`}>
                Description ({locale.toUpperCase()})
              </Label>
              <Textarea
                key={locale} id={`description-${locale}`}
                rows={3}
                placeholder="Short card description…"
                {...register(`description_translations.${locale}`)}
              />
              {errors.description_translations?.en?.message ? (
                <p className="text-sm text-error">{errors.description_translations.en.message}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {activeSection === "why" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`why-title-${locale}`}>
                Why title ({locale.toUpperCase()})
              </Label>
              <Input
                key={locale} id={`why-title-${locale}`}
                placeholder="Why Ecommerce?"
                {...register(`why_title_translations.${locale}`)}
              />
              {errors.why_title_translations?.en?.message ? (
                <p className="text-sm text-error">{errors.why_title_translations.en.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`why-desc-${locale}`}>
                Why description ({locale.toUpperCase()})
              </Label>
              <Textarea
                key={locale} id={`why-desc-${locale}`}
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
        ) : null}

        {activeSection === "stats" ? (
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
                    <Label htmlFor={`stats.${index}.label_translations.${locale}`}>
                      Label ({locale.toUpperCase()})
                    </Label>
                    <Input
                      key={locale}
                      id={`stats.${index}.label_translations.${locale}`}
                      placeholder="Avg. Revenue"
                      {...register(`stats.${index}.label_translations.${locale}`)}
                    />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <Label htmlFor={`stats.${index}.hint_translations.${locale}`}>
                    Hint ({locale.toUpperCase()})
                  </Label>
                  <Input
                    key={locale}
                    id={`stats.${index}.hint_translations.${locale}`}
                    placeholder="Shown under the stat"
                    {...register(`stats.${index}.hint_translations.${locale}`)}
                  />
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
            {fields.length === 0 ? (
              <p className="text-xs text-text-muted">
                No stats yet — add one above.
              </p>
            ) : null}
          </div>
        ) : null}

        {activeSection === "publishing" ? (
          <div className="space-y-4">
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
        ) : null}
      </EditorSectionSwitcher>

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
