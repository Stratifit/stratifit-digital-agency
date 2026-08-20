"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  sendEmailReply,
  resolveEmailThread,
  archiveEmailThread,
  reopenEmailThread,
  deleteEmailThreads,
} from "@/features/email-inbox/mutations";
import { emailReplySchema } from "@/features/email-inbox/schemas";
import type { EmailThreadDetail } from "@/features/email-inbox/queries";
import { EMAIL_LANGUAGE_LABELS } from "@/features/email-inbox/language";
import { TEMPLATE_CATEGORIES } from "@/features/email-inbox/template-schemas";
import type { EmailTemplateRecord } from "@/features/email-inbox/template-queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

type ReplyValues = z.infer<typeof emailReplySchema>;

const CATEGORY_LABELS: Record<string, string> = {
  auto_reply: "Auto-replies",
  lifecycle: "Lifecycle",
  follow_up: "Follow-ups",
  billing: "Billing",
  custom: "Custom",
};

function templateLabel(template: EmailTemplateRecord): string {
  return (
    resolveTranslation(template.name_translations, "en") || template.key
  );
}

/**
 * Fill template placeholders with thread data; keys without a value stay as
 * {{key}} so the admin can replace them before sending.
 */
function renderComposerTemplate(
  text: string,
  context: Record<string, string | null | undefined>
): string {
  return text.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (match, key: string) => {
    const value = context[key.toLowerCase()];
    return value && value.trim().length > 0 ? value : match;
  });
}

const STATUS_VARIANT: Record<
  string,
  "neutral" | "success" | "warning" | "error" | "information"
