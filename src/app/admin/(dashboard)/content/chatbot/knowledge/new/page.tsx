import { KnowledgeForm } from "@/components/admin/chatbot/knowledge-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewKnowledgeEntryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Knowledge Entry"
        description="Add a fact the AI chatbot can answer from."
      />
      <FormCard>
        <KnowledgeForm />
      </FormCard>
    </div>
  );
}
