"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createEmailSection,
  updateEmailSection,
  deleteEmailSection,
} from "@/features/email-inbox/mutations";
import {
  emailSectionSchema,
  type EmailSectionInput,
} from "@/features/email-inbox/schemas";
import type { EmailInboxSectionRecord } from "@/features/email-inbox/queries";
import type { EmailTemplateRecord } from "@/features/email-inbox/template-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocaleTabs, type EditorLocale } from "@/components/admin/locale-tabs";
import { cn } from "@/lib/cn";

const EMPTY_TRANSLATIONS = { en: "", de: "", fr: "", es: "" };

const LANGUAGE_OPTIONS: { value: "" | "en" | "de" | "fr" | "es"; label: string }[] = [
  { value: "", label: "Any language" },
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
];

function emptyValues(): EmailSectionInput {
  return {
    slug: "",
    name_translations: { ...EMPTY_TRANSLATIONS },
    enabled: true,
    routing_addresses: [],
    form_source_key: null,
    from_address: "hello@stratifit.com",
    language: null,
    auto_reply_enabled: false,
    auto_reply_subject_translations: { ...EMPTY_TRANSLATIONS },
    auto_reply_body_translations: { ...EMPTY_TRANSLATIONS },
    auto_reply_template_id: null,
    resolved_template_id: null,
    resolved_email_enabled: false,
    display_order: 10,
  };
}

function fromRecord(section: EmailInboxSectionRecord): EmailSectionInput {
  const tr = (value: Record<string, string> | null) => ({
    en: value?.en ?? "",
    de: value?.de ?? "",
    fr: value?.fr ?? "",
    es: value?.es ?? "",
  });
  return {
    id: section.id,
    slug: section.slug,
    name_translations: tr(section.name_translations),
    enabled: section.enabled,
    routing_addresses: section.routing_addresses ?? [],
    form_source_key: section.form_source_key,
    from_address: section.from_address ?? "hello@stratifit.com",
    language: (section.language as "en" | "de" | "fr" | "es" | null) ?? null,
    auto_reply_enabled: section.auto_reply_enabled,
    auto_reply_subject_translations: tr(
      section.auto_reply_subject_translations
    ),
    auto_reply_body_translations: tr(section.auto_reply_body_translations),
    auto_reply_template_id: section.auto_reply_template_id ?? null,
    resolved_template_id: section.resolved_template_id ?? null,
    resolved_email_enabled: section.resolved_email_enabled,
    display_order: section.display_order,
  };
}

