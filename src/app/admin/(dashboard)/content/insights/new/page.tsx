import { ContentForm } from "@/components/admin/content/content-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default function NewInsightPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="New Insight"
        description="Create a new article or expert insight."
      />
      <FormCard>
        <ContentForm type="insights" />
      </FormCard>
    </div>
  );
}
