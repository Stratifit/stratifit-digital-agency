import { getAdminAiFaqSettings } from "@/features/chat/chat-admin-queries";
import { AiFaqSettingsForm } from "@/components/admin/chatbot/ai-faq-settings-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function AdminAiFaqSettingsPage() {
  const settings = await getAdminAiFaqSettings();

  if (!settings) {
    return (
      <AdminPageHeader
        title="AI FAQ Settings"
        description="No AI FAQ settings record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="AI FAQ Settings"
        description="Suggested questions, categories, and copy for the AI FAQ assistant."
      />
      <FormCard>
        <AiFaqSettingsForm settings={settings} />
      </FormCard>
    </div>
  );
}