function SectionEditorCard({
  initial,
  templates,
  isNew,
  isProtected,
  onDone,
}: {
  initial: EmailSectionInput;
  templates: EmailTemplateRecord[];
  isNew: boolean;
  isProtected: boolean;
  onDone: () => void;
}) {
  const router = useRouter();
  const [locale, setLocale] = React.useState<EditorLocale>("en");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof emailSectionSchema>, unknown, EmailSectionInput>({
    resolver: zodResolver(emailSectionSchema),
    defaultValues: initial,
  });

  // useWatch subscribes to field values (React Compiler compatible).
  const enabled = useWatch({ control, name: "enabled" });
  const autoReplyEnabled = useWatch({ control, name: "auto_reply_enabled" });
  const autoReplyTemplateId = useWatch({ control, name: "auto_reply_template_id" });
  const resolvedEmailEnabled = useWatch({ control, name: "resolved_email_enabled" });
  const resolvedTemplateId = useWatch({ control, name: "resolved_template_id" });
  const routingAddresses = useWatch({ control, name: "routing_addresses" });
  const selectedLanguage = useWatch({ control, name: "language" });

  const templateOptions = templates.map((t) => ({
    id: t.id,
    label: `${t.name_translations?.en || t.key} (${t.key})`,
  }));

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

  async function onSubmit(values: EmailSectionInput) {
    setServerError(null);
    setSaved(false);
    const result = isNew
      ? await createEmailSection(values)
      : await updateEmailSection(values);
    if (result.success) {
      setSaved(true);
      if (isNew) onDone();
      router.refresh();
    } else {
      setServerError(result.error ?? "Failed to save the section.");
    }
  }

  async function handleDelete() {
    if (!initial.id) return;
    if (!window.confirm("Delete this section? Threads in it must be moved first.")) {
      return;
    }
    setServerError(null);
    const result = await deleteEmailSection(initial.id);
    if (!result.success) {
      setServerError(result.error ?? "Failed to delete the section.");
      return;
    }
    router.refresh();
  }

  const routingValue =
    (routingAddresses ?? []).join(", ") || "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-card border border-card-border bg-card-dark shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
            {initial.name_translations.en || "New section"}
            {isProtected ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Fallback
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            Slug: {initial.slug || "not saved yet"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-text-muted">Enabled</p>
            <Switch
              checked={enabled}
              onCheckedChange={(next) => setValue("enabled", next)}
              aria-label="Section enabled"
            />
          </div>
          {!isNew && !isProtected ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Automatic reply — template first, inline fields as fallback */}
        <div
          className={cn(
            "rounded-card border border-border bg-background p-4",
            (autoReplyEnabled || autoReplyTemplateId) && "border-primary/30"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Automatic reply
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Send an instant reply when an email lands in this section — in
                the customer&apos;s language. Form enquiries use this template too
                (as the acknowledgement).
              </p>
            </div>
            <Switch
              checked={autoReplyEnabled}
              onCheckedChange={(next) => setValue("auto_reply_enabled", next)}
              aria-label="Automatic reply enabled"
            />
          </div>

          {autoReplyEnabled ? (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`auto-template-${initial.slug}`}>
                  Reply template
                </Label>
                <select
                  id={`auto-template-${initial.slug}`}
                  className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
                  value={autoReplyTemplateId ?? ""}
                  onChange={(e) =>
                    setValue(
                      "auto_reply_template_id",
                      e.target.value || null
                    )
                  }
                >
                  <option value="">— Inline fields below —</option>
                  {templateOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-muted">
                  Choose a design from the template library (en/de/fr/es). When
                  set, it replaces the inline fields below.
                </p>
              </div>

              {!autoReplyTemplateId ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-text-muted">
                      Inline fields (fallback)
                    </p>
                    <LocaleTabs value={locale} onChange={setLocale} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`auto-subject-${initial.slug}-${locale}`}>
                      Auto-reply subject ({locale})
                    </Label>
                    <Input
                      id={`auto-subject-${initial.slug}-${locale}`}
                      placeholder="Thank you for contacting Stratifit"
                      {...register(`auto_reply_subject_translations.${locale}`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`auto-body-${initial.slug}-${locale}`}>
                      Auto-reply message ({locale})
                    </Label>
                    <Textarea
                      id={`auto-body-${initial.slug}-${locale}`}
                      rows={4}
                      placeholder="Thanks for reaching out. We typically reply within 24 hours."
                      {...register(`auto_reply_body_translations.${locale}`)}
                    />
                    <p className="text-xs text-text-muted">
                      {`"Hi {name},"`} is prepended automatically.
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Automatic send when a conversation is finished */}
        <div
          className={cn(
            "rounded-card border border-border bg-background p-4",
            resolvedEmailEnabled && "border-primary/30"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Send when resolved
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Automatically send a template when an admin marks a
                conversation in this section as resolved.
              </p>
            </div>
            <Switch
              checked={resolvedEmailEnabled}
              onCheckedChange={(next) =>
                setValue("resolved_email_enabled", next)
              }
              aria-label="Send when resolved enabled"
            />
          </div>

          {resolvedEmailEnabled ? (
            <div className="mt-4 space-y-2">
              <Label htmlFor={`resolved-template-${initial.slug}`}>
                Resolved template
              </Label>
              <select
                id={`resolved-template-${initial.slug}`}
                className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
                value={resolvedTemplateId ?? ""}
                onChange={(e) =>
                  setValue("resolved_template_id", e.target.value || null)
                }
              >
                <option value="">— Choose a template —</option>
                {templateOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-muted">
                Sent in the customer&apos;s language (e.g. follow-up or thank-you).
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium text-text-muted">Editing language</p>
          <LocaleTabs value={locale} onChange={setLocale} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`language-${initial.slug}`}>Routing language</Label>
          <select
            id={`language-${initial.slug}`}
            className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
            value={selectedLanguage ?? ""}
            onChange={(e) =>
              setValue(
                "language",
                e.target.value === ""
                  ? null
                  : (e.target.value as "en" | "de" | "fr" | "es")
              )
            }
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value || "any"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-text-muted">
            Inbound email detected as this language routes here when its address
            matches. “Any language” applies to all languages.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`slug-${initial.slug}-${isNew ? "new" : ""}`}>
              Slug
            </Label>
            <Input
              id={`slug-${initial.slug}`}
              placeholder="support"
              disabled={isProtected}
              {...register("slug")}
            />
            {fieldError("slug") ? (
              <p className="text-xs text-error">{fieldError("slug")}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`display-order-${initial.slug}`}>
              Display order
            </Label>
            <Input
              id={`display-order-${initial.slug}`}
              type="number"
              min={0}
              {...register("display_order", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`name-${initial.slug}-${locale}`}>
            Section name ({locale})
          </Label>
          <Input
            id={`name-${initial.slug}-${locale}`}
            placeholder="Support"
            {...register(`name_translations.${locale}`)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`routing-${initial.slug}`}>
              Routing addresses
            </Label>
            <Input
              id={`routing-${initial.slug}`}
              placeholder="support@stratifit.com, help@stratifit.com"
              defaultValue={routingValue}
              onBlur={(e) =>
                setValue(
                  "routing_addresses",
                  e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean)
                )
              }
            />
            <p className="text-xs text-text-muted">
              Emails sent to these addresses land in this section. Comma-separated.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`from-${initial.slug}`}>Reply from address</Label>
            <Input
              id={`from-${initial.slug}`}
              placeholder="hello@stratifit.com"
              {...register("from_address")}
            />
            <p className="text-xs text-text-muted">
              Shown as the sender for replies and auto-replies from this section.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`form-key-${initial.slug}`}>
            Form source key (optional)
          </Label>
          <Input
            id={`form-key-${initial.slug}`}
            placeholder="contact_form"
            {...register("form_source_key")}
          />
          <p className="text-xs text-text-muted">
            Website form submissions with this source land in this section (e.g.{" "}
            <code className="rounded-sm bg-surface px-1">contact_form</code>,{" "}
            <code className="rounded-sm bg-surface px-1">acquisition_form</code>).
            Set a routing language to capture submissions in that language;
            leave it “Any language” for the default section.
          </p>
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
                ? "Create section"
                : "Save section"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function EmailSectionsManager({
  sections,
  templates,
}: {
  sections: EmailInboxSectionRecord[];
  templates: EmailTemplateRecord[];
}) {
  const [showNew, setShowNew] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {sections.map((section) => (
          <SectionEditorCard
            key={section.id}
            initial={fromRecord(section)}
            templates={templates}
            isNew={false}
            isProtected={section.slug === "other"}
            onDone={() => undefined}
          />
        ))}
      </div>

      {showNew ? (
        <SectionEditorCard
          initial={emptyValues()}
          templates={templates}
          isNew
          isProtected={false}
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
          Add section
        </button>
      )}
    </div>
  );
}
