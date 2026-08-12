"use client";

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

  const q = query.trim().toLowerCase();
  const sections = q
    ? NAV_SECTIONS.map((s) => ({
        label: s.label,
        items: s.items.filter((i) => i.label.toLowerCase().includes(q)),
      })).filter((s) => s.items.length > 0)
    : NAV_SECTIONS;

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border px-4",
          collapsed && "md:justify-center md:px-0"
        )}
      >
        <Link
          href="/admin/dashboard"
          aria-label="Stratifit CMS dashboard"
          onClick={onNavigate}
          className="block w-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:w-auto"
        >
          {collapsed ? (
            <span className="flex size-9 items-center justify-center rounded-card bg-primary font-display text-sm font-black text-text-inverse shadow-amber">
              ST
            </span>
          ) : (
            <span className="flex items-center gap-2.5 font-display text-base font-extrabold uppercase tracking-tight text-white">
              <span className="flex size-6 items-center justify-center rounded-button bg-primary font-display text-[10px] font-extrabold text-text-inverse shadow-amber">
                ST
              </span>
              <span className="flex items-baseline gap-1.5">
                Stratifit
                <span className="hidden text-[9px] font-bold tracking-[0.3em] text-primary lg:inline">CMS</span>
              </span>
            </span>
          )}
        </Link>
      </div>

      <nav
        className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
        aria-label="Admin"
      >
        {q ? (
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
            Results for “{query.trim()}”
          </p>
        ) : null}

        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed || q ? (
              <p className="flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
                <span aria-hidden="true" className="h-px w-4 bg-primary/50" />
                {q ? `in ${section.label}` : section.label}
              </p>
            ) : null}
            <ul className="mt-2.5 space-y-1">
              {section.items.map((item) => {
                const Icon = icons[item.icon] ?? icons.dashboard;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-card px-3 py-2.5 text-sm text-text-secondary transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        collapsed && !q && "md:justify-center md:px-0",
                        active
                          ? "bg-primary/10 font-medium text-primary hover:bg-primary/10 hover:text-primary"
                          : "border border-transparent"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary opacity-0 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:opacity-40",
                          active && "opacity-100 group-hover:opacity-100",
                          collapsed && !q && "md:hidden"
                        )}
                      />
                      <Icon
                        className={cn(
                          "size-5 shrink-0 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:text-text-primary",
                          active && "text-primary group-hover:text-primary"
                        )}
                      />
                      {!collapsed || q ? <span className="truncate">{item.label}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {sections.length === 0 ? (
          <p className="px-3 text-sm text-text-muted">No matches found.</p>
        ) : null}
      </nav>

      {/* Sidebar footer */}
      <div className="shrink-0 border-t border-border px-4 py-4">
        {collapsed ? (
          <span className="block text-center font-display text-xs font-black text-primary">
            ST
          </span>
        ) : (
          <p className="flex items-center gap-2 font-mono text-[10px] text-text-subtle">
            <ShieldIcon className="size-3 text-primary" />
            Built by Stratifit
          </p>
        )}
      </div>
    </>
  );
}
