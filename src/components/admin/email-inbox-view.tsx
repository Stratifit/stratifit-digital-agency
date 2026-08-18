"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type {
  EmailInboxSectionSummary,
  EmailThreadSummary,
} from "@/features/email-inbox/queries";
import {
  deleteAllEmailThreads,
  deleteEmailThreads,
} from "@/features/email-inbox/mutations";
import type { ThreadStatus } from "@/features/email-inbox/schemas";
import { Badge } from "@/components/ui/badge";

const STATUS_TABS: { key: ThreadStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_reply", label: "Needs reply" },
  { key: "waiting_on_customer", label: "Waiting on customer" },
  { key: "resolved", label: "Resolved" },
  { key: "archived", label: "Archived" },
];

const STATUS_VARIANT: Record<
  string,
  "neutral" | "success" | "warning" | "error" | "information"
> = {
  needs_reply: "warning",
  waiting_on_customer: "information",
  resolved: "success",
  archived: "neutral",
};

function formatTime(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function EmailInboxView({
  sections,
  activeSlug,
  activeStatus,
  threads,
}: {
  sections: EmailInboxSectionSummary[];
  activeSlug: string;
  activeStatus?: ThreadStatus;
  threads: EmailThreadSummary[];
}) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);

  const activeSection = sections.find((section) => section.slug === activeSlug);

  function go(slug: string, status?: ThreadStatus) {
    setSelected(new Set());
    const params = new URLSearchParams();
    if (slug) params.set("section", slug);
    if (status) params.set("status", status);
    router.push(`/admin/email/inbox?${params.toString()}`);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (prev.size === threads.length && threads.length > 0) return new Set();
      return new Set(threads.map((thread) => thread.id));
    });
  }

  async function handleDeleteSelected() {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (!window.confirm(`Delete ${ids.length} conversation${ids.length === 1 ? "" : "s"}? Messages are removed permanently.`)) {
      return;
    }
    setBusy(true);
    setActionError(null);
    setActionMessage(null);
    const result = await deleteEmailThreads(ids);
    setBusy(false);
    if (!result.success) {
      setActionError(result.error ?? "Could not delete the conversations.");
      return;
    }
    setSelected(new Set());
    setActionMessage(
      `Deleted ${result.data?.deleted ?? ids.length} conversation${(result.data?.deleted ?? ids.length) === 1 ? "" : "s"}.`
    );
    router.refresh();
  }

  async function handleDeleteAll() {
    if (!activeSection) return;
    const scope = activeStatus
      ? `every "${activeStatus.replace(/_/g, " ")}" conversation`
      : "every conversation (except archived)";
    if (
      !window.confirm(
        `This permanently deletes ${scope} in the "${activeSection.name}" section. This cannot be undone. Continue?`
      )
    ) {
      return;
    }
    setBusy(true);
    setActionError(null);
    setActionMessage(null);
    const result = await deleteAllEmailThreads({
      sectionId: activeSection.id,
      status: activeStatus,
    });
    setBusy(false);
    if (!result.success) {
      setActionError(result.error ?? "Could not delete the conversations.");
      return;
    }
    setSelected(new Set());
    setActionMessage(
      `Deleted ${result.data?.deleted ?? 0} conversation${(result.data?.deleted ?? 0) === 1 ? "" : "s"}.`
    );
    router.refresh();
  }

  const allSelected = threads.length > 0 && selected.size === threads.length;

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className="flex touch-pan-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const active = section.slug === activeSlug;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => go(section.slug)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-button border px-3.5 py-2 text-sm font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-card-border bg-card-dark text-text-secondary hover:border-card-border-hover hover:text-text-primary"
              )}
            >
              {section.name}
              {section.language ? (
                <span className="rounded-sm border border-white/10 bg-white/5 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                  {section.language}
                </span>
              ) : null}
              {section.counts.total > 0 ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-hover text-text-muted"
                  )}
                >
                  {section.counts.needs_reply > 0
                    ? section.counts.needs_reply
                    : section.counts.total}
                </span>
              ) : null}
            </button>
          );
        })}
        <Link
          href="/admin/email/sections"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-button border border-card-border bg-card-dark px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-card-border-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
            <path d="M12 5v14" /><path d="M5 12h14" />
          </svg>
          Sections
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_TABS.map((tab) => {
          const active = (tab.key === "all" && !activeStatus) || activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => go(activeSlug, tab.key === "all" ? undefined : tab.key)}
              className={cn(
                "rounded-button px-3 py-1.5 text-xs font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                  ? "bg-primary text-text-inverse"
                  : "text-text-muted hover:bg-surface-hover hover:text-text-secondary"
              )}
            >
              {tab.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={handleDeleteAll}
            className="rounded-button border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-50"
          >
            Delete all{activeStatus ? ` (${activeStatus.replace(/_/g, " ")})` : ""}
          </button>
        </div>
      </div>

      {actionError ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {actionError}
        </p>
      ) : null}
      {actionMessage ? (
        <p role="status" className="rounded-card bg-success-soft px-3 py-2 text-sm text-success">
          {actionMessage}
        </p>
      ) : null}

      {/* Thread list */}
      {threads.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-sm">
          <p className="text-sm text-text-secondary">No conversations here.</p>
          <p className="mt-1 text-sm text-text-muted">
            Inbound emails and form enquiries will appear as conversations.
          </p>
        </div>
      ) : (
        <>
          {/* Selection toolbar */}
          <div className="flex items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark px-4 py-3 shadow-sm">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="size-4 cursor-pointer rounded-sm border-border bg-field-bg accent-primary"
                aria-label="Select all conversations"
              />
              {selected.size > 0 ? (
                <span>
                  <strong className="text-text-primary">{selected.size}</strong> selected
                </span>
              ) : (
                <span>Select all ({threads.length})</span>
              )}
            </label>
            {selected.size > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-text-muted transition-colors hover:text-text-secondary"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleDeleteSelected}
                  className="rounded-button border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-50"
                >
                  Delete selected ({selected.size})
                </button>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-card border border-card-border bg-card-dark shadow-sm">
            <ul className="divide-y divide-border">
              {threads.map((thread) => (
                <li key={thread.id} className="flex items-center gap-3 px-5">
                  <input
                    type="checkbox"
                    checked={selected.has(thread.id)}
                    onChange={() => toggle(thread.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="size-4 shrink-0 cursor-pointer rounded-sm border-border bg-field-bg accent-primary"
                    aria-label={`Select conversation with ${thread.customer_name || thread.customer_email}`}
                  />
                  <Link
                    href={`/admin/email/inbox/${thread.id}`}
                    className="flex min-w-0 flex-1 items-center justify-between gap-4 py-4 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover focus-visible:outline-none focus-visible:bg-surface-hover"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {thread.customer_name || thread.customer_email}
                        </p>
                        <Badge variant={STATUS_VARIANT[thread.status] ?? "neutral"}>
                          {thread.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-text-secondary">
                        {thread.subject}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-text-muted">
                        {thread.customer_email}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-text-muted">
                        {formatTime(thread.last_message_at)}
                      </p>
                      {thread.source === "inbound_email" ? (
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
                          Email
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                          Form
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
