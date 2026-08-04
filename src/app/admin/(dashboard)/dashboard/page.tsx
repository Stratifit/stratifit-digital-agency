import { getDashboardStats } from "@/features/dashboard/queries";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const primary = [
    { label: "Leads", value: stats.leads, href: "/admin/leads" },
    {
      label: "Waiting for Admin",
      value: stats.waitingForAdmin,
      href: "/admin/conversations",
    },
    {
      label: "Open Conversations",
      value: stats.openConversations,
      href: "/admin/conversations",
    },
    { label: "Services", value: stats.services, href: "/admin/content/services" },
  ];

  const content = [
    { label: "Portfolio Projects", value: stats.portfolio, href: "/admin/content/portfolio" },
    { label: "Insights", value: stats.insights, href: "/admin/content/insights" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/content/testimonials" },
    { label: "Pricing Plans", value: stats.pricing, href: "/admin/content/pricing" },
    { label: "FAQs", value: stats.faqs, href: "/admin/content/faq" },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Operational overview of the Stratifit platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primary.map((widget) => (
          <Link key={widget.label} href={widget.href} className="group">
            <Card className="p-6 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:border-border-interactive">
              <p className="text-sm text-text-muted">{widget.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-text-primary">
                {widget.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Content
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {content.map((item) => (
            <Link key={item.label} href={item.href} className="group">
              <Card className="p-5 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:border-border-interactive">
                <p className="text-sm text-text-muted">{item.label}</p>
                <p className="mt-2 font-display text-2xl font-bold text-text-primary">
                  {item.value}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
