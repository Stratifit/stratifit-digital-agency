import Link from "next/link";
import { getAdminServicePages } from "@/features/service-pages/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Service Pages — Stratifit CMS" };

export default async function ServicePagesAdminPage() {
  const pages = await getAdminServicePages();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Service Pages"
        description="Dedicated landing pages for each service. Edit content and publish."
      />

      {pages.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-text-secondary">No service pages yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.id} className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate font-display text-lg font-bold text-text-primary">
                  {(page.hero_title_translations as Record<string, string> | null)?.en ?? page.slug}
                </h2>
                <Badge variant={page.is_visible ? "success" : "neutral"}>
                  {page.is_visible ? "Visible" : "Hidden"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-text-muted">/{page.slug}</p>
              <Link
                href={`/admin/content/service-pages/${page.slug}/edit`}
                className="mt-4 inline-flex rounded-sm bg-primary px-3 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-bright"
              >
                Edit Page
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
