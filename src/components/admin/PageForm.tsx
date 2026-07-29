// ============================================================================
// Stratifit — Admin Page Form (Shared between create and edit)
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/admin/ui/Input";
import { Select } from "@/components/admin/ui/Select";
import { Toggle } from "@/components/admin/ui/Toggle";
import { Button } from "@/components/admin/ui/Button";

type ActionResult = { error: string } | { success: true };

interface PageFormData {
  slug: string;
  title: string;
  language: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
}

interface PageFormProps {
  mode: "create" | "edit";
  initialData?: PageFormData;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
  onDelete?: () => Promise<ActionResult>;
}

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
];

export function PageForm({
  mode,
  initialData,
  onSubmit,
  onDelete,
}: PageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PageFormData>(
    initialData ?? {
      slug: "",
      title: "",
      language: "en",
      metaTitle: "",
      metaDescription: "",
      published: false,
    }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("slug", data.slug);
    formData.set("title", data.title);
    formData.set("language", data.language);
    formData.set("metaTitle", data.metaTitle);
    formData.set("metaDescription", data.metaDescription);
    formData.set("published", String(data.published));

    startTransition(async () => {
      const result = await onSubmit(formData);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/admin/pages");
        router.refresh();
      }
    });
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this page? This will also remove all sections and blocks."
      )
    )
      return;

    setDeleting(true);
    setError(null);

    const result = await onDelete();
    if ("error" in result) {
      setError(result.error);
      setDeleting(false);
    } else {
      router.push("/admin/pages");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-900/20 border border-red-800/30 text-red-400 font-body text-body-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Slug"
          value={data.slug}
          onChange={(e) => setData({ ...data, slug: e.target.value })}
          placeholder="about-us"
          required
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
        />
        <Select
          label="Language"
          options={LANGUAGE_OPTIONS}
          value={data.language}
          onChange={(e) => setData({ ...data, language: e.target.value })}
        />
      </div>

      <Input
        label="Title"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="About Us"
        required
      />

      <Input
        label="Meta Title (SEO)"
        value={data.metaTitle}
        onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
        placeholder="Stratifit — About Our Digital Agency"
      />

      <div className="space-y-1.5">
        <label className="block font-body text-body-sm text-neutral-300">
          Meta Description (SEO)
        </label>
        <textarea
          value={data.metaDescription}
          onChange={(e) =>
            setData({ ...data, metaDescription: e.target.value })
          }
          placeholder="Learn about Stratifit's mission, team, and approach to digital design."
          rows={3}
          className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors resize-none"
        />
      </div>

      <Toggle
        label="Published"
        checked={data.published}
        onChange={(e) => setData({ ...data, published: e.target.checked })}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={isPending}>
          {mode === "create" ? "Create Page" : "Save Changes"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/pages")}
        >
          Cancel
        </Button>

        {mode === "edit" && onDelete && (
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            className="ml-auto"
          >
            Delete Page
          </Button>
        )}
      </div>
    </form>
  );
}
