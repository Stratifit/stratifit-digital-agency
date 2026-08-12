"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteLead, deleteLeads } from "@/features/leads/admin-mutations";
import type { AdminLeadRow } from "@/features/leads/admin-queries";
import { Badge } from "@/components/ui/badge";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
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
  new: "information",
  contacted: "warning",
  qualified: "success",
  proposal: "success",
  won: "success",
  lost: "neutral",
  archived: "neutral",
};

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

export function LeadsTable({ leads }: { leads: AdminLeadRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [bulkDialogOpen, setBulkDialogOpen] = React.useState(false);

  const allSelected = leads.length > 0 && selected.size === leads.length;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map((l) => l.id)));
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

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    setBusy(true);
    setError(null);
    const result = await deleteLeads([...selected]);
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? "Failed to delete leads.");
      return;
    }
    setBulkDialogOpen(false);
    setSelected(new Set());
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onChange={toggleAll}
            label="Select all leads"
          />
          <span className="text-sm text-text-secondary">
            {selected.size === 0
              ? "Select leads to bulk-delete"
              : `${selected.size} of ${leads.length} selected`}
          </span>
        </div>
        <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              disabled={selected.size === 0}
              className="inline-flex items-center gap-2 rounded-button border border-error/40 bg-error-soft px-3.5 py-2 text-xs font-medium text-error transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon />
              Delete selected ({selected.size})
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {selected.size} lead{selected.size === 1 ? "" : "s"}?</DialogTitle>
              <DialogDescription>
                This permanently deletes the selected leads. This action cannot be undone.
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
                onClick={handleDeleteSelected}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-button bg-error px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-60"
              >
                {busy ? "Deleting…" : "Delete leads"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      {leads.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-sm">
          <p className="text-sm text-text-secondary">No leads yet.</p>
          <p className="mt-1 text-sm text-text-muted">Enquiries will appear here.</p>
        </div>
      ) : (
        <div className="touch-pan-x touch-pan-y overscroll-x-contain overflow-x-auto rounded-card border border-card-border bg-card-dark shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-soft/60 text-text-muted">
                <th className="w-10 px-4 py-3">
                  <Checkbox checked={allSelected} onChange={toggleAll} label="Select all" />
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Name</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Email</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Company</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Created</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.18em]">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((l) => (
                <tr
                  key={l.id}
                  className={cn(
                    "transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover",
                    selected.has(l.id) && "bg-primary/5"
                  )}
                >
                  <td className="px-4 py-3.5">
                    <Checkbox
                      checked={selected.has(l.id)}
                      onChange={() => toggleOne(l.id)}
                      label={`Select ${l.name ?? "lead"}`}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/leads/${l.id}`} className="font-medium hover:text-hover">
                      {l.name ?? "Anonymous"}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">{l.email ?? "—"}</td>
                  <td className="px-4 py-3.5">{l.company ?? "—"}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={STATUS_VARIANT[l.status] ?? "neutral"}>{l.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {new Date(l.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/leads/${l.id}`}
                        className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
                      >
                        View
                      </Link>
                      <ConfirmDelete
                        action={deleteLead.bind(null, l.id)}
                        title="Delete lead"
                        description="This will permanently delete this lead."
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M10 11v6" /><path d="M14 11v6" />
    </svg>
  );
}
