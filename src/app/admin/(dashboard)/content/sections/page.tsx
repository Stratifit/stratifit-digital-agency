import Link from "next/link";
import { getAdminSectionSettings } from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminSectionsPage() {
  const rows = await getAdminSectionSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Section Settings"
        description="Edit the headings (eyebrow, title, highlight, description) shown above each homepage section."
      />

      <div className="overflow-hidden rounded-card border border-card-border bg-card-dark shadow-shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-soft/60">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Section</th>
              <th className="hidden px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted md:table-cell">
                Eyebrow
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Title</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Visible</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.section_key} className="hover:bg-surface-soft/60">
                <td className="px-5 py-3">
                  <span className="font-medium text-text-primary">
                    {row.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-text-muted">
                    {row.section_key}
                  </span>
                </td>
                <td className="hidden px-5 py-3 text-text-secondary md:table-cell">
                  {resolveTranslation(row.eyebrow_translations, "en") || "—"}
                </td>
                <td className="px-5 py-3 text-text-secondary">
                  {resolveTranslation(row.title_translations, "en") || "—"}
                </td>
                <td className="px-5 py-3">
                  {row.is_visible ? (
                    <Badge variant="success">Visible</Badge>
                  ) : (
                    <Badge variant="neutral">Hidden</Badge>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/content/sections/${row.section_key}/edit`}
                    className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
