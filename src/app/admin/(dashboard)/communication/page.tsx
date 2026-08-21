import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailConfigStatus } from "@/components/admin/email-config-status";
import { SmtpConnectionProbe } from "@/components/admin/smtp-connection-probe";
import { getEmailLogs, getEmailSchedules } from "@/features/communication/queries";
import { getEmailTemplatesForAdmin } from "@/features/communication/queries";
import { getEmailConfigStatus } from "@/features/communication/sender";

export const metadata = {
  title: "Communication",
};

export default async function AdminCommunicationPage() {
  const [templates, logs, schedules] = await Promise.all([
    getEmailTemplatesForAdmin(),
    getEmailLogs(5),
    getEmailSchedules(),
  ]);

  const configStatus = getEmailConfigStatus();

  const autoCount = templates.filter((t) => t.template_type === "auto").length;
  const manualCount = templates.filter((t) => t.template_type === "manual").length;
  const pendingSchedules = schedules.filter((s) => s.status === "pending").length;

  const cards = [
    {
      href: "/admin/communication/templates",
      title: "Templates",
      value: `${autoCount} auto · ${manualCount} manual`,
      description: "Edit automatic replies and manual templates in all 4 languages.",
    },
    {
      href: "/admin/communication/send",
      title: "Send Email",
      value: "Composer",
      description: "Send a template with reply-as and auto-filled values.",
    },
    {
      href: "/admin/communication/schedules",
      title: "Schedules",
      value: `${pendingSchedules} pending`,
      description: "Plan template emails to send at a chosen time.",
    },
    {
      href: "/admin/communication/triggers",
      title: "Triggers",
      value: "Automation",
      description: "Connect events (leads, payments, projects) to templates.",
    },
    {
      href: "/admin/communication/logs",
      title: "Email Logs",
      value: `${logs.length} recent`,
      description: "Delivery status for every email sent.",
    },
    {
      href: "/admin/email/inbox",
      title: "Email Inbox",
      value: "Conversations",
      description: "Customer emails and form enquiries, with reply-by-email.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="Communication"
        description="One place for every customer email: multilingual templates, automatic replies, manual sends, schedules, and automation triggers."
      />
      <EmailConfigStatus status={configStatus} />
      <SmtpConnectionProbe />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-card border border-card-border bg-card-dark p-5 shadow-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {card.title}
            </p>
            <p className="mt-2 text-lg font-bold text-text-primary group-hover:text-primary">
              {card.value}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
