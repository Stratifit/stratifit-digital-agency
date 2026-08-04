"use client";

import Link from "next/link";
import type { CurrentAdmin } from "@/actions/auth";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
      <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
      <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function getInitials(admin: CurrentAdmin): string {
  if (admin.display_name) {
    const words = admin.display_name.split(/\s+/).filter(Boolean);
    const chars = words.slice(0, 2).map((w) => w[0] ?? "");
    if (chars.length > 0) {
      return chars.join("").toUpperCase();
    }
  }
  return admin.email.slice(0, 1).toUpperCase() || "ST";
}

export function Topbar({
  admin,
  onOpenMobile,
  onToggleCollapse,
}: {
  admin: CurrentAdmin;
  onOpenMobile: () => void;
  onToggleCollapse: () => void;
}) {
  return (
    <header className="relative sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 bg-surface/95 px-4 backdrop-blur-md sm:px-6">
      {/* Amber hairline as the sole divider under the topbar */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation"
          className="flex size-10 shrink-0 items-center justify-center rounded-card text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        >
          <HamburgerIcon />
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="hidden size-10 shrink-0 items-center justify-center rounded-card text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:flex"
        >
          <CollapseIcon />
        </button>

        <div className="ml-1 flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-card border border-primary/25 bg-primary/10 font-display text-xs font-bold text-primary">
            {getInitials(admin)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              {admin.display_name ?? admin.email}
            </p>
            <p className="flex items-center gap-1.5 text-xs capitalize text-text-muted">
              <span className="size-1.5 rounded-full bg-success" />
              {admin.role}
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-button border border-border bg-card-dark px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary/30 hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
        >
          View site
          <ExternalIcon />
        </Link>
        <form action={signOut}>
          <Button type="submit" variant="secondary" size="small">
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  );
}
