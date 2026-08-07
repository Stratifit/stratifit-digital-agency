import Link from "next/link";
import { getAdminDetailPages } from "@/features/detail-pages/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Pages — Stratifit CMS" };

export default async function PagesAdminPage() {
  const pages = await getAdminDetailPages();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pages"
        description="Detail pages such as Privacy Policy, Terms, Cookie Policy, Imprint, and Careers. Edit content in any language."
      />

      {pages.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-text-secondary">No detail pages yet.</p>
          <p className="mt-1 text-sm text-text-muted">
            Run the database seed to create the standard pages.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.slug} className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate font-display text-lg font-bold text-text-primary">
                  {resolveTranslation(page.title_translations, "en") || page.slug}
                </h2>
                <Badge variant={page.is_visible ? "success" : "neutral"}>
                  {page.is_visible ? "Visible" : "Hidden"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-text-muted">/{page.slug}</p>
              <Link
                href={`/admin/content/pages/${page.slug}/edit`}
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
