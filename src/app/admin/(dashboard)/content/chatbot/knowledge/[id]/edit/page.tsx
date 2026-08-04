import { notFound } from "next/navigation";
import { KnowledgeForm } from "@/components/admin/chatbot/knowledge-form";
import { getAdminKnowledgeEntry } from "@/features/chat/chat-admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function EditKnowledgeEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getAdminKnowledgeEntry(id);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Edit Knowledge Entry"
        description="Update this entry and the AI chatbot will use the latest facts."
      />
      <FormCard>
        <KnowledgeForm entry={entry} />
      </FormCard>
    </div>
  );
}
