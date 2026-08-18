"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type {
  EmailInboxSectionSummary,
  EmailThreadSummary,
} from "@/features/email-inbox/queries";
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

  function go(slug: string, status?: ThreadStatus) {
    const params = new URLSearchParams();
    if (slug) params.set("section", slug);
    if (status) params.set("status", status);
    router.push(`/admin/email/inbox?${params.toString()}`);
  }

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
      </div>

      {/* Thread list */}
      {threads.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-sm">
          <p className="text-sm text-text-secondary">No conversations here.</p>
          <p className="mt-1 text-sm text-text-muted">
            Inbound emails and form enquiries will appear as conversations.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-card-border bg-card-dark shadow-sm">
          <ul className="divide-y divide-border">
            {threads.map((thread) => (
              <li key={thread.id}>
                <Link
                  href={`/admin/email/inbox/${thread.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover focus-visible:outline-none focus-visible:bg-surface-hover"
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
      )}
    </div>
  );
}
