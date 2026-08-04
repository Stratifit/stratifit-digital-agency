"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { icons, MOBILE_PRIMARY_NAV } from "./nav-data";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-5">
      <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
    </svg>
  );
}

export function BottomNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="flex h-16 items-stretch">
        {MOBILE_PRIMARY_NAV.map((item) => {
          const Icon = icons[item.icon] ?? icons.dashboard;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                active ? "text-primary" : "hover:text-text-primary"
              )}
            >
              <Icon className={cn("size-5 transition-colors", active && "text-primary")} />
              <span className="truncate">{item.label}</span>
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-8 rounded-b-full bg-primary"
                />
              ) : null}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open full navigation"
          className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        >
          <MenuIcon />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
}
