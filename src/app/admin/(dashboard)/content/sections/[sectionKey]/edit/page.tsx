import { notFound } from "next/navigation";
import { getAdminSectionSetting } from "@/features/section-settings/queries";
import { getDefaultAdminSectionSetting } from "@/features/section-settings/defaults";
import { SectionSettingsForm } from "@/components/admin/section-settings-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function EditSectionSettingsPage({
  params,
}: {
  params: Promise<{ sectionKey: string }>;
}) {
  const { sectionKey } = await params;
  const existing = await getAdminSectionSetting(sectionKey);
  const settings = existing ?? getDefaultAdminSectionSetting(sectionKey);
  if (!settings) notFound();

  const isCreate = !existing;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        eyebrow={settings.section_key}
        title={`Edit ${settings.label}`}
        description={
          isCreate
            ? "This section isn't set up yet — the form is pre-filled with the default content. Saving will create it on the website."
            : "Update the heading shown above this section on the public website."
        }
      />
      <FormCard>
        <SectionSettingsForm settings={settings} />
      </FormCard>
    </div>
  );
}
