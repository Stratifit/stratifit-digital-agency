"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import type { CurrentAdmin } from "@/actions/auth";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNav } from "./bottom-nav";

export function AdminShell({
  admin,
  children,
}: {
  admin: CurrentAdmin;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  function handleNavigate() {
    setMobileOpen(false);
    setQuery("");
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-overlay backdrop-blur-sm transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Sidebar: off-canvas drawer on mobile, collapsible on md+ */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-[316px] max-w-[88vw] flex-col border-r border-border bg-background-deep shadow-xl shadow-black/40 transition-[width,transform] duration-300 ease-[var(--ease-standard)] md:sticky md:top-0 md:z-auto md:h-screen md:w-[316px] md:max-w-none md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed && !query.trim() && "md:w-[76px]"
        )}
      >
        <Sidebar
          collapsed={collapsed}
          query={query}
          onNavigate={handleNavigate}
        />
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar
          admin={admin}
          query={query}
          onQueryChange={setQuery}
          onOpenMobile={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
        <main className="relative flex-1 overflow-x-hidden p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-8">
          {/* Ambient amber wash — restrained, matching the reference treatment */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[280px] overflow-hidden"
          >
            <div className="absolute left-1/2 top-0 h-[280px] w-[720px] -translate-x-1/2 rounded-full bg-primary/[0.035] blur-[130px]" />
          </div>
          <div className="relative">{children}</div>
        </main>
      </div>

      {/* Mobile primary navigation */}
      <BottomNav onOpenMenu={() => setMobileOpen(true)} />
    </div>
  );
}
