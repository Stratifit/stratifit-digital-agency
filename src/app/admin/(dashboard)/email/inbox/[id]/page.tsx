import { notFound } from "next/navigation";
import { getEmailThreadDetail } from "@/features/email-inbox/queries";
import { getEnabledEmailTemplates } from "@/features/email-inbox/template-queries";
import { getSenderAddresses } from "@/features/communication/sender-addresses";
import { EmailThreadDetailView } from "@/components/admin/email-thread-detail";

export const metadata = {
  title: "Email Thread",
};

export default async function AdminEmailThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = await getEmailThreadDetail(id);

  if (!thread) {
    notFound();
  }

  // Enabled templates power the "Insert template" picker in the reply
  // composer, so manual templates can be sent straight from a conversation.
  const templates = await getEnabledEmailTemplates();

  // Sender addresses power the "Reply as" picker in the composer.
  const replyAsAddresses = await getSenderAddresses();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <EmailThreadDetailView
        thread={thread}
        templates={templates}
        replyAsAddresses={replyAsAddresses}
      />
    </div>
  );
}
