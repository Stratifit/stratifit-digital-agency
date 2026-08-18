"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createEmailSchedule } from "@/features/communication/mutations";
import { emailScheduleSchema } from "@/features/communication/schemas";
import type { EmailTemplateRecord } from "@/features/communication/types";
import { pickTranslation } from "@/features/communication/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ScheduleValues = z.infer<typeof emailScheduleSchema>;

export function CommunicationScheduleForm({
  templates,
}: {
  templates: EmailTemplateRecord[];
}) {
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof emailScheduleSchema>, unknown, ScheduleValues>({
    resolver: zodResolver(emailScheduleSchema),
    defaultValues: {
      template_key: templates[0]?.key ?? "",
      language: "en",
      recipient_email: "",
      recipient_name: "",
      send_at: "",
      variables: {},
    },
  });

  async function onSubmit(values: ScheduleValues) {
    setActionError(null);
    setSaved(false);
    const result = await createEmailSchedule(values);
    if (result.success) {
      setSaved(true);
      reset({
        template_key: values.template_key,
        language: values.language,
        recipient_email: "",
        recipient_name: "",
        send_at: "",
        variables: {},
      });
    } else {
      setActionError(result.error ?? "Could not schedule the email.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-card border border-card-border bg-card-dark p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="schedule-template">Template</Label>
          <select
            id="schedule-template"
            className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
            {...register("template_key")}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.key}>
                {pickTranslation(template.name_translations, "en") ||
                  template.key}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="schedule-language">Language</Label>
          <select
            id="schedule-language"
            className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
            {...register("language")}
          >
            <option value="en">English</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="schedule-email">Recipient email</Label>
          <Input
            id="schedule-email"
            type="email"
            placeholder="customer@example.com"
            {...register("recipient_email")}
          />
          {errors.recipient_email ? (
            <p className="text-xs text-error">{errors.recipient_email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="schedule-name">Recipient name (optional)</Label>
          <Input
            id="schedule-name"
            placeholder="Anna Müller"
            {...register("recipient_name")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule-when">Send at</Label>
        <Input
          id="schedule-when"
          type="datetime-local"
          {...register("send_at")}
        />
        <p className="text-xs text-text-muted">
          Local time — stored as UTC. Requires a scheduler to process due
          emails.
        </p>
      </div>

      {actionError ? (
        <p
          role="alert"
          className="rounded-card bg-error-soft px-3 py-2 text-sm text-error"
        >
          {actionError}
        </p>
      ) : null}
      {saved ? (
        <p
          role="status"
          className="rounded-card bg-success-soft px-3 py-2 text-sm text-success"
        >
          Email scheduled.
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Scheduling…" : "Schedule email"}
        </Button>
      </div>
    </form>
  );
}
