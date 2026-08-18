"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createEmailTemplate,
  updateEmailTemplate,
  duplicateEmailTemplate,
  deleteEmailTemplate,
} from "@/features/communication/mutations";
import { Copy } from "lucide-react";
import { EmailTemplatePreview } from "./email-template-preview";
import {
  emailTemplateSchema,
  TEMPLATE_CATEGORIES,
  TEMPLATE_TRIGGERS,
  type EmailTemplateInput,
} from "@/features/email-inbox/template-schemas";
import type { EmailTemplateRecord } from "@/features/email-inbox/template-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocaleTabs, type EditorLocale } from "@/components/admin/locale-tabs";
import { cn } from "@/lib/cn";

const CATEGORY_LABELS: Record<string, string> = {
  auto_reply: "Auto-replies",
  lifecycle: "Lifecycle",
  follow_up: "Follow-ups",
  billing: "Billing",
  custom: "Custom",
};

const TRIGGER_LABELS: Record<string, string> = {
  manual: "Manual",
  on_lead: "On form lead",
  on_inbound_email: "On inbound email",
  on_thread_resolved: "On thread resolved",
};

const EMPTY_TRANSLATIONS = { en: "", de: "", fr: "", es: "" };

function emptyValues(type: "auto" | "manual"): EmailTemplateInput {
  return {
    key: "",
    template_type: type,
    category: "custom",
    name_translations: { ...EMPTY_TRANSLATIONS },
    subject_translations: { ...EMPTY_TRANSLATIONS },
    body_translations: { ...EMPTY_TRANSLATIONS },
    description: "",
    trigger_event: null,
    is_enabled: true,
    display_order: 0,
  };
}

function fromRecord(template: EmailTemplateRecord): EmailTemplateInput {
  const tr = (value: Record<string, string> | null) => ({
    en: value?.en ?? "",
    de: value?.de ?? "",
    fr: value?.fr ?? "",
    es: value?.es ?? "",
  });
  return {
    id: template.id,
    key: template.key,
    template_type: template.template_type,
    category: template.category,
    name_translations: tr(template.name_translations),
    subject_translations: tr(template.subject_translations),
    body_translations: tr(template.body_translations),
    description: template.description ?? "",
    trigger_event:
      template.trigger_event === "manual"
        ? null
        : template.trigger_event ?? null,
    is_enabled: template.is_enabled,
    display_order: template.display_order,
  };
}

