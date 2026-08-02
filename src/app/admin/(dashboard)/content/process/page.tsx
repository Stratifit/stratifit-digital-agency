import Link from "next/link";
import { getAdminProcessSteps } from "@/features/process/admin-queries";
import { deleteProcessStep } from "@/features/process/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";
import { ProcessIcon } from "@/components/ui/process-icon";

export default async function AdminProcessStepsPage() {
  const rows = await getAdminProcessSteps();

  return (
    <AdminList
      title="Process Steps"
      description="Manage the steps shown in the How We Work section."
      createHref="/admin/content/process/new"
      createLabel="New Step"
      rows={rows}
      rowKey={(r) => r.step_key}
      columns={[
        {
          header: "Step",
          render: (r) => (
            <span className="flex items-center gap-2 font-medium">
              <span className="flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <ProcessIcon name={r.icon_name} className="size-4 text-primary" />
              </span>
              {resolveTranslation(r.title_translations, "en") || r.step_key}
            </span>
          ),
        },
        { header: "Number", render: (r) => r.number },
        {
          header: "Visible",
          render: (r) =>
            r.is_visible ? (
              <Badge variant="success">Visible</Badge>
            ) : (
              <Badge variant="neutral">Hidden</Badge>
            ),
        },
      ]}
      actions={(r) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/process/${r.step_key}/edit`}
            className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteProcessStep.bind(null, r.step_key)}
            title="Delete process step"
            description={`This will permanently delete "${r.title_translations?.en ?? r.step_key}".`}
          />
        </div>
      )}
    />
  );
}
