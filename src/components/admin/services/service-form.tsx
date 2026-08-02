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

interface ServiceFormProps {
  slug?: string;
  initial?: ServiceFormValues;
}

export function ServiceForm({ slug, initial }: ServiceFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
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
          <Label htmlFor="title-en">Title (English)</Label>
          <Input id="title-en" placeholder="Service title" {...register("title_translations.en")} />
          {errors.title_translations ? (
            <p className="text-sm text-error">
              {(errors.title_translations as { message?: string } | undefined)
                ?.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-url">CTA URL</Label>
          <Input id="cta-url" placeholder="/contact" {...register("cta_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="short-en">Short Description (English)</Label>
          <Input id="short-en" placeholder="Short description" {...register("short_description_translations.en")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-label-en">CTA Label (English)</Label>
          <Input id="cta-label-en" placeholder="Learn More" {...register("cta_label_translations.en")} />
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
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
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

      {serverError ? (
        <p role="alert" className="rounded-radius-sm bg-error-soft px-3 py-2 text-sm text-error">
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