function TemplateEditorCard({
  initial,
  isNew,
  onDone,
}: {
  initial: EmailTemplateInput;
  isNew: boolean;
  onDone: () => void;
}) {
  const router = useRouter();
  const [locale, setLocale] = React.useState<EditorLocale>("en");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof emailTemplateSchema>, unknown, EmailTemplateInput>(
    {
      resolver: zodResolver(emailTemplateSchema),
      defaultValues: initial,
    }
  );

  const isEnabled = watch("is_enabled");

  const fieldError = (path: string) => {
    const parts = path.split(".");
    let node: Record<string, unknown> | undefined = errors as unknown as Record<
      string,
      unknown
    >;
    for (const part of parts) {
      if (!node || typeof node !== "object") return undefined;
      node = node[part] as Record<string, unknown> | undefined;
    }
    return (node as { message?: string } | undefined)?.message;
  };

  async function onSubmit(values: EmailTemplateInput) {
    setServerError(null);
    setSaved(false);
    const result = isNew
      ? await createEmailTemplate(values)
      : await updateEmailTemplate(values);
    if (result.success) {
      setSaved(true);
      if (isNew) onDone();
      router.refresh();
    } else {
      setServerError(result.error ?? "Failed to save the template.");
    }
  }

  async function handleDuplicate() {
    if (!initial.id) return;
    setServerError(null);
    const result = await duplicateEmailTemplate(initial.id);
    if (!result.success) {
      setServerError(result.error ?? "Failed to duplicate the template.");
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!initial.id) return;
    if (
      !window.confirm(
        "Delete this template? Sections using it will fall back to their inline auto-reply."
      )
    ) {
      return;
    }
    setServerError(null);
    const result = await deleteEmailTemplate(initial.id);
    if (!result.success) {
      setServerError(result.error ?? "Failed to delete the template.");
      return;
    }
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-card border border-card-border bg-card-dark shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
            {initial.name_translations.en || "New template"}
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {CATEGORY_LABELS[initial.category] ?? initial.category}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {initial.key || "not saved yet"}
            {initial.trigger_event ? ` · ${TRIGGER_LABELS[initial.trigger_event] ?? initial.trigger_event}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-text-muted">Enabled</p>
            <Switch
              checked={isEnabled}
              onCheckedChange={(next) => setValue("is_enabled", next)}
              aria-label="Template enabled"
            />
          </div>
          {!isNew ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDuplicate}
                className="flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Copy className="size-3.5" aria-hidden="true" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start">
          <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor={`key-${initial.key || "new"}`}>Key</Label>
            <Input
              id={`key-${initial.key || "new"}`}
              placeholder="support_auto_reply"
              {...register("key")}
            />
            {fieldError("key") ? (
              <p className="text-xs text-error">{fieldError("key")}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`type-${initial.key || "new"}`}>Type</Label>
            <select
              id={`type-${initial.key || "new"}`}
              className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
              {...register("template_type")}
            >
              <option value="auto">Auto-reply</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`category-${initial.key || "new"}`}>Category</Label>
            <select
              id={`category-${initial.key || "new"}`}
              className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
              {...register("category")}
            >
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c] ?? c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`trigger-${initial.key || "new"}`}>Trigger</Label>
            <select
              id={`trigger-${initial.key || "new"}`}
              className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
              {...register("trigger_event")}
            >
              {TEMPLATE_TRIGGERS.map((t) => (
                <option key={t} value={t}>
                  {TRIGGER_LABELS[t] ?? t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`name-${initial.key || "new"}-${locale}`}>
            Template name ({locale})
          </Label>
          <Input
            id={`name-${initial.key || "new"}-${locale}`}
            placeholder="Support — Auto Reply"
            {...register(`name_translations.${locale}`)}
          />
          {fieldError("name_translations.en") ? (
            <p className="text-xs text-error">
              {fieldError("name_translations.en")}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${initial.key || "new"}`}>
            Description
          </Label>
          <Input
            id={`description-${initial.key || "new"}`}
            placeholder="When and how this template is used…"
            {...register("description")}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-background p-4">
          <p className="text-sm font-medium text-text-primary">
            Email content
          </p>
          <LocaleTabs value={locale} onChange={setLocale} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`subject-${initial.key || "new"}-${locale}`}>
            Subject ({locale})
          </Label>
          <Input
            id={`subject-${initial.key || "new"}-${locale}`}
            placeholder="Thank you for contacting Stratifit"
            {...register(`subject_translations.${locale}`)}
          />
          {fieldError("subject_translations.en") ? (
            <p className="text-xs text-error">
              {fieldError("subject_translations.en")}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`body-${initial.key || "new"}-${locale}`}>
            Body ({locale})
          </Label>
          <Textarea
            id={`body-${initial.key || "new"}-${locale}`}
            rows={8}
            placeholder={"Hi {{name}},\n\nThank you for your enquiry…"}
            {...register(`body_translations.${locale}`)}
          />
          <p className="text-xs leading-relaxed text-text-muted">
            Placeholders (auto-filled from lead, project, and invoice data; the
            preview injects sample values):{" "}
            <code className="rounded-sm bg-surface px-1">{"{{name}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{section_name}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{company}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{project_name}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{project_stage}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{amount}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{due_date}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{invoice_number}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{payment_status}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{issue_description}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{meeting_date}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{admin_name}}"}</code>{" "}
            <code className="rounded-sm bg-surface px-1">{"{{customer_email}}"}</code>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`order-${initial.key || "new"}`}>Display order</Label>
            <Input
              id={`order-${initial.key || "new"}`}
              type="number"
              min={0}
              {...register("display_order", { valueAsNumber: true })}
            />
          </div>
        </div>

        {serverError ? (
          <p
            role="alert"
            className="rounded-card bg-error-soft px-3 py-2 text-sm text-error"
          >
            {serverError}
          </p>
        ) : null}
        {saved ? (
          <p
            role="status"
            className="rounded-card bg-success-soft px-3 py-2 text-sm text-success"
          >
            Saved successfully.
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting
              ? "Saving…"
              : isNew
                ? "Create template"
                : "Save template"}
          </Button>
        </div>
          </div>

          {/* Live preview with sample variable injection */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <EmailTemplatePreview
              subjectTranslations={watch("subject_translations")}
              bodyTranslations={watch("body_translations")}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

const TYPE_LABELS: Record<string, string> = {
  auto: "Auto-replies",
  manual: "Manual",
};

export function EmailTemplatesManager({
  templates,
  activeCategory,
  activeType,
}: {
  templates: EmailTemplateRecord[];
  activeCategory?: string;
  activeType?: string;
}) {
  const router = useRouter();
  const [showNew, setShowNew] = React.useState(false);
  const newType = activeType === "auto" ? "auto" : "manual";

  function selectFilters(type: string, category: string) {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (category !== "all") params.set("category", category);
    router.push(`/admin/communication/templates?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "auto", "manual"] as const).map((type) => {
            const active =
              (type === "all" && !activeType) || type === activeType;
            return (
              <button
                key={type}
                type="button"
                onClick={() => selectFilters(type, activeCategory ?? "all")}
                className={cn(
                  "rounded-button px-3 py-1.5 text-xs font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary text-text-inverse"
                    : "text-text-muted hover:bg-surface-hover hover:text-text-secondary"
                )}
              >
                {type === "all" ? "All types" : TYPE_LABELS[type]}
              </button>
            );
          })}
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
          {(["all", ...TEMPLATE_CATEGORIES] as const).map((category) => {
            const active =
              (category === "all" && !activeCategory) ||
              category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => selectFilters(activeType ?? "all", category)}
                className={cn(
                  "rounded-button px-3 py-1.5 text-xs font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary text-text-inverse"
                    : "text-text-muted hover:bg-surface-hover hover:text-text-secondary"
                )}
              >
                {category === "all" ? "All categories" : CATEGORY_LABELS[category] ?? category}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/email/sections"
            className="rounded-button border border-card-border bg-card-dark px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
          >
            Link to sections
          </Link>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-sm">
          <p className="text-sm text-text-secondary">No templates in this category.</p>
          <p className="mt-1 text-sm text-text-muted">
            Create one below or pick another category.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {templates.map((template) => (
            <TemplateEditorCard
              key={template.id}
              initial={fromRecord(template)}
              isNew={false}
              onDone={() => undefined}
            />
          ))}
        </div>
      )}

      {showNew ? (
        <TemplateEditorCard
          initial={emptyValues(newType)}
          isNew
          onDone={() => setShowNew(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-card-border bg-card-dark px-5 py-6 text-sm font-medium text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
            <path d="M12 5v14" /><path d="M5 12h14" />
          </svg>
          New template
        </button>
      )}
    </div>
  );
}
