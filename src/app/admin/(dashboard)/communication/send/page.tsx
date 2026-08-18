import { AdminPageHeader } from "@/components/admin/page-header";
import { CommunicationSendForm } from "@/components/admin/communication-send-form";
import { getEnabledEmailTemplates } from "@/features/communication/queries";
import { getReplyAsAddresses } from "@/features/communication/sender";

export const metadata = {
  title: "Communication — Send Email",
};

export default async function AdminCommunicationSendPage() {
  const templates = await getEnabledEmailTemplates();
  const replyAsAddresses = getReplyAsAddresses();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Send Email"
        description="Pick a template, choose the language and reply-as address, review the auto-filled preview, and send."
      />
      {templates.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center text-sm text-text-muted">
          No enabled templates yet. Enable a template in the library first.
        </div>
      ) : (
        <CommunicationSendForm
          templates={templates}
          replyAsAddresses={replyAsAddresses}
        />
      )}
    </div>
  );
}
