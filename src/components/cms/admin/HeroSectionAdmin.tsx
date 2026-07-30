// ============================================================================
// Stratifit — Hero Section Admin (Structured Form)
// Client component with full CRUD for the hero section.
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  heroSectionSchema,
  type HeroSectionInput,
  type HeroTranslationsInput,
} from "@/lib/cms/validation-hero";
import type { CmsHeroSection } from "@/lib/types/hero";
import type { CmsLanguage } from "@/lib/types/cms";

const LOCALES: CmsLanguage[] = ["en", "fr", "de", "es"];

const TABS = [
  { id: "general", label: "General" },
  { id: "ctas", label: "CTAs" },
  { id: "badges", label: "Badges" },
  { id: "tech", label: "Tech Stack" },
] as const;

function emptyTranslations(): HeroTranslationsInput {
  return { en: "", fr: "", de: "", es: "" };
}

const EMPTY_FORM: HeroSectionInput = {
  displayOrder: 0,
  sticky: false,
  subtitleTranslations: emptyTranslations(),
  titleTranslations: emptyTranslations(),
  titleHighlightTranslations: emptyTranslations(),
  descriptionTranslations: emptyTranslations(),
  ctas: [
    {
      id: "primary",
      labelTranslations: emptyTranslations(),
      href: "/contact",
      variant: "primary",
    },
    {
      id: "secondary",
      labelTranslations: emptyTranslations(),
      href: "/strategy-call",
      variant: "secondary",
    },
  ],
  trustBadges: [
    { id: "projects", value: "59+", labelTranslations: emptyTranslations() },
    { id: "experience", value: "7+", labelTranslations: emptyTranslations() },
    { id: "satisfaction", value: "98%", labelTranslations: emptyTranslations() },
  ],
  techStack: {
    titleTranslations: emptyTranslations(),
    descriptionTranslations: emptyTranslations(),
    items: [
      { name: "Tailwind CSS", iconId: "brush" },
      { name: "Framer Motion", iconId: "zap" },
      { name: "GSAP", iconId: "zap" },
      { name: "Next.js", iconId: "code" },
      { name: "React", iconId: "atom" },
      { name: "TypeScript", iconId: "code" },
    ],
  },
  url: "",
};

