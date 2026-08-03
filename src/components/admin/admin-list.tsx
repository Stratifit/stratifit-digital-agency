import { LinkButton } from "@/components/ui/link-button";

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        {createHref && createLabel ? (
          <LinkButton href={createHref} size="small">
            {createLabel}
          </LinkButton>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-10 text-center">
          <p className="text-sm text-text-secondary">No items yet.</p>
          <p className="mt-1 text-sm text-text-muted">
            Create your first item to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                {columns.map((col) => (
                  <th key={col.header} className="px-4 py-3 font-medium">
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-border last:border-0 hover:bg-surface-hover"
                >
                  {columns.map((col) => (
                    <td key={col.header} className="px-4 py-3 text-text-primary">
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">{actions(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
