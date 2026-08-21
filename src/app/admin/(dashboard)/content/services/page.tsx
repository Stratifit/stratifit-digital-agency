import Link from "next/link";
import { getAdminServices } from "@/features/services/admin-queries";
import { deleteService } from "@/features/services/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { SectionSettingsForm } from "@/components/admin/section-settings-form";
import { getAdminSectionSetting } from "@/features/section-settings/queries";
import { getDefaultAdminSectionSetting } from "@/features/section-settings/defaults";
import { Badge } from "@/components/ui/badge";

export default async function AdminServicesPage() {
  const [services, headerSettings] = await Promise.all([
    getAdminServices(),
    getAdminSectionSetting("services").then(
      (existing) => existing ?? getDefaultAdminSectionSetting("services")
    ),
  ]);

  return (
    <AdminList
      title="Services"
      description="Manage the core service offerings."
      createHref="/admin/content/services/new"
      createLabel="New Service"
      rows={services}
      rowKey={(s) => s.slug}
      columns={[
        {
          header: "Title",
          render: (s) => (
            <Link
              href={`/admin/content/services/${s.slug}/edit`}
              className="font-medium hover:text-hover"
            >
              {resolveTranslation(s.title_translations, "en") || s.slug}
            </Link>
          ),
        },
        { header: "Slug", render: (s) => <code className="text-text-muted">{s.slug}</code> },
        {
          header: "Status",
          render: (s) => (
            <Badge
              variant={
                s.status === "published"
                  ? "success"
                  : s.status === "draft"
                    ? "warning"
                    : "neutral"
              }
            >
              {s.status}
            </Badge>
          ),
        },
        { header: "Visible", render: (s) => (s.is_visible ? "Yes" : "No") },
        { header: "Order", render: (s) => s.display_order },
      ]}
      actions={(s) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/services/${s.slug}/edit`}
            className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteService.bind(null, s.slug)}
            title="Delete service"
            description={`This will permanently delete "${s.slug}".`}
          />
        </div>
      )}
    >
      {/* Section header editor — the eyebrow/title/highlight/description shown
          above the services on the public site (section_settings row). */}
      {headerSettings ? (
        <details className="group overflow-hidden rounded-card border border-card-border bg-card-dark shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface-hover focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                Section Header
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Eyebrow, title, amber highlight, and description shown above the
                services.
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-4 shrink-0 text-text-muted transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-open:rotate-180"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="border-t border-white/5 p-5">
            <SectionSettingsForm settings={headerSettings} />
          </div>
        </details>
      ) : null}
    </AdminList>
  );
}
