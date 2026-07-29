// ============================================================================
// Stratifit — Admin Pages List
// ============================================================================

import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPagesListPage() {
  const supabase = await createSupabaseServerClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("updated_at", { ascending: false });

  const LANGUAGE_LABELS: Record<string, string> = {
    en: "EN",
    fr: "FR",
    de: "DE",
    es: "ES",
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-heading-xl text-white mb-1">
            Pages
          </h1>
          <p className="font-body text-body-md text-neutral-400">
            Manage all CMS pages across languages.
          </p>
        </div>
        <Link
          href="/admin/pages/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-surface-dark font-body font-semibold text-body-sm hover:bg-brand-gold-600 transition-colors"
        >
          + New Page
        </Link>
      </div>

      {!pages || pages.length === 0 ? (
        <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-12 text-center">
          <p className="font-body text-body-lg text-neutral-400 mb-4">
            No pages yet.
          </p>
          <Link
            href="/admin/pages/create"
            className="text-brand-gold font-body font-semibold text-body-md hover:underline"
          >
            Create your first page
          </Link>
        </div>
      ) : (
        <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-darkBorder">
                <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-6 py-3">
                  Title
                </th>
                <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-6 py-3">
                  Slug
                </th>
                <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-6 py-3">
                  Lang
                </th>
                <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-right font-body text-caption text-neutral-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-surface-darkBorder last:border-b-0 hover:bg-surface-darkHover/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="font-body text-body-md text-white hover:text-brand-gold transition-colors"
                    >
                      {page.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <code className="font-body text-body-sm text-neutral-400">
                      /{page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-surface-darkHover text-caption font-semibold text-neutral-300 uppercase">
                      {LANGUAGE_LABELS[page.language] ?? page.language}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {page.published ? (
                      <span className="inline-flex items-center gap-1.5 text-body-sm text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="font-body text-body-sm text-brand-gold hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