> = {
  needs_reply: "warning",
  waiting_on_customer: "information",
  resolved: "success",
  archived: "neutral",
};

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EmailThreadDetailView({
  thread,
  templates = [],
}: {
  thread: EmailThreadDetail;
  templates?: EmailTemplateRecord[];
}) {
  const router = useRouter();
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const groupedTemplates = React.useMemo(
    () =>
      TEMPLATE_CATEGORIES.map((category) => ({
        category,
        items: templates.filter((template) => template.category === category),
      })).filter((group) => group.items.length > 0),
    [templates]
  );

  const replyLanguage =
    EMAIL_LANGUAGE_LABELS[
      thread.language as keyof typeof EMAIL_LANGUAGE_LABELS
    ] ?? thread.language;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof emailReplySchema>, unknown, ReplyValues>({
    resolver: zodResolver(emailReplySchema),
    defaultValues: { thread_id: thread.id, subject: "", body: "" },
  });

  async function onSubmit(values: ReplyValues) {
    setActionError(null);
    const result = await sendEmailReply(values);
    if (result.success) {
      reset({ thread_id: thread.id, subject: "", body: "" });
      router.refresh();
    } else {
      setActionError(result.error ?? "Reply could not be sent.");
    }
  }

  /** Insert a template into the composer (subject + body, thread data filled). */
  function handleTemplateSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const templateId = event.target.value;
    event.target.value = "";
    if (!templateId) return;
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    if (getValues("body").trim().length > 0) {
      if (
        !window.confirm(
          "Insert this template? It will replace the draft you have written."
        )
      ) {
        return;
      }
    }

    const language = thread.language || "en";
    const context = {
      name: thread.customer_name,
      section_name: thread.section_name,
      customer_email: thread.customer_email,
    };
    setValue(
      "subject",
      renderComposerTemplate(
        resolveTranslation(template.subject_translations, language),
        context
      )
    );
    setValue(
      "body",
      renderComposerTemplate(
        resolveTranslation(template.body_translations, language),
        context
      )
    );
  }

  async function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    setBusy(true);
    setActionError(null);
    const result = await action();
    setBusy(false);
    if (!result.success) {
      setActionError(result.error ?? "Action failed.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title={thread.subject}
        description={`${thread.customer_name ?? thread.customer_email} · ${thread.customer_email}`}
        actions={
          <Link
            href={`/admin/email/inbox?section=${thread.section_slug}`}
            className="rounded-button border border-border bg-card-dark px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
          >
            Back to inbox
          </Link>
        }
      />

      {/* Status + section row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={STATUS_VARIANT[thread.status] ?? "neutral"}>
            {thread.status.replace(/_/g, " ")}
          </Badge>
          <Badge variant="information">{thread.section_name}</Badge>
          <Badge variant="neutral">
            {EMAIL_LANGUAGE_LABELS[
              thread.language as keyof typeof EMAIL_LANGUAGE_LABELS
            ] ?? thread.language}
          </Badge>
          <span className="text-xs text-text-muted">
            {thread.source === "inbound_email" ? "Email conversation" : "Form enquiry"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {thread.status === "needs_reply" || thread.status === "waiting_on_customer" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => runAction(() => resolveEmailThread(thread.id))}
              className="rounded-button border border-success-green-border/40 bg-success-soft px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success disabled:opacity-50"
            >
              Resolve
            </button>
          ) : thread.status === "resolved" || thread.status === "archived" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => runAction(() => reopenEmailThread(thread.id))}
              className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              Reopen
            </button>
          ) : null}
          {thread.status !== "archived" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => runAction(() => archiveEmailThread(thread.id))}
              className="rounded-button border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              Archive
            </button>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              if (
                !window.confirm(
                  "Delete this conversation permanently? All messages are removed. This cannot be undone."
                )
              ) {
                return;
              }
              await runAction(() => deleteEmailThreads([thread.id]));
              router.push(`/admin/email/inbox?section=${thread.section_slug}`);
            }}
            className="rounded-button border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {actionError ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {actionError}
        </p>
      ) : null}

      {/* Message history */}
      <div className="space-y-3">
        {thread.messages.map((message) => {
          const inbound = message.direction === "inbound";
          return (
            <div
              key={message.id}
              className={cn(
                "rounded-card border border-card-border bg-card-dark p-4 shadow-sm",
                inbound ? "border-l-2 border-l-primary/60" : "border-l-2 border-l-indigo-500/50"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {inbound ? message.from_email : `Stratifit → ${message.to_email}`}
                  </p>
                  <Badge variant={inbound ? "information" : "success"}>
                    {inbound ? "Inbound" : "Sent"}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted" suppressHydrationWarning>
                  {formatDateTime(message.created_at)}
                </p>
              </div>
              <p className="mt-1 text-xs text-text-muted">{message.subject}</p>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {message.text_content || "(no text content)"}
              </div>
              {message.status === "failed" ? (
                <p className="mt-2 text-xs text-error">
                  Delivery failed{message.error_message ? `: ${message.error_message}` : ""}
                </p>
              ) : null}
            </div>
          );
        })}
        {thread.messages.length === 0 ? (
          <div className="rounded-card border border-card-border bg-card-dark p-8 text-center text-sm text-text-muted">
            No messages in this conversation yet.
          </div>
        ) : null}
      </div>

      {/* Reply editor */}
      {thread.status !== "archived" ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm"
        >
          <input type="hidden" {...register("thread_id")} />
          <div className="space-y-2">
            <Label htmlFor="reply-subject">Subject</Label>
            <Input
              id="reply-subject"
              placeholder={`Re: ${thread.subject}`}
              {...register("subject")}
            />
            <p className="text-xs text-text-muted">
              Leave empty to reply as “Re: {thread.subject}”.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-picker">Insert template</Label>
            <select
              id="template-picker"
              defaultValue=""
              onChange={handleTemplateSelect}
              className="h-11 w-full cursor-pointer rounded-input border border-field-border bg-field-bg px-3.5 text-sm font-medium text-field-text transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none"
            >
              <option value="">Choose a template…</option>
              {groupedTemplates.map((group) => (
                <optgroup
                  key={group.category}
                  label={CATEGORY_LABELS[group.category] ?? group.category}
                >
                  {group.items.map((template) => (
                    <option key={template.id} value={template.id}>
                      {templateLabel(template)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="text-xs leading-relaxed text-text-muted">
              Fills the subject and body with the template in {replyLanguage}.
              Values this conversation knows (name, section, email) are filled
              in automatically; other variables stay as{" "}
              <code className="rounded-sm bg-surface px-1">{"{{placeholders}}"}</code>{" "}
              for you to replace.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply-body">Message to {thread.customer_email}</Label>
            <Textarea
              id="reply-body"
              rows={7}
              placeholder="Write your reply… The customer receives it by email and their response lands back in this conversation."
              aria-invalid={errors.body ? true : undefined}
              {...register("body")}
            />
            {errors.body ? (
              <p role="alert" className="text-xs text-error">
                {errors.body.message}
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send reply"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-card border border-card-border bg-card-dark p-5 text-center text-sm text-text-muted">
          This conversation is archived. Reopen it to reply.
        </div>
      )}
    </>
  );
}
