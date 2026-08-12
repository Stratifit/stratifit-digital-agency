import { getDashboardStats } from "@/features/dashboard/queries";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { icons } from "@/components/admin/nav-data";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const kpis = [
    {
      label: "Leads",
      value: stats.leads,
      href: "/admin/leads",
      icon: "leads",
      hint: "New enquiries",
    },
    {
      label: "Waiting for Admin",
      value: stats.waitingForAdmin,
      href: "/admin/conversations",
      icon: "conversations",
      hint: "Needs your reply",
      accent: true,
    },
    {
      label: "Open Conversations",
      value: stats.openConversations,
      href: "/admin/conversations",
      icon: "chat",
      hint: "In progress",
    },
    {
      label: "Services",
      value: stats.services,
      href: "/admin/content/services",
      icon: "services",
      hint: "On the website",
    },
  ];

  const quickActions = [
    {
      label: "Edit Hero",
      href: "/admin/content/hero",
      icon: "hero",
      hint: "Headline, CTAs, stats",
    },
    {
      label: "Announcement",
      href: "/admin/content/announcement",
      icon: "faq",
      hint: "Rotating site message",
    },
    {
      label: "Media Library",
      href: "/admin/media",
      icon: "media",
      hint: "Uploads & assets",
    },
    {
      label: "Chatbot Settings",
      href: "/admin/content/chatbot/settings",
      icon: "chat",
      hint: "Assistant behaviour",
    },
  ];

  const content = [
    { label: "Portfolio Projects", value: stats.portfolio, href: "/admin/content/portfolio", icon: "portfolio" },
    { label: "Insights", value: stats.insights, href: "/admin/content/insights", icon: "insights" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/content/testimonials", icon: "testimonials" },
    { label: "Pricing Plans", value: stats.pricing, href: "/admin/content/pricing", icon: "pricing" },
    { label: "FAQs", value: stats.faqs, href: "/admin/content/faq", icon: "faq" },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A snapshot of what needs your attention across the Stratifit platform."
        actions={
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-button border border-border bg-card-dark px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary/30 hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View site
          </Link>
        }
      />

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = icons[kpi.icon] ?? icons.dashboard;
          return (
            <Link
              key={kpi.label}
              href={kpi.href}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Card className="h-full p-5 group-hover:border-border-interactive">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-text-muted">{kpi.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary">
                      {kpi.value}
                    </p>
                    <p className="mt-1 text-xs text-text-subtle">{kpi.hint}</p>
                  </div>
                  <span
                    className={
                      kpi.accent
                        ? "flex size-10 shrink-0 items-center justify-center rounded-card bg-primary/15 text-primary shadow-amber"
                        : "flex size-10 shrink-0 items-center justify-center rounded-card border border-border bg-surface-soft text-text-secondary"
                    }
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Attention band */}
      {stats.waitingForAdmin > 0 ? (
        <Link
          href="/admin/conversations"
          className="group block rounded-card-lg border border-primary/25 bg-surface-elevated p-5 shadow-amber transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-card bg-primary/15 text-primary">
                <icons.conversations className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-text-primary">
                  {stats.waitingForAdmin}{" "}
                  {stats.waitingForAdmin === 1 ? "conversation" : "conversations"} waiting for you
                </p>
                <p className="text-xs text-text-muted">
                  Visitors are waiting for a human response.
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary-light">
              Open inbox →
            </span>
          </div>
        </Link>
      ) : null}

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary">Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = icons[item.icon] ?? icons.dashboard;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Card className="h-full p-5 group-hover:border-border-interactive">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-card border border-border bg-surface-soft text-text-secondary transition-colors group-hover:border-primary/30 group-hover:text-primary">
                      <Icon className="size-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="mt-0.5 truncate text-xs text-text-muted">{item.hint}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content overview */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary">Content</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {content.map((item) => {
            const Icon = icons[item.icon] ?? icons.dashboard;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Card className="h-full p-5 group-hover:border-border-interactive">
                  <span className="flex size-9 items-center justify-center rounded-card border border-border bg-surface-soft text-text-secondary transition-colors group-hover:border-primary/30 group-hover:text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <p className="mt-4 font-display text-2xl font-bold tracking-tight text-text-primary">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{item.label}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
