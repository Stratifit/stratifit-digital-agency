import Link from "next/link";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/ui/brand-logo";

const NAV_SECTIONS: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard" }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content/sections", label: "Sections" },
      { href: "/admin/content/services", label: "Services" },
      { href: "/admin/content/process", label: "Process" },
      { href: "/admin/content/portfolio", label: "Portfolio" },
      { href: "/admin/content/insights", label: "Insights" },
      { href: "/admin/content/testimonials", label: "Testimonials" },
      { href: "/admin/content/pricing", label: "Pricing" },
      { href: "/admin/content/faq", label: "FAQs" },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/conversations", label: "Conversations" },
    ],
  },
  {
    label: "Media",
    items: [{ href: "/admin/media", label: "Media" }],
  },
  {
    label: "Settings",
    items: [{ href: "/admin/settings", label: "Settings" }],
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-background-deep md:block">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link
          href="/admin/dashboard"
          aria-label="Stratifit CMS dashboard"
          className="block w-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BrandLogo alt="Stratifit" />
        </Link>
      </div>
      <nav className="space-y-6 px-3 py-5" aria-label="Admin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-xs font-medium uppercase tracking-wider text-text-muted">
              {section.label}
            </p>
            <ul className="mt-2 space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-radius-sm px-3 py-2 text-sm text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
