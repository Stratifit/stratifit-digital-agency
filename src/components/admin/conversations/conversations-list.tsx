"use client";

import * as React from "react";
import Link from "next/link";
import type { AdminConversationRow } from "@/features/chat/admin-queries";
import { paddedVisitorNumber } from "@/features/chat/admin-shared";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const STATUS_VARIANT: Record<string, "neutral" | "success" | "warning" | "error" | "information"> = {
  open: "information",
  waiting_for_admin: "warning",
  waiting_for_visitor: "success",
  resolved: "neutral",
  archived: "neutral",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}

export function ConversationsList({
  conversations,
}: {
  conversations: AdminConversationRow[];
}) {
  const [query, setQuery] = React.useState("");

  const filtered = conversations.filter((c) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      paddedVisitorNumber(c.visitor.visitor_number).toLowerCase().includes(q) ||
      c.visitor.name.toLowerCase().includes(q) ||
      c.visitor.raw_name.toLowerCase().includes(q) ||
      c.visitor.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Conversations
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Visitor chats with AI and human handling.
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by number, name or email…"
          aria-label="Search conversations"
          className="w-full rounded-card border border-field-border bg-field-bg px-3 py-2 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-shadow-sm">
          <p className="text-sm text-text-secondary">No conversations yet.</p>
          <p className="mt-1 text-sm text-text-muted">
            {query.trim()
              ? "Nothing matches your search."
              : "New chats will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/admin/conversations/${c.id}`}
              className="group block rounded-card border border-card-border bg-card-dark p-4 shadow-shadow-sm transition-[border-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-border-interactive hover:shadow-shadow-md"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-bold text-primary">
                  {paddedVisitorNumber(c.visitor.visitor_number)}
                </span>
                <span className="font-medium text-text-primary">
                  {c.visitor.name}
                </span>
                {c.visitor.email ? (
                  <span className="text-xs text-text-muted">{c.visitor.email}</span>
                ) : null}
                <span className="ml-auto">
                  <Badge variant={STATUS_VARIANT[c.status] ?? "neutral"}>
                    {c.status}
                  </Badge>
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-sm text-text-secondary">
                  {c.last_message ?? "No messages yet."}
                </p>
                <span
                  className={cn(
                    "shrink-0 text-xs",
                    c.status === "waiting_for_admin"
                      ? "font-medium text-warning"
                      : "text-text-muted"
                  )}
                >
                  {timeAgo(c.last_message_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
