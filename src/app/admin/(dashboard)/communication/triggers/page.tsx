import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { getAutomationTriggers } from "@/features/communication/queries";
import { toggleAutomationTrigger } from "@/features/communication/mutations";
import { TRIGGER_EVENT_LABELS } from "@/features/communication/triggers";

export const metadata = {
  title: "Communication — Triggers",
};

export default async function AdminCommunicationTriggersPage() {
  const triggers = await getAutomationTriggers();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Automation Triggers"
        description="When these events happen, the linked template is sent automatically in the customer's language with name/email auto-filled."
      />
      <div className="space-y-3">
        {triggers.length === 0 ? (
          <div className="rounded-card border border-card-border bg-card-dark p-8 text-center text-sm text-text-muted">
            No automation triggers configured.
          </div>
        ) : (
          triggers.map((trigger) => (
            <div
              key={trigger.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {TRIGGER_EVENT_LABELS[trigger.event_type] ?? trigger.event_type}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Sends: {trigger.template_name ?? trigger.template_key}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={trigger.enabled ? "success" : "neutral"}>
                  {trigger.enabled ? "On" : "Off"}
                </Badge>
                <form
                  action={async () => {
                    "use server";
                    await toggleAutomationTrigger({
                      id: trigger.id,
                      enabled: !trigger.enabled,
                    });
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-button border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
                  >
                    {trigger.enabled ? "Turn off" : "Turn on"}
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
