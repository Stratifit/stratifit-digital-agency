"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateSiteSettings } from "@/features/site-settings/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const siteSettingsSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  site_description_en: z.string(),
  contact_email: z.string(),
  contact_phone: z.string(),
  address_en: z.string(),
  default_locale: z.string(),
  social_twitter: z.string(),
  social_linkedin: z.string(),
  social_github: z.string(),
  social_instagram: z.string(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export interface SiteSettingsInitial {
  site_name: string;
  site_description_en: string;
  contact_email: string;
  contact_phone: string;
  address_en: string;
  default_locale: string;
  social: Record<string, string>;
}

export function SiteSettingsForm({
  initial,
}: {
  initial: SiteSettingsInitial;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      site_name: initial.site_name,
      site_description_en: initial.site_description_en,
      contact_email: initial.contact_email,
      contact_phone: initial.contact_phone,
      address_en: initial.address_en,
      default_locale: initial.default_locale,
      social_twitter: initial.social.twitter ?? "",
      social_linkedin: initial.social.linkedin ?? "",
      social_github: initial.social.github ?? "",
      social_instagram: initial.social.instagram ?? "",
    },
  });

  async function onSubmit(values: SiteSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateSiteSettings(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="site_name">Site name</Label>
          <Input id="site_name" {...register("site_name")} />
          {errors.site_name ? (
            <p className="mt-1 text-xs text-error">{errors.site_name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="default_locale">Default language</Label>
          <Select id="default_locale" {...register("default_locale")}>
            <option value="en">English</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="site_description_en">
          Site description (English)
        </Label>
        <Textarea
          id="site_description_en"
          rows={3}
          {...register("site_description_en")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact email</Label>
          <Input
            id="contact_email"
            type="email"
            placeholder="hello@stratifit.com"
            {...register("contact_email")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact phone</Label>
          <Input
            id="contact_phone"
            placeholder="+49 …"
            {...register("contact_phone")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_en">Address (English)</Label>
        <Input id="address_en" {...register("address_en")} />
      </div>

      <fieldset className="rounded-radius-md border border-border bg-background p-5">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Social links
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["social_twitter", "Twitter / X"],
              ["social_linkedin", "LinkedIn"],
              ["social_github", "GitHub"],
              ["social_instagram", "Instagram"],
            ] as const
          ).map(([name, label]) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                placeholder="https://…"
                {...register(name)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {serverError ? (
        <p
          role="alert"
          className="rounded-radius-sm bg-error-soft px-3 py-2 text-sm text-error"
        >
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p
          role="status"
          className="rounded-radius-sm bg-success-soft px-3 py-2 text-sm text-success"
        >
          Saved successfully.
        </p>
      ) : null}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}
