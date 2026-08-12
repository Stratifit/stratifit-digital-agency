"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { CurrentAdmin } from "@/actions/auth";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { getNavLabel } from "./nav-data";

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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className ?? "size-4"}>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className ?? "size-4"}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className ?? "size-4"}>
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
  query,
  onQueryChange,
  onOpenMobile,
  onToggleCollapse,
}: {
  admin: CurrentAdmin;
  query: string;
  onQueryChange: (q: string) => void;
  onOpenMobile: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  const title = getNavLabel(pathname) ?? "Admin";

  // Close the user menu on outside click or Escape.
  React.useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // ⌘K / Ctrl+K focuses the search box.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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

        {/* Page context: breadcrumb on desktop, plain title on mobile */}
        <div className="ml-1 hidden min-w-0 flex-col md:flex">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-text-subtle">
            Admin
          </p>
          <p className="truncate font-display text-sm font-bold text-text-primary">
            {title}
          </p>
        </div>
        <div className="ml-1 min-w-0 md:hidden">
          <p className="truncate font-display text-sm font-bold text-text-primary">
            {title}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 justify-end">
        {/* Nav search — filters the sidebar; desktop only to keep mobile clean */}
        <div className="relative hidden w-full max-w-xs lg:block">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search pages…"
            aria-label="Search admin pages"
            className="h-9 w-full rounded-button border border-border bg-background pl-9 pr-12 text-sm text-text-primary placeholder:text-text-subtle transition-colors hover:border-border-strong focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
          <kbd
            suppressHydrationWarning
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xs border border-border bg-surface-soft px-1.5 py-0.5 font-mono text-[10px] text-text-subtle"
          >
            {isMac ? "⌘K" : "Ctrl K"}
          </kbd>
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

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
            className={cn(
              "flex items-center gap-2 rounded-card border border-transparent py-1 pl-1 pr-1.5 text-left transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              menuOpen && "bg-surface-hover"
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-card border border-primary/25 bg-primary/10 font-display text-xs font-bold text-primary">
              {getInitials(admin)}
            </span>
            <span className="hidden min-w-0 lg:block">
              <span className="block max-w-[160px] truncate text-sm font-medium text-text-primary">
                {admin.display_name ?? admin.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs capitalize text-text-muted">
                <span className="size-1.5 rounded-full bg-success" />
                {admin.role}
              </span>
            </span>
            <ChevronIcon className="hidden text-text-subtle lg:block" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] w-60 rounded-card border border-border bg-surface-elevated p-1.5 shadow-lg"
            >
              <div className="border-b border-border px-3 py-2.5">
                <p className="truncate text-sm font-medium text-text-primary">
                  {admin.display_name ?? "Admin"}
                </p>
                <p className="truncate text-xs text-text-muted">{admin.email}</p>
              </div>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="flex items-center gap-2.5 rounded-card px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ExternalIcon className="text-text-subtle" />
                View public site
              </Link>
              <form
                action={signOut}
                className="pt-1"
                onSubmit={() => setMenuOpen(false)}
              >
                <Button type="submit" variant="secondary" size="small" className="w-full">
                  Sign Out
                </Button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
