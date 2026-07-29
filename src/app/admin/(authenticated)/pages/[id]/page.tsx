// ============================================================================
// Stratifit — Admin Edit Page
// ============================================================================

import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updatePage, deletePage } from "@/app/admin/(authenticated)/pages/actions";
import { PageForm } from "@/components/admin/PageForm";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPagePage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (!page) {
    notFound();
  }

  async function handleDelete() {
    "use server";
    return deletePage(id);
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-display text-heading-xl text-white mb-1">
        Edit Page
      </h1>
      <p className="font-body text-body-md text-neutral-400 mb-2">
        Editing: <span className="text-white">{page.title}</span>
      </p>
      <code className="inline-block font-body text-caption text-neutral-500 mb-8 bg-surface-darkCard px-3 py-1 rounded-lg border border-surface-darkBorder">
        /{page.slug} — {page.language}
      </code>

      <PageForm
        mode="edit"
        initialData={{
          slug: page.slug,
          title: page.title,
          language: page.language,
          metaTitle: page.meta_title ?? "",
          metaDescription: page.meta_description ?? "",
          published: page.published,
        }}
        onSubmit={async (formData) => {
          "use server";
          return updatePage(id, formData);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