export function HeroSectionAdmin() {
  const [rows, setRows] = useState<CmsHeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("general");
  const [activeLocale, setActiveLocale] = useState<CmsLanguage>("en");
  const [form, setForm] = useState<HeroSectionInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/hero");
      if (res.ok) {
        const data = (await res.json()) as CmsHeroSection[];
        setRows(data);
      }
    } catch (err) {
      console.error("Failed to fetch hero sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  function setEdit(row: CmsHeroSection) {
    setEditingId(row.id);
    setForm({
      displayOrder: row.displayOrder,
      sticky: row.sticky,
      subtitleTranslations: row.subtitleTranslations,
      titleTranslations: row.titleTranslations,
      titleHighlightTranslations: row.titleHighlightTranslations,
      descriptionTranslations: row.descriptionTranslations,
      ctas: row.ctas,
      trustBadges: row.trustBadges,
      techStack: row.techStack,
      url: row.url,
    });
    setErrors({});
    setSuccess(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccess(null);
  }

  function validate(): HeroSectionInput | null {
    const parsed = heroSectionSchema.safeParse(form);
    if (!parsed.success) {
      const formatted: Record<string, string> = {};
      const flat = parsed.error.flatten().fieldErrors;
      for (const [key, messages] of Object.entries(flat)) {
        if (messages && Array.isArray(messages) && messages.length > 0) {
          formatted[key] = messages.join("; ");
        }
      }
      setErrors({ general: "Validation failed. Please check the highlighted fields.", ...formatted });
      return null;
    }
    return parsed.data;
  }

  async function handleSave() {
    setErrors({});
    setSuccess(null);
    const data = validate();
    if (!data) return;

    setSaving(true);
    try {
      const res = editingId
        ? await fetch(`/api/cms/hero/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/cms/hero", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

      if (!res.ok) {
        const err = await res.json();
        setErrors({
          general: typeof err.error === "string" ? err.error : "Save failed. Please check your input.",
        });
        return;
      }

      setSuccess(editingId ? "Hero section updated." : "Hero section created.");
      resetForm();
      fetchRows();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this hero section?")) return;
    try {
      const res = await fetch(`/api/cms/hero/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRows();
        if (editingId === id) resetForm();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const sorted = [...rows].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = sorted.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[targetIdx];

    try {
      await Promise.all([
        fetch(`/api/cms/hero/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...a, displayOrder: b.displayOrder }),
        }),
        fetch(`/api/cms/hero/${b.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...b, displayOrder: a.displayOrder }),
        }),
      ]);
      fetchRows();
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  }

  function updateTranslations<K extends keyof HeroSectionInput>(
    field: K,
    value: HeroSectionInput[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateCta(index: number, key: string, value: string) {
    setForm((prev) => {
      const ctas = [...prev.ctas];
      ctas[index] = { ...ctas[index], [key]: value };
      return { ...prev, ctas };
    });
  }

  function updateCtaTranslations(index: number, locale: CmsLanguage, value: string) {
    setForm((prev) => {
      const ctas = [...prev.ctas];
      ctas[index] = {
        ...ctas[index],
        labelTranslations: { ...ctas[index].labelTranslations, [locale]: value },
      };
      return { ...prev, ctas };
    });
  }

  function updateBadge(index: number, key: string, value: string) {
    setForm((prev) => {
      const trustBadges = [...prev.trustBadges];
      trustBadges[index] = { ...trustBadges[index], [key]: value };
      return { ...prev, trustBadges };
    });
  }

  function updateBadgeTranslations(index: number, locale: CmsLanguage, value: string) {
    setForm((prev) => {
      const trustBadges = [...prev.trustBadges];
      trustBadges[index] = {
        ...trustBadges[index],
        labelTranslations: { ...trustBadges[index].labelTranslations, [locale]: value },
      };
      return { ...prev, trustBadges };
    });
  }

  function updateTechStackTranslations(field: "titleTranslations" | "descriptionTranslations", locale: CmsLanguage, value: string) {
    setForm((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [field]: { ...prev.techStack[field], [locale]: value },
      },
    }));
  }

  function updateTechItem(index: number, key: "name" | "iconId", value: string) {
    setForm((prev) => {
      const items = [...prev.techStack.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, techStack: { ...prev.techStack, items } };
    });
  }

  function addTechItem() {
    setForm((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        items: [...prev.techStack.items, { name: "", iconId: "code" }],
      },
    }));
  }

  function removeTechItem(index: number) {
    setForm((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        items: prev.techStack.items.filter((_, i) => i !== index),
      },
    }));
  }

  return (
    <div className="space-y-8">
      {errors.general && (
        <div className="bg-red-900/20 border border-red-800/30 text-red-400 font-body text-body-sm rounded-xl px-4 py-3">
          {errors.general}
        </div>
      )}
      {success && (
        <div className="bg-green-900/20 border border-green-800/30 text-green-400 font-body text-body-sm rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-heading-lg text-white">Hero Sections ({rows.length})</h2>
          <Button onClick={resetForm} variant="secondary" type="button">
            + New Hero
          </Button>
        </div>

        {loading ? (
          <p className="font-body text-body-md text-neutral-400">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-8 text-center">
            <p className="font-body text-body-md text-neutral-400">No hero sections yet. Create one below.</p>
          </div>
        ) : (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-darkBorder">
                  <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-16">Order</th>
                  <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-24">Sticky</th>
                  <th className="text-right font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-56">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-surface-darkBorder last:border-b-0 hover:bg-surface-darkHover/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-body text-body-sm text-neutral-400">{row.displayOrder}</td>
                    <td className="px-4 py-3">
                      {row.sticky ? (
                        <span className="text-brand-gold text-body-sm">Yes</span>
                      ) : (
                        <span className="text-neutral-500 text-body-sm">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEdit(row)} className="font-body text-body-sm text-brand-gold hover:underline mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleMove(row.id, "up")} className="font-body text-body-sm text-neutral-400 hover:text-white mr-3" type="button">
                        ↑
                      </button>
                      <button onClick={() => handleMove(row.id, "down")} className="font-body text-body-sm text-neutral-400 hover:text-white mr-3" type="button">
                        ↓
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="font-body text-body-sm text-red-400 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-6">
        <h2 className="font-display text-heading-lg text-white mb-4">
          {editingId ? "Edit Hero Section" : "Create Hero Section"}
        </h2>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-surface-darkBorder pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-body text-body-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-gold text-surface-dark font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-surface-darkHover"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* Language selector */}
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                onClick={() => setActiveLocale(locale)}
                className={`px-3 py-1.5 rounded-lg font-body text-body-sm font-semibold uppercase transition-colors ${
                  activeLocale === locale
                    ? "bg-brand-gold text-surface-dark"
                    : "text-neutral-400 hover:text-white hover:bg-surface-darkHover"
                }`}
                type="button"
              >
                {locale}
              </button>
            ))}
          </div>

          {activeTab === "general" && (
            <div className="space-y-5">
              <TranslationField
                label="Subtitle / Badge"
                value={form.subtitleTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("subtitleTranslations", {
                    ...form.subtitleTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <TranslationField
                label="Title"
                value={form.titleTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("titleTranslations", {
                    ...form.titleTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <TranslationField
                label="Title Highlight"
                value={form.titleHighlightTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("titleHighlightTranslations", {
                    ...form.titleHighlightTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <TranslationField
                label="Description"
                value={form.descriptionTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("descriptionTranslations", {
                    ...form.descriptionTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Display Order"
                  type="number"
                  min={0}
                  value={String(form.displayOrder)}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))
                  }
                />
                <Input
                  label="URL (optional)"
                  value={form.url}
                  onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div className="flex items-center">
                <Toggle
                  label="Sticky"
                  checked={form.sticky}
                  onChange={(e) => setForm((prev) => ({ ...prev, sticky: e.target.checked }))}
                />
              </div>
            </div>
          )}

          {activeTab === "ctas" && (
            <div className="space-y-6">
              {form.ctas.map((cta, idx) => (
                <div key={cta.id} className="border border-surface-darkBorder rounded-xl p-4 space-y-4">
                  <h3 className="font-display text-heading-sm text-white capitalize">{cta.variant} CTA</h3>
                  <Input
                    label="Href"
                    value={cta.href}
                    onChange={(e) => updateCta(idx, "href", e.target.value)}
                  />
                  <TranslationField
                    label="Label"
                    value={cta.labelTranslations[activeLocale]}
                    onChange={(value) => updateCtaTranslations(idx, activeLocale, value)}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "badges" && (
            <div className="space-y-6">
              {form.trustBadges.map((badge, idx) => (
                <div key={badge.id} className="border border-surface-darkBorder rounded-xl p-4 space-y-4">
                  <h3 className="font-display text-heading-sm text-white capitalize">{badge.id}</h3>
                  <Input
                    label="Value"
                    value={badge.value}
                    onChange={(e) => updateBadge(idx, "value", e.target.value)}
                  />
                  <TranslationField
                    label="Label"
                    value={badge.labelTranslations[activeLocale]}
                    onChange={(value) => updateBadgeTranslations(idx, activeLocale, value)}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "tech" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TranslationField
                  label="Tech Stack Title"
                  value={form.techStack.titleTranslations[activeLocale]}
                  onChange={(value) => updateTechStackTranslations("titleTranslations", activeLocale, value)}
                />
                <TranslationField
                  label="Tech Stack Description"
                  value={form.techStack.descriptionTranslations[activeLocale]}
                  onChange={(value) => updateTechStackTranslations("descriptionTranslations", activeLocale, value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-heading-sm text-white">Tech Stack Items</h3>
                {form.techStack.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end border border-surface-darkBorder rounded-xl p-4">
                    <Input
                      label="Name"
                      value={item.name}
                      onChange={(e) => updateTechItem(idx, "name", e.target.value)}
                    />
                    <Input
                      label="Icon ID"
                      value={item.iconId}
                      onChange={(e) => updateTechItem(idx, "iconId", e.target.value)}
                    />
                    <div className="md:col-span-2 flex justify-end">
                      <Button variant="danger" onClick={() => removeTechItem(idx)} type="button">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={addTechItem} type="button" variant="secondary">
                  + Add Tech Item
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-surface-darkBorder">
            <Button onClick={handleSave} loading={saving} type="button">
              {editingId ? "Save Changes" : "Create Hero"}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={resetForm} type="button">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TranslationField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block font-body text-body-sm text-neutral-300">{label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
      />
    </div>
  );
}
