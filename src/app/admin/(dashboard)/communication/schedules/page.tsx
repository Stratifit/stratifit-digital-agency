import { AdminPageHeader } from "@/components/admin/page-header";
import { CommunicationScheduleForm } from "@/components/admin/communication-schedule-form";
import { Badge } from "@/components/ui/badge";
import { getEmailSchedules } from "@/features/communication/queries";
import { getEnabledEmailTemplates } from "@/features/communication/queries";
import { templateLabel } from "@/features/communication/queries";
import { cancelEmailSchedule } from "@/features/communication/mutations";

const STATUS_VARIANT: Record<
  string,
  "neutral" | "success" | "warning" | "error" | "information"
> = {
  pending: "information",
  sent: "success",
  failed: "error",
  cancelled: "neutral",
};

export const metadata = {
  title: "Communication — Schedules",
};

export default async function AdminCommunicationSchedulesPage() {
  const [schedules, templates] = await Promise.all([
    getEmailSchedules(),
    getEnabledEmailTemplates(),
  ]);

  const templateName = (key: string) => {
    const template = templates.find((t) => t.key === key);
    return template ? templateLabel(template) : key;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Email Schedules"
        description="Send a template automatically at a chosen time. A scheduler marks due emails as sent when it runs."
      />
      <CommunicationScheduleForm templates={templates} />
      <div className="space-y-3">
        {schedules.length === 0 ? (
          <div className="rounded-card border border-card-border bg-card-dark p-8 text-center text-sm text-text-muted">
            No scheduled emails yet.
          </div>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {templateName(schedule.template_key)}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {schedule.recipient_email}
                  {schedule.recipient_name
                    ? ` · ${schedule.recipient_name}`
                    : ""}{" "}
                  · {schedule.language.toUpperCase()} ·{" "}
                  {new Date(schedule.send_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[schedule.status] ?? "neutral"}>
                  {schedule.status}
                </Badge>
                {schedule.status === "pending" ? (
                  <form
                    action={async () => {
                      "use server";
                      await cancelEmailSchedule(schedule.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-button border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-error/40 hover:text-error"
                    >
                      Cancel
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
