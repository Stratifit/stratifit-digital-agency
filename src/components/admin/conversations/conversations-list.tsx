"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminConversationRow } from "@/features/chat/admin-queries";
import { paddedVisitorNumber } from "@/features/chat/admin-shared";
import {
  archiveConversations,
  deleteConversations,
} from "@/features/chat/admin-mutations";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center">
      <span className="sr-only">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 cursor-pointer accent-primary"
      />
    </label>
  );
}

export function ConversationsList({
  conversations,
}: {
  conversations: AdminConversationRow[];
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

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

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runBulk(action: "archive" | "delete") {
    if (selected.size === 0) return;
    setBusy(true);
    setError(null);
    const result =
      action === "archive"
        ? await archiveConversations([...selected])
        : await deleteConversations([...selected]);
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? "Action failed.");
      return;
    }
    setArchiveDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelected(new Set());
    router.refresh();
  }

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

      {/* Bulk action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onChange={toggleAll}
            label="Select all conversations"
          />
          <span className="text-sm text-text-secondary">
            {selected.size === 0
              ? "Select conversations to bulk-archive or delete"
              : `${selected.size} selected`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={selected.size === 0}
                className="inline-flex items-center gap-2 rounded-button border border-border px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-border-interactive hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArchiveIcon />
                Archive ({selected.size})
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Archive {selected.size} conversation{selected.size === 1 ? "" : "s"}?</DialogTitle>
                <DialogDescription>
                  Archived conversations are hidden from the active list but kept for reference.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <button type="button" className="rounded-button border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="button"
                  onClick={() => runBulk("archive")}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
                >
                  {busy ? "Working…" : "Archive conversations"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={selected.size === 0}
                className="inline-flex items-center gap-2 rounded-button border border-error/40 bg-error-soft px-3.5 py-2 text-xs font-medium text-error transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:cursor-not-allowed disabled:opacity-50"
              >
                <TrashIcon />
                Delete ({selected.size})
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {selected.size} conversation{selected.size === 1 ? "" : "s"}?</DialogTitle>
                <DialogDescription>
                  This permanently deletes the selected conversations and their messages. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <button type="button" className="rounded-button border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="button"
                  onClick={() => runBulk("delete")}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-button bg-error px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-60"
                >
                  {busy ? "Deleting…" : "Delete conversations"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-sm">
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
            <div
              key={c.id}
              className={cn(
                "group flex items-start gap-3 rounded-card border border-card-border bg-card-dark p-4 shadow-sm transition-[border-color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-border-interactive hover:shadow-md",
                selected.has(c.id) && "border-primary/40 bg-primary/5"
              )}
            >
              <div className="pt-1">
                <Checkbox
                  checked={selected.has(c.id)}
                  onChange={() => toggleOne(c.id)}
                  label={`Select ${c.visitor.name}`}
                />
              </div>
              <Link
                href={`/admin/conversations/${c.id}`}
                className="block min-w-0 flex-1"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-bold text-primary">
                    {paddedVisitorNumber(c.visitor.visitor_number)}
                  </span>
                  <span className="font-medium text-text-primary">
                    {c.visitor.name}
                  </span>
                  {c.bot_type === "faq" ? (
                    <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-light">
                      FAQ bot
                    </span>
                  ) : null}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
      <rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" /><path d="M10 12h4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M10 11v6" /><path d="M14 11v6" />
    </svg>
  );
}
