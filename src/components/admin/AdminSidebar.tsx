// ============================================================================
// Stratifit — Admin Sidebar
// ============================================================================

import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "◉" },
  { label: "Pages", href: "/admin/pages", icon: "⊞" },
  { label: "Announcement Bar", href: "/admin/announcement-bar", icon: "📢" },
  { label: "Navigation Header", href: "/admin/navigation-header", icon: "☰" },
  { label: "Hero Section", href: "/admin/hero", icon: "★" },
  { label: "Services Section", href: "/admin/services", icon: "◆" },
  { label: "How We Work", href: "/admin/how-we-work", icon: "→" },
  { label: "Why Us", href: "/admin/why-us", icon: "★" },
  { label: "Insights", href: "/admin/insights", icon: "◆" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "◈" },
  { label: "Acquisition", href: "/admin/acquisition", icon: "◇" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "★" },
  { label: "Pricing", href: "/admin/pricing", icon: "$" },
  { label: "FAQ", href: "/admin/faq", icon: "?" },
  { label: "Media", href: "/admin/media", icon: "▣" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
] as const;

export function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-surface-darkAlt border-r border-surface-darkBorder flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-surface-darkBorder">
        <Link href="/admin" className="select-none">
          <Image
            src="/stratifit-logo.png"
            alt="Stratifit"
            width={40}
            height={40}
            className="h-10 w-auto rounded-md object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-body-md text-neutral-400 hover:text-white hover:bg-surface-darkHover transition-colors duration-fast"
          >
            <span className="text-lg w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-surface-darkBorder">
        <p className="font-body text-caption text-neutral-600">
          &copy; {new Date().getFullYear()} Stratifit
        </p>
      </div>
    </aside>
  );
}
