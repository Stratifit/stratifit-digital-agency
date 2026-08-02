import { notFound } from "next/navigation";
import { getAdminSectionSetting } from "@/features/section-settings/queries";
import { SectionSettingsForm } from "@/components/admin/section-settings-form";

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
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {settings.section_key}
        </p>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Edit {settings.label}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Update the heading shown above this section on the public website.
        </p>
      </div>
      <div className="rounded-md border border-border bg-surface p-6">
        <SectionSettingsForm settings={settings} />
      </div>
    </div>
  );
}
