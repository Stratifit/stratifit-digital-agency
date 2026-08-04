import { notFound } from "next/navigation";
import { getAdminSectionSetting } from "@/features/section-settings/queries";
import { SectionSettingsForm } from "@/components/admin/section-settings-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function EditSectionSettingsPage({
  params,
}: {
  params: Promise<{ sectionKey: string }>;
}) {
  const { sectionKey } = await params;
  const settings = await getAdminSectionSetting(sectionKey);
  if (!settings) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        eyebrow={settings.section_key}
        title={`Edit ${settings.label}`}
        description="Update the heading shown above this section on the public website."
      />
      <FormCard>
        <SectionSettingsForm settings={settings} />
      </FormCard>
    </div>
  );
}
