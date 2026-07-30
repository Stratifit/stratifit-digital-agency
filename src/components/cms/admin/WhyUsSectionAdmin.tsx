// ============================================================================
// Stratifit — Why Us Section Admin (Structured Form)
// Client component with full CRUD for the Why Us section and its feature cards.
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  whyUsSectionSchema,
  type WhyUsSectionInput,
  type WhyUsTranslationsInput,
  type WhyUsFeatureInput,
} from "@/lib/cms/validation-why-us";
import {
  WHY_US_ICON_IDS,
  WHY_US_ICON_LABELS,
} from "@/components/ui/icons";
import type { CmsWhyUsSection } from "@/lib/types/why-us";
import type { CmsLanguage } from "@/lib/types/cms";

const LOCALES: CmsLanguage[] = ["en", "fr", "de", "es"];

const TABS = [
  { id: "general", label: "General" },
  { id: "features", label: "Feature Cards" },
] as const;

function emptyTranslations(): WhyUsTranslationsInput {
  return { en: "", fr: "", de: "", es: "" };
}

function emptyFeature(index: number): WhyUsFeatureInput {
  return {
    icon: "shield",
    titleTranslations: emptyTranslations(),
    descriptionTranslations: emptyTranslations(),
    stat: "",
    statLabelTranslations: emptyTranslations(),
    displayOrder: index,
    active: true,
  };
}

const EMPTY_FORM: WhyUsSectionInput = {
  displayOrder: 0,
  subtitleTranslations: emptyTranslations(),
  titleTranslations: emptyTranslations(),
  descriptionTranslations: emptyTranslations(),
  features: [emptyFeature(0)],
};

