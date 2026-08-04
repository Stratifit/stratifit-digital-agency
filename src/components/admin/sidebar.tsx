"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type IconProps = { className?: string };

const icons: Record<string, React.ComponentType<IconProps>> = {
  dashboard: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  sections: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <rect x="3" y="3" width="18" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  services: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </svg>
  ),
  process: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" />
    </svg>
  ),
  why: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3Z" />
    </svg>
  ),
  portfolio: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" />
    </svg>
  ),
  insights: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h6" />
    </svg>
  ),
  testimonials: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v7a3 3 0 0 1-3 3" /><path d="M19 11h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v7a3 3 0 0 1-3 3" />
    </svg>
  ),
  pricing: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M12 2H2v10l9.3 9.3a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8L12 2Z" /><circle cx="7" cy="7" r="1.5" />
    </svg>
  ),
  faq: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.6-3 4" /><path d="M12 17h.01" />
    </svg>
  ),
  knowledge: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  ),
  chat: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
    </svg>
  ),
  "final-cta": (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  leads: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z" />
    </svg>
  ),
  conversations: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
    </svg>
  ),
  email: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  ),
  media: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" />
    </svg>
  ),
  settings: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
  users: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={p.className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const NAV_SECTIONS: {
  label: string;
  items: { href: string; label: string; icon: string }[];
}[] = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content/sections", label: "Sections", icon: "sections" },
      { href: "/admin/content/services", label: "Services", icon: "services" },
      { href: "/admin/content/service-pages", label: "Service Pages", icon: "sections" },
      { href: "/admin/content/process", label: "Process", icon: "process" },
      { href: "/admin/content/why-choose-us", label: "Why Choose Us", icon: "why" },
      { href: "/admin/content/portfolio", label: "Portfolio", icon: "portfolio" },
      { href: "/admin/content/insights", label: "Insights", icon: "insights" },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: "testimonials" },
      { href: "/admin/content/pricing", label: "Pricing", icon: "pricing" },
      { href: "/admin/content/faq", label: "FAQs", icon: "faq" },
      { href: "/admin/content/final-cta", label: "Final CTA", icon: "final-cta" },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/admin/leads", label: "Leads", icon: "leads" },
      { href: "/admin/conversations", label: "Conversations", icon: "conversations" },
      { href: "/admin/email", label: "Email Activity", icon: "email" },
    ],
  },
  {
    label: "Chatbot",
    items: [
      { href: "/admin/content/chatbot/knowledge", label: "Knowledge Base", icon: "knowledge" },
      { href: "/admin/content/chatbot/ai-faq", label: "AI FAQ", icon: "faq" },
      { href: "/admin/content/chatbot/settings", label: "Chatbot Settings", icon: "chat" },
    ],
  },
  {
    label: "Media",
    items: [{ href: "/admin/media", label: "Media", icon: "media" }],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings", label: "Settings", icon: "settings" },
      { href: "/admin/users", label: "Users", icon: "users" },
    ],
  },
];

export function Sidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

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
            <span className="flex size-9 items-center justify-center rounded-card bg-primary font-display text-sm font-black text-text-inverse shadow-shadow-amber">
              ST
            </span>
          ) : (
            <span className="flex items-center gap-2.5 font-display text-base font-extrabold uppercase tracking-tight text-white">
              <span className="flex size-6 items-center justify-center rounded-button bg-primary font-display text-[10px] font-extrabold text-text-inverse shadow-shadow-amber">
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

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Admin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed ? (
              <p className="flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
                <span aria-hidden="true" className="h-px w-4 bg-primary/50" />
                {section.label}
              </p>
            ) : null}
            <ul className="mt-2.5 space-y-1">
              {section.items.map((item) => {
                const Icon = icons[item.icon] ?? icons.dashboard;
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-card px-3 py-2.5 text-sm text-text-secondary transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        collapsed && "md:justify-center md:px-0",
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
                          collapsed && "md:hidden"
                        )}
                      />
                      <Icon
                        className={cn(
                          "size-5 shrink-0 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:text-text-primary",
                          active && "text-primary group-hover:text-primary"
                        )}
                      />
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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

function ShieldIcon({ className }: IconProps) {
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
