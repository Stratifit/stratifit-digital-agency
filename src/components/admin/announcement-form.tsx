"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  announcementSchema,
  updateAnnouncement,
  type AnnouncementFormValues,
} from "@/features/announcement/admin-mutations";
import type { AdminAnnouncement } from "@/features/announcement/admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const LOCALES = ["en", "de", "fr", "es"] as const;
const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const VARIANT_LABELS: Record<string, string> = {
  primary: "Primary (amber)",
  neutral: "Neutral (muted)",
  ai: "AI highlight",
};

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

function toFormValues(a: AdminAnnouncement): AnnouncementFormValues {
  return {
    message_translations: tr(a.message_translations),
    link_label_translations: tr(a.link_label_translations),
    link_url: a.link_url ?? "",
    is_enabled: a.is_enabled,
    starts_at: a.starts_at ? a.starts_at.slice(0, 16) : "",
    ends_at: a.ends_at ? a.ends_at.slice(0, 16) : "",
    variant: (a.variant as AnnouncementFormValues["variant"]) ?? "primary",
  };
}

export function AnnouncementForm({ announcement }: { announcement: AdminAnnouncement }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: toFormValues(announcement),
  });

  const isEnabled = useWatch({ control, name: "is_enabled" });

  async function onSubmit(values: AnnouncementFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateAnnouncement(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-shadow-sm">
        <div>
          <p className="text-sm font-medium text-text-primary">Show announcement bar</p>
          <p className="mt-0.5 text-xs text-text-muted">
            The bar appears above the header on every page.
          </p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => setValue("is_enabled", checked)}
          aria-label="Announcement bar enabled"
        />
      </div>

      <div className="space-y-6">
        {LOCALES.map((locale) => (
          <fieldset
            key={locale}
            className="rounded-card border border-card-border bg-card-dark p-5 shadow-shadow-sm"
          >
            <legend className="px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              {LOCALE_NAMES[locale]}
            </legend>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`message-${locale}`}>Message</Label>
                <Input
                  id={`message-${locale}`}
                  placeholder="Now offering AI automation services — book a call"
                  {...register(`message_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`link-label-${locale}`}>Link label</Label>
                <Input
                  id={`link-label-${locale}`}
                  placeholder="Learn more"
                  {...register(`link_label_translations.${locale}`)}
                />
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="link_url">Link URL</Label>
          <Input id="link_url" placeholder="/services" {...register("link_url")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="starts_at">Starts at</Label>
          <Input id="starts_at" type="datetime-local" {...register("starts_at")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ends_at">Ends at</Label>
          <Input id="ends_at" type="datetime-local" {...register("ends_at")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="variant">Style</Label>
        <Select id="variant" {...register("variant")}>
          {Object.entries(VARIANT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

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

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save Announcement"}
      </Button>
    </form>
  );
}
