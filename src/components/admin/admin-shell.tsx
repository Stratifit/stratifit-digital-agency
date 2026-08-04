"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import type { CurrentAdmin } from "@/actions/auth";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({
  admin,
  children,
}: {
  admin: CurrentAdmin;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-background-deep shadow-xl shadow-black/40 transition-[width,transform] duration-300 ease-[var(--ease-standard)] md:static md:z-auto md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed && "md:w-[76px]"
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar
          admin={admin}
          onOpenMobile={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
        <main className="relative flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
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
    </div>
  );
}
