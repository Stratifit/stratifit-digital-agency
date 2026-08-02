import Link from "next/link";
import { getAdminSectionSettings } from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Badge } from "@/components/ui/badge";

export default async function AdminSectionsPage() {
  const rows = await getAdminSectionSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Section Settings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Edit the headings (eyebrow, title, highlight, description) shown above
          each homepage section.
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-soft">
            <tr>
              <th className="px-5 py-3 font-medium text-text-muted">Section</th>
              <th className="hidden px-5 py-3 font-medium text-text-muted md:table-cell">
                Eyebrow
              </th>
              <th className="px-5 py-3 font-medium text-text-muted">Title</th>
              <th className="px-5 py-3 font-medium text-text-muted">Visible</th>
              <th className="px-5 py-3 text-right font-medium text-text-muted">
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
