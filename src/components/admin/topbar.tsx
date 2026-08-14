"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { CurrentAdmin } from "@/actions/auth";
import { signOut } from "@/actions/auth";
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

function FilledExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-4", className)}>
      <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z" clipRule="evenodd" />
    </svg>
  );
}

function SignOutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-4", className)}>
      <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
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
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-display text-xs font-bold text-primary">
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
              className="absolute right-0 top-full z-[60] mt-2 w-64 overflow-hidden rounded-card-lg border border-white/10 bg-card-dark shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
            >
              <div className="border-b border-white/5 p-3.5">
                <p className="mb-0.5 font-mono text-[10px] text-text-subtle">
                  Signed in as
                </p>
                <p className="truncate text-sm font-medium text-text-primary">
                  {admin.display_name ?? admin.email}
                </p>
              </div>
              <nav className="flex flex-col gap-0.5 p-1.5">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-button px-3 py-2.5 text-[13px] text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <FilledExternalIcon className="text-primary" />
                  View Live Site
                </Link>
                <div className="my-0.5 h-px bg-white/5" />
                <form action={signOut} onSubmit={() => setMenuOpen(false)}>
                  <button
                    type="submit"
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-button px-3 py-2.5 text-left text-[13px] font-bold text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <SignOutIcon />
                    Sign out
                  </button>
                </form>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
