import { LinkButton } from "@/components/ui/link-button";
import { AdminPageHeader } from "./page-header";

interface AdminListColumn<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface AdminListProps<T> {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  columns: AdminListColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions: (row: T) => React.ReactNode;
}

export function AdminList<T>({
  title,
  description,
  createHref,
  createLabel,
  columns,
  rows,
  rowKey,
  actions,
}: AdminListProps<T>) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          createHref && createLabel ? (
            <LinkButton href={createHref} size="small">
              {createLabel}
            </LinkButton>
          ) : null
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-shadow-sm">
          <p className="text-sm text-text-secondary">No items yet.</p>
          <p className="mt-1 text-sm text-text-muted">
            Create your first item to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-card-border bg-card-dark shadow-shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-soft/60 text-text-muted">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.18em]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-border transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] last:border-0 hover:bg-surface-hover"
                >
                  {columns.map((col) => (
                    <td key={col.header} className="px-4 py-3.5 text-text-primary">
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-right">{actions(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
