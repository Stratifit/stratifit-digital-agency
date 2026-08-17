"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceFormValues } from "@/features/services/schemas";
import { createService, updateService } from "@/features/services/mutations";
import type { ActionResult } from "@/types/action-result";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type SectionKey = "details" | "seo" | "publishing";

interface ServiceFormProps {
  slug?: string;
  initial?: ServiceFormValues;
}

export function ServiceForm({ slug, initial }: ServiceFormProps) {
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
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initial,
  });

  async function onSubmit(values: ServiceFormValues) {
    setServerError(null);
    const result: ActionResult = isEdit
      ? await updateService(slug!, values)
      : await createService(values);

    if (result.success) {
      router.push("/admin/content/services");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  const sectionOptions: EditorSectionOption<SectionKey>[] = [
    {
      key: "details",
      label: "Details",
      description: "Slug, icon, title, and call-to-action.",
      hasError: Boolean(
        errors.title_translations?.en ||
          errors.short_description_translations?.en ||
          errors.slug
      ),
    },
    {
      key: "seo",
      label: "SEO",
      description: "Search-engine title and description.",
      hasError: Boolean(
        errors.seo_title_translations?.en ||
          errors.seo_description_translations?.en
      ),
    },
    {
      key: "publishing",
      label: "Publishing",
      description: "Status, order, and visibility flags.",
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="my-service" disabled={isEdit} {...register("slug")} />
              {errors.slug ? <p className="text-sm text-error">{errors.slug.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input id="icon" placeholder="Rocket" {...register("icon_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`title-${locale}`}>
                Title ({locale.toUpperCase()})
              </Label>
              <Input
                key={locale} id={`title-${locale}`}
                placeholder="Service title"
                {...register(`title_translations.${locale}`)}
              />
              {errors.title_translations?.en?.message ? (
                <p className="text-sm text-error">
                  {errors.title_translations.en.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-url">CTA URL</Label>
              <Input id="cta-url" placeholder="/contact" {...register("cta_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`short-${locale}`}>
                Short Description ({locale.toUpperCase()})
              </Label>
              <Input
                key={locale} id={`short-${locale}`}
                placeholder="Short description"
                {...register(`short_description_translations.${locale}`)}
              />
              {errors.short_description_translations?.en?.message ? (
                <p className="text-sm text-error">
                  {errors.short_description_translations.en.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`cta-label-${locale}`}>
                CTA Label ({locale.toUpperCase()})
              </Label>
              <Input
                key={locale} id={`cta-label-${locale}`}
                placeholder="Learn More"
                {...register(`cta_label_translations.${locale}`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-style">CTA Style</Label>
              <Select id="cta-style" {...register("cta_style")}>
                <option value="full">Full width</option>
                <option value="compact">Compact</option>
              </Select>
              <p className="text-xs text-text-muted">
                Full width spans the card; compact is a smaller left-aligned button.
              </p>
            </div>
          </div>
        ) : null}

        {activeSection === "seo" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`seo-title-${locale}`}>
                SEO title ({locale.toUpperCase()})
              </Label>
              <Input
                key={locale} id={`seo-title-${locale}`}
                placeholder="Website Development — Stratifit"
                {...register(`seo_title_translations.${locale}`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`seo-description-${locale}`}>
                SEO description ({locale.toUpperCase()})
              </Label>
              <Input
                key={locale} id={`seo-description-${locale}`}
                placeholder="Short description for search engines…"
                {...register(`seo_description_translations.${locale}`)}
              />
              <p className="text-xs text-text-muted">
                Leave empty to use the service title and description.
              </p>
            </div>
          </div>
        ) : null}

        {activeSection === "publishing" ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" {...register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  min={0}
                  {...register("display_order", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" {...register("is_visible")} className="size-4" />
                Visible
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" {...register("is_featured")} className="size-4" />
                Featured
              </label>
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
          {isEdit ? "Save Changes" : "Create Service"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/content/services")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