export function WhyUsSectionAdmin() {
  const [rows, setRows] = useState<CmsWhyUsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("general");
  const [activeLocale, setActiveLocale] = useState<CmsLanguage>("en");
  const [form, setForm] = useState<WhyUsSectionInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/why-us");
      if (res.ok) {
        const data = (await res.json()) as CmsWhyUsSection[];
        setRows(data);
      }
    } catch (err) {
      console.error("Failed to fetch Why Us sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  function setEdit(row: CmsWhyUsSection) {
    setEditingId(row.id);
    setForm({
      displayOrder: row.displayOrder,
      subtitleTranslations: row.subtitleTranslations,
      titleTranslations: row.titleTranslations,
      descriptionTranslations: row.descriptionTranslations,
      features: row.features.map((feature) => ({
        id: feature.id,
        icon: feature.icon,
        titleTranslations: feature.titleTranslations,
        descriptionTranslations: feature.descriptionTranslations,
        stat: feature.stat,
        statLabelTranslations: feature.statLabelTranslations,
        displayOrder: feature.displayOrder,
        active: feature.active,
      })),
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

  function validate(): WhyUsSectionInput | null {
    const parsed = whyUsSectionSchema.safeParse(form);
    if (!parsed.success) {
      const formatted: Record<string, string> = {};
      const flat = parsed.error.flatten().fieldErrors;
      for (const [key, messages] of Object.entries(flat)) {
        if (messages && Array.isArray(messages) && messages.length > 0) {
          formatted[key] = messages.join("; ");
        }
      }
      setErrors({
        general: "Validation failed. Please check the highlighted fields.",
        ...formatted,
      });
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
        ? await fetch(`/api/cms/why-us/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/cms/why-us", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

      if (!res.ok) {
        const err = await res.json();
        setErrors({
          general:
            typeof err.error === "string"
              ? err.error
              : "Save failed. Please check your input.",
        });
        return;
      }

      setSuccess(editingId ? "Why Us section updated." : "Why Us section created.");
      resetForm();
      fetchRows();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this Why Us section?")) return;
    try {
      const res = await fetch(`/api/cms/why-us/${id}`, { method: "DELETE" });
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
        fetch(`/api/cms/why-us/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...a, displayOrder: b.displayOrder }),
        }),
        fetch(`/api/cms/why-us/${b.id}`, {
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

  function updateTranslations(
    field: keyof WhyUsSectionInput,
    value: WhyUsTranslationsInput
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateFeature(index: number, updates: Partial<WhyUsFeatureInput>) {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = { ...features[index], ...updates };
      return { ...prev, features };
    });
  }

  function updateFeatureTranslations(
    index: number,
    field: "titleTranslations" | "descriptionTranslations" | "statLabelTranslations",
    locale: CmsLanguage,
    value: string
  ) {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = {
        ...features[index],
        [field]: { ...features[index][field], [locale]: value },
      };
      return { ...prev, features };
    });
  }

  function addFeature() {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, emptyFeature(prev.features.length)],
    }));
  }

  function removeFeature(index: number) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  function moveFeature(index: number, direction: "up" | "down") {
    setForm((prev) => {
      const features = [...prev.features];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= features.length) return prev;

      const temp = features[index];
      features[index] = { ...features[targetIndex], displayOrder: index };
      features[targetIndex] = { ...temp, displayOrder: targetIndex };

      return { ...prev, features };
    });
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
          <h2 className="font-display text-heading-lg text-white">
            Why Us Sections ({rows.length})
          </h2>
          <Button onClick={resetForm} variant="secondary" type="button">
            + New Why Us Section
          </Button>
        </div>

        {loading ? (
          <p className="font-body text-body-md text-neutral-400">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-8 text-center">
            <p className="font-body text-body-md text-neutral-400">
              No Why Us sections yet. Create one below.
            </p>
          </div>
        ) : (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-darkBorder">
                  <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-16">
                    Order
                  </th>
                  <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3">
                    Title
                  </th>
                  <th className="text-right font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-56">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-surface-darkBorder last:border-b-0 hover:bg-surface-darkHover/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-body text-body-sm text-neutral-400">
                      {row.displayOrder}
                    </td>
                    <td className="px-4 py-3 font-body text-body-sm text-white">
                      {row.titleTranslations.en}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEdit(row)}
                        className="font-body text-body-sm text-brand-gold hover:underline mr-3"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMove(row.id, "up")}
                        className="font-body text-body-sm text-neutral-400 hover:text-white mr-3"
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMove(row.id, "down")}
                        className="font-body text-body-sm text-neutral-400 hover:text-white mr-3"
                        type="button"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="font-body text-body-sm text-red-400 hover:underline"
                        type="button"
                      >
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
          {editingId ? "Edit Why Us Section" : "Create Why Us Section"}
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
                label="Subtitle / Eyebrow"
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
                label="Description"
                value={form.descriptionTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("descriptionTranslations", {
                    ...form.descriptionTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <Input
                label="Display Order"
                type="number"
                min={0}
                value={String(form.displayOrder)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    displayOrder: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-6">
              {form.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="border border-surface-darkBorder rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-heading-sm text-white">
                      Feature Card {featureIndex + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveFeature(featureIndex, "up")}
                        className="text-neutral-400 hover:text-white"
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveFeature(featureIndex, "down")}
                        className="text-neutral-400 hover:text-white"
                        type="button"
                      >
                        ↓
                      </button>
                      <Button
                        variant="danger"
                        onClick={() => removeFeature(featureIndex)}
                        type="button"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-body text-body-sm text-neutral-300">
                        Icon
                      </label>
                      <select
                        value={feature.icon}
                        onChange={(e) =>
                          updateFeature(featureIndex, { icon: e.target.value })
                        }
                        className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
                      >
                        {WHY_US_ICON_IDS.map((id) => (
                          <option key={id} value={id}>
                            {WHY_US_ICON_LABELS[id]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Stat (e.g. 50+)"
                      value={feature.stat}
                      onChange={(e) =>
                        updateFeature(featureIndex, { stat: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TranslationField
                      label="Title"
                      value={feature.titleTranslations[activeLocale]}
                      onChange={(value) =>
                        updateFeatureTranslations(
                          featureIndex,
                          "titleTranslations",
                          activeLocale,
                          value
                        )
                      }
                    />
                    <TranslationField
                      label="Stat Label"
                      value={feature.statLabelTranslations[activeLocale]}
                      onChange={(value) =>
                        updateFeatureTranslations(
                          featureIndex,
                          "statLabelTranslations",
                          activeLocale,
                          value
                        )
                      }
                    />
                  </div>

                  <TranslationField
                    label="Description"
                    value={feature.descriptionTranslations[activeLocale]}
                    onChange={(value) =>
                      updateFeatureTranslations(
                        featureIndex,
                        "descriptionTranslations",
                        activeLocale,
                        value
                      )
                    }
                  />

                  <div className="flex items-center">
                    <Toggle
                      label="Active"
                      checked={feature.active}
                      onChange={(e) =>
                        updateFeature(featureIndex, { active: e.target.checked })
                      }
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addFeature} type="button" variant="secondary">
                + Add Feature Card
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-surface-darkBorder">
            <Button onClick={handleSave} loading={saving} type="button">
              {editingId ? "Save Changes" : "Create Why Us Section"}
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
