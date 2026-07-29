// ============================================================================
// Stratifit — Admin Dashboard Overview
// ============================================================================

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [pageCount, sectionCount, blockCount] = await Promise.all([
    supabase.from("pages").select("*", { count: "exact", head: true }),
    supabase.from("sections").select("*", { count: "exact", head: true }),
    supabase
      .from("content_blocks")
      .select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Total Pages",
      value: pageCount.count ?? 0,
      href: "/admin/pages",
    },
    {
      label: "Total Sections",
      value: sectionCount.count ?? 0,
      href: "/admin/pages",
    },
    {
      label: "Content Blocks",
      value: blockCount.count ?? 0,
      href: "/admin/pages",
    },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="font-display text-heading-xl text-white mb-2">
        Dashboard
      </h1>
      <p className="font-body text-body-md text-neutral-400 mb-8">
        Overview of your CMS content.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-6 hover:border-brand-gold/30 transition-colors group"
          >
            <p className="font-display text-display-sm text-white mb-1 group-hover:text-brand-gold transition-colors">
              {stat.value}
            </p>
            <p className="font-body text-body-sm text-neutral-400">
              {stat.label}
            </p>
          </a>
        ))}
      </div>

      <h2 className="font-display text-heading-lg text-white mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-3">
        <a
          href="/admin/pages/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-surface-dark font-body font-semibold text-body-sm hover:bg-brand-gold-600 transition-colors"
        >
          + Create Page
        </a>
        <a
          href="/admin/pages"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-darkHover text-neutral-200 border border-surface-darkBorder font-body font-semibold text-body-sm hover:bg-surface-darkCard transition-colors"
        >
          View All Pages
        </a>
      </div>
    </div>
  );
}
