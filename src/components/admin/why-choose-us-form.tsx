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
import {
  EditorSectionSwitcher,
  type EditorSectionOption,
} from "@/components/admin/editor-section-switcher";
import {
  LocaleTabs,
  type EditorLocale,
} from "@/components/admin/locale-tabs";

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
  const [locale, setLocale] = React.useState<EditorLocale>("en");
  const [activeIndex, setActiveIndex] = React.useState(0);

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

  function handleRemove(index: number) {
    remove(index);
    if (fields.length > 1) {
      setActiveIndex((current) => Math.min(current, fields.length - 2));
    } else {
      setActiveIndex(0);
    }
  }

  function handleAppend() {
    append(emptyItem());
    setActiveIndex(fields.length);
  }

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

  const safeIndex = Math.min(
    activeIndex,
    Math.max(fields.length - 1, 0)
  );

  const addAction = (
    <button
      type="button"
      onClick={handleAppend}
      className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      + Add feature
    </button>
  );

  const sectionOptions: EditorSectionOption[] = fields.map((field, index) => ({
    key: String(index),
    label: `Feature ${index + 1}`,
    description: "Icon, stat, title, and description.",
    hasError: Boolean(errors.items?.[index]),
    action: addAction,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <EditorSectionSwitcher
        options={sectionOptions}
        value={String(safeIndex)}
        onChange={(key) => setActiveIndex(Number(key))}
        headerRight={
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium text-text-muted">Language</p>
            <LocaleTabs value={locale} onChange={setLocale} />
          </div>
        }
      >
        {fields.length === 0 ? (
          <p className="text-xs text-text-muted">
            No features yet — add one above.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`icon-${safeIndex}`}>Icon</Label>
                <Select
                  id={`icon-${safeIndex}`}
                  {...register(`items.${safeIndex}.icon`)}
                >
                  {WHY_CHOOSE_US_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`stat-${safeIndex}`}>Stat value</Label>
                <Input
                  id={`stat-${safeIndex}`}
                  placeholder="50+"
                  {...register(`items.${safeIndex}.stat_value`)}
                />
                {errors.items?.[safeIndex]?.stat_value ? (
                  <p className="mt-1 text-xs text-error">
                    {errors.items[safeIndex].stat_value.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${safeIndex}-${locale}`}>Title</Label>
                <Input
                  key={locale}
                  id={`title-${safeIndex}-${locale}`}
                  placeholder="Senior-only team"
                  {...register(`items.${safeIndex}.title.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`stat-label-${safeIndex}-${locale}`}>
                  Stat label
                </Label>
                <Input
                  key={locale}
                  id={`stat-label-${safeIndex}-${locale}`}
                  placeholder="Shipped projects"
                  {...register(`items.${safeIndex}.stat_label.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`description-${safeIndex}-${locale}`}>
                  Description
                </Label>
                <Textarea
                  key={locale}
                  id={`description-${safeIndex}-${locale}`}
                  rows={2}
                  placeholder="What makes this different…"
                  {...register(`items.${safeIndex}.description.${locale}`)}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="destructive"
              size="small"
              onClick={() => handleRemove(safeIndex)}
            >
              Remove feature
            </Button>
          </div>
        )}
      </EditorSectionSwitcher>

      {errors.items?.message ? (
        <p className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {errors.items.message}
        </p>
      ) : null}

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
          {isSubmitting ? "Saving…" : "Save Features"}
        </Button>
      </div>
    </form>
  );
}
