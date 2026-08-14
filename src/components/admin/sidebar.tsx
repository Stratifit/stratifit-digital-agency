"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { icons, NAV_SECTIONS, type NavIconProps } from "./nav-data";

function ShieldIcon({ className }: NavIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function sectionForPath(pathname: string): string {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return section.label;
      }
    }
  }
  return NAV_SECTIONS[0]?.label ?? "Overview";
}

function NavItemLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = icons[icon] ?? icons.dashboard;
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-card px-3 py-2 text-sm text-text-secondary transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          active
            ? "bg-primary/10 font-medium text-primary hover:bg-primary/10 hover:text-primary"
            : "border border-transparent"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary opacity-0 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:opacity-40",
            active && "opacity-100 group-hover:opacity-100"
          )}
        />
        <Icon
          className={cn(
            "size-[18px] shrink-0 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:text-text-primary",
            active && "text-primary group-hover:text-primary"
          )}
        />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}

export function Sidebar({
  collapsed,
  query = "",
  onNavigate,
}: {
  collapsed: boolean;
  query?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [openSection, setOpenSection] = React.useState<string>(() =>
    sectionForPath(pathname)
  );

  // Keep the flyout on the section that owns the current route. Adjusting state
  // during render (guarded by the previous pathname) avoids a sync effect.
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenSection(sectionForPath(pathname));
  }

  const q = query.trim().toLowerCase();
  const activeSection = sectionForPath(pathname);

  const filteredSections = q
    ? NAV_SECTIONS.map((s) => ({
        label: s.label,
        items: s.items.filter((i) => i.label.toLowerCase().includes(q)),
      })).filter((s) => s.items.length > 0)
    : null;

  const open = filteredSections
    ? null
    : NAV_SECTIONS.find((s) => s.label === openSection) ?? NAV_SECTIONS[0];

  return (
    <div className="flex h-full w-full">
      {/* Icon rail */}
      <div className="flex w-[76px] shrink-0 flex-col border-r border-border bg-background-deep">
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-border">
          <Link
            href="/admin/dashboard"
            aria-label="Stratifit CMS dashboard"
            onClick={onNavigate}
            className="flex size-10 items-center justify-center rounded-card bg-primary font-display text-sm font-black text-text-inverse shadow-amber transition-transform duration-[var(--motion-fast)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            ST
          </Link>
        </div>

        <nav aria-label="Admin" className="min-h-0 flex-1 space-y-1 overflow-y-auto py-3">
          {NAV_SECTIONS.map((section) => {
            const Icon = icons[section.icon] ?? icons.dashboard;
            const active = section.label === activeSection;
            const isOpen = !filteredSections && section.label === openSection;
            return (
              <div key={section.label} className="flex justify-center">
                <button
                  type="button"
                  title={section.label}
                  aria-label={section.label}
                  aria-current={active ? "true" : undefined}
                  onClick={() => setOpenSection(section.label)}
                  onMouseEnter={() => setOpenSection(section.label)}
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-card text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    (active || isOpen) && "bg-primary/10 text-primary"
                  )}
                >
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                    />
                  ) : null}
                  <Icon className="size-5" />
                </button>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-border py-3 text-center">
          <ShieldIcon className="mx-auto size-4 text-primary" />
        </div>
      </div>

      {/* Flyout panel */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col border-r border-border bg-background-deep",
          collapsed && !q && "md:hidden"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="flex items-baseline gap-1.5 font-display text-base font-extrabold uppercase tracking-tight text-white">
            Stratifit
            <span className="text-[9px] font-bold tracking-[0.3em] text-primary">CMS</span>
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {filteredSections ? (
            <>
              <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
                Results for “{query.trim()}”
              </p>
              {filteredSections.map((section) => (
                <div key={section.label} className="mb-4">
                  <p className="mb-1.5 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
                    <span aria-hidden="true" className="h-px w-3 bg-primary/50" />
                    {section.label}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => (
                      <NavItemLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </ul>
                </div>
              ))}
              {filteredSections.length === 0 ? (
                <p className="px-2 text-sm text-text-muted">No matches found.</p>
              ) : null}
            </>
          ) : open ? (
            <div>
              <p className="mb-1.5 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
                <span aria-hidden="true" className="h-px w-3 bg-primary/50" />
                {open.label}
              </p>
              <ul className="space-y-0.5">
                {open.items.map((item) => (
                  <NavItemLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-border px-4 py-3">
          <p className="flex items-center gap-2 font-mono text-[10px] text-text-subtle">
            <ShieldIcon className="size-3 text-primary" />
            Built by Stratifit
          </p>
        </div>
      </div>
    </div>
  );
}
