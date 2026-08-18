"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendManualEmail } from "@/features/communication/mutations";
import { sendManualEmailSchema } from "@/features/communication/schemas";
import type { EmailTemplateRecord } from "@/features/communication/types";
import { pickTranslation } from "@/features/communication/language";
import { autoFill, AUTO_FILL_KEYS } from "@/features/communication/auto-fill";
import { TEMPLATE_TYPES } from "@/features/communication/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LocaleTabs, type EditorLocale } from "@/components/admin/locale-tabs";

type SendValues = z.infer<typeof sendManualEmailSchema>;

const AUTO_FILL_LABELS: Record<string, string> = {
  name: "Customer name",
  customer_email: "Customer email",
  section_name: "Section / service",
  company: "Company",
  project_name: "Project name",
  project_stage: "Project stage",
  amount: "Amount",
  due_date: "Due date",
  invoice_number: "Invoice number",
  payment_status: "Payment status",
  issue_description: "Issue description",
  meeting_date: "Meeting date",
  admin_name: "Admin name",
};

export function CommunicationSendForm({
  templates,
  replyAsAddresses,
}: {
  templates: EmailTemplateRecord[];
  replyAsAddresses: string[];
}) {
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof sendManualEmailSchema>, unknown, SendValues>({
    resolver: zodResolver(sendManualEmailSchema),
    defaultValues: {
      template_key: templates[0]?.key ?? "",
      language: "en",
      to_email: "",
      to_name: "",
      from_address: replyAsAddresses[0] ?? "",
      subject_override: "",
      body_override: "",
      variables: {},
    },
  });

  const language = (watch("language") ?? "en") as EditorLocale;
  const variables = React.useMemo(() => watch("variables") ?? {}, [watch]);
  const templateKey = watch("template_key");

  const selectedTemplate = templates.find((t) => t.key === templateKey);

  // Live preview: rendered subject/body for the chosen language + variables.
  const preview = React.useMemo(() => {
    if (!selectedTemplate) return { subject: "", body: "" };
    const subject = autoFill(
      pickTranslation(selectedTemplate.subject_translations, language),
      variables as Record<string, string>
    );
    const body = autoFill(
      pickTranslation(selectedTemplate.body_translations, language),
      variables as Record<string, string>
    );
    return { subject, body };
  }, [selectedTemplate, language, variables]);

  function setVariable(key: string, value: string) {
    setValue(`variables.${key}`, value, { shouldDirty: true });
  }

  async function onSubmit(values: SendValues) {
    setActionError(null);
    setSent(false);
    const result = await sendManualEmail(values);
    if (result.success) {
      setSent(true);
      reset({
        template_key: values.template_key,
        language: values.language,
        to_email: "",
        to_name: "",
        from_address: values.from_address,
        subject_override: "",
        body_override: "",
        variables: {},
      });
    } else {
      setActionError(result.error ?? "Email could not be sent.");
    }
  }

  const grouped = TEMPLATE_TYPES.map((type) => ({
    type,
    items: templates.filter((t) => t.template_type === type),
  })).filter((group) => group.items.length > 0);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-card border border-card-border bg-card-dark p-5 shadow-sm"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:items-start">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="send-template">Template</Label>
            <select
              id="send-template"
              className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
              {...register("template_key")}
            >
              {grouped.map((group) => (
                <optgroup
                  key={group.type}
                  label={group.type === "auto" ? "Auto-replies" : "Manual templates"}
                >
                  {group.items.map((template) => (
                    <option key={template.id} value={template.key}>
                      {pickTranslation(template.name_translations, "en") ||
                        template.key}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {selectedTemplate?.description ? (
              <p className="text-xs leading-relaxed text-text-muted">
                {selectedTemplate.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="send-to-email">Recipient email</Label>
              <Input
                id="send-to-email"
                type="email"
                placeholder="customer@example.com"
                {...register("to_email")}
              />
              {errors.to_email ? (
                <p className="text-xs text-error">{errors.to_email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-to-name">Recipient name (optional)</Label>
              <Input
                id="send-to-name"
                placeholder="Anna Müller"
                {...register("to_name")}
                onChange={(e) => setVariable("name", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-from">Reply as</Label>
            <select
              id="send-from"
              className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
              {...register("from_address")}
            >
              {replyAsAddresses.map((address) => (
                <option key={address} value={address}>
                  {address}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-muted">
              The address the customer will see and can reply to.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-language">Language</Label>
            <select
              id="send-language"
              className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
              {...register("language")}
            >
              <option value="en">English</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="space-y-3 rounded-card border border-border bg-background p-4">
            <p className="text-sm font-medium text-text-primary">
              Auto-fill values
            </p>
            <p className="text-xs leading-relaxed text-text-muted">
              These fill the template&apos;s placeholders automatically. Leave
              blank to keep them empty.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {AUTO_FILL_KEYS.map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`var-${key}`} className="text-xs">
                    {AUTO_FILL_LABELS[key] ?? key}
                  </Label>
                  <Input
                    id={`var-${key}`}
                    placeholder={`{{${key}}}`}
                    value={variables[key] ?? ""}
                    onChange={(e) => setVariable(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-subject">Subject override (optional)</Label>
            <Input
              id="send-subject"
              placeholder={preview.subject || "Leave empty to use the template subject"}
              {...register("subject_override")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-body">Body override (optional)</Label>
            <Textarea
              id="send-body"
              rows={6}
              placeholder="Leave empty to use the template body."
              {...register("body_override")}
            />
          </div>

          {actionError ? (
            <p
              role="alert"
              className="rounded-card bg-error-soft px-3 py-2 text-sm text-error"
            >
              {actionError}
            </p>
          ) : null}
          {sent ? (
            <p
              role="status"
              className="rounded-card bg-success-soft px-3 py-2 text-sm text-success"
            >
              Email sent successfully.
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send email"}
            </Button>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between rounded-t-card border border-b-0 border-card-border bg-surface px-4 py-3">
            <p className="text-sm font-medium text-text-primary">Preview</p>
            <LocaleTabs value={language} onChange={() => undefined} />
          </div>
          <div className="space-y-3 rounded-b-card border border-card-border bg-background p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Subject
              </p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {preview.subject || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Body
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {preview.body || "—"}
              </p>
            </div>
            <p className="text-xs text-text-muted">
              The email is wrapped in the Stratifit branded layout
              automatically.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
