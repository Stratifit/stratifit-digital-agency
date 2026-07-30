"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  acquisitionSectionSchema,
  type AcquisitionSectionInput,
  type AcquisitionTranslationsInput,
  type AcquisitionCardInput,
} from "@/lib/cms/validation-acquisition";
import type { CmsAcquisitionSection } from "@/lib/types/acquisition";
import type { CmsLanguage } from "@/lib/types/cms";

const LOCALES: CmsLanguage[] = ["en", "fr", "de", "es"];

const TABS = [
  { id: "general", label: "General" },
  { id: "cards", label: "Business Cards" },
  { id: "filters", label: "Filters" },
] as const;

function emptyTranslations(): AcquisitionTranslationsInput {
  return { en: "", fr: "", de: "", es: "" };
}

function emptyCard(index: number): AcquisitionCardInput {
  return {
    url: "",
    category: "",
    categoryColor: "rgba(245, 158, 11, 0.19)",
    categoryBorderRadius: "9999px",
    navEmoji: "",
    navTitle: "",
    bgImageUrl: "",
    overlayColor: "rgba(245, 158, 11, 0.25)",
    iconRadius: "9999px",
    iconBorder: "rgba(245, 158, 11, 0.314)",
    iconShadow: "rgba(245, 158, 11, 0.082) 0px 0px 25px",
    mainEmoji: "",
    titleTranslations: emptyTranslations(),
    descriptionTranslations: emptyTranslations(),
    tags: ["Tag 1", "Tag 2", "Tag 3"],
    gridEmojis: ["✨", "✨", "✨"],
    buttonTextTranslations: emptyTranslations(),
    trustBadges: ["Verified", "Secure Escrow"],
    price: "$0",
    linkUrl: "",
    visitLinkUrl: "",
    displayOrder: index,
    active: true,
  };
}

const EMPTY_FORM: AcquisitionSectionInput = {
  displayOrder: 0,
  subtitleTranslations: emptyTranslations(),
  titleTranslations: emptyTranslations(),
  descriptionTranslations: emptyTranslations(),
  viewAllUrl: "/buy-business",
  viewAllLabelTranslations: emptyTranslations(),
  viewDetailLabelTranslations: emptyTranslations(),
  visitSiteLabelTranslations: emptyTranslations(),
  buyBusinessLabelTranslations: emptyTranslations(),
  filters: ["All"],
  items: [emptyCard(0)],
};

export function AcquisitionSectionAdmin() {
  const [rows, setRows] = useState<CmsAcquisitionSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("general");
  const [activeLocale, setActiveLocale] = useState<CmsLanguage>("en");
  const [form, setForm] = useState<AcquisitionSectionInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/acquisition");
      if (res.ok) {
        const data = (await res.json()) as CmsAcquisitionSection[];
        setRows(data);
      }
    } catch (err) {
      console.error("Failed to fetch acquisition sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  function setEdit(row: CmsAcquisitionSection) {
    setEditingId(row.id);
    setForm({
      displayOrder: row.displayOrder,
      subtitleTranslations: row.subtitleTranslations,
      titleTranslations: row.titleTranslations,
      descriptionTranslations: row.descriptionTranslations,
      viewAllUrl: row.viewAllUrl,
      viewAllLabelTranslations: row.viewAllLabelTranslations,
      viewDetailLabelTranslations: row.viewDetailLabelTranslations,
      visitSiteLabelTranslations: row.visitSiteLabelTranslations,
      buyBusinessLabelTranslations: row.buyBusinessLabelTranslations,
      filters: row.filters,
      items: row.items.map((item) => ({
        id: item.id,
        url: item.url,
        category: item.category,
        categoryColor: item.categoryColor,
        categoryBorderRadius: item.categoryBorderRadius,
        navEmoji: item.navEmoji,
        navTitle: item.navTitle,
        bgImageUrl: item.bgImageUrl,
        overlayColor: item.overlayColor,
        iconRadius: item.iconRadius,
        iconBorder: item.iconBorder,
        iconShadow: item.iconShadow,
        mainEmoji: item.mainEmoji,
        titleTranslations: item.titleTranslations,
        descriptionTranslations: item.descriptionTranslations,
        tags: item.tags,
        gridEmojis: item.gridEmojis,
        buttonTextTranslations: item.buttonTextTranslations,
        trustBadges: item.trustBadges,
        price: item.price,
        linkUrl: item.linkUrl,
        visitLinkUrl: item.visitLinkUrl,
        displayOrder: item.displayOrder,
        active: item.active,
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

  function validate(): AcquisitionSectionInput | null {
    const parsed = acquisitionSectionSchema.safeParse(form);
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
        ? await fetch(`/api/cms/acquisition/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/cms/acquisition", {
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

      setSuccess(editingId ? "Acquisition section updated." : "Acquisition section created.");
      resetForm();
      fetchRows();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this acquisition section?")) return;
    try {
      const res = await fetch(`/api/cms/acquisition/${id}`, { method: "DELETE" });
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
        fetch(`/api/cms/acquisition/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...a, displayOrder: b.displayOrder }),
        }),
        fetch(`/api/cms/acquisition/${b.id}`, {
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
    field: keyof AcquisitionSectionInput,
    value: AcquisitionTranslationsInput
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateCard(index: number, updates: Partial<AcquisitionCardInput>) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...updates };
      return { ...prev, items };
    });
  }

  function updateCardTranslations(
    index: number,
    field: "titleTranslations" | "descriptionTranslations" | "buttonTextTranslations",
    locale: CmsLanguage,
    value: string
  ) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]: { ...items[index][field], [locale]: value },
      };
      return { ...prev, items };
    });
  }

  function addCard() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, emptyCard(prev.items.length)],
    }));
  }

  function removeCard(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function moveCard(index: number, direction: "up" | "down") {
    setForm((prev) => {
      const items = [...prev.items];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;

      const temp = items[index];
      items[index] = { ...items[targetIndex], displayOrder: index };
      items[targetIndex] = { ...temp, displayOrder: targetIndex };

      return { ...prev, items };
    });
  }

  function addFilter() {
    setForm((prev) => ({ ...prev, filters: [...prev.filters, ""] }));
  }

  function updateFilter(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      filters: prev.filters.map((f, i) => (i === index ? value : f)),
    }));
  }

  function removeFilter(index: number) {
    setForm((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
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
          <h2 className="font-display text-heading-lg text-white">
            Acquisition Sections ({rows.length})
          </h2>
          <Button onClick={resetForm} variant="secondary" type="button">
            + New Acquisition Section
          </Button>
        </div>

        {loading ? (
          <p className="font-body text-body-md text-neutral-400">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-8 text-center">
            <p className="font-body text-body-md text-neutral-400">
              No acquisition sections yet. Create one below.
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
          {editingId ? "Edit Acquisition Section" : "Create Acquisition Section"}
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
              <TranslationField
                label="View All Label"
                value={form.viewAllLabelTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("viewAllLabelTranslations", {
                    ...form.viewAllLabelTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <TranslationField
                label="View Detail Label"
                value={form.viewDetailLabelTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("viewDetailLabelTranslations", {
                    ...form.viewDetailLabelTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <TranslationField
                label="Visit Site Label"
                value={form.visitSiteLabelTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("visitSiteLabelTranslations", {
                    ...form.visitSiteLabelTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <TranslationField
                label="Buy Business Label"
                value={form.buyBusinessLabelTranslations[activeLocale]}
                onChange={(value) =>
                  updateTranslations("buyBusinessLabelTranslations", {
                    ...form.buyBusinessLabelTranslations,
                    [activeLocale]: value,
                  })
                }
              />
              <Input
                label="View All URL"
                value={form.viewAllUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, viewAllUrl: e.target.value }))
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

          {activeTab === "cards" && (
            <div className="space-y-6">
              {form.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="border border-surface-darkBorder rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-heading-sm text-white">
                      Business Card {itemIndex + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveCard(itemIndex, "up")}
                        className="text-neutral-400 hover:text-white"
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveCard(itemIndex, "down")}
                        className="text-neutral-400 hover:text-white"
                        type="button"
                      >
                        ↓
                      </button>
                      <Button
                        variant="danger"
                        onClick={() => removeCard(itemIndex)}
                        type="button"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Business URL"
                      value={item.url}
                      onChange={(e) =>
                        updateCard(itemIndex, { url: e.target.value })
                      }
                    />
                    <Input
                      label="Category"
                      value={item.category}
                      onChange={(e) =>
                        updateCard(itemIndex, { category: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Category Color (rgba)"
                      value={item.categoryColor}
                      onChange={(e) =>
                        updateCard(itemIndex, { categoryColor: e.target.value })
                      }
                    />
                    <Input
                      label="Category Border Radius"
                      value={item.categoryBorderRadius}
                      onChange={(e) =>
                        updateCard(itemIndex, { categoryBorderRadius: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nav Emoji"
                      value={item.navEmoji}
                      onChange={(e) =>
                        updateCard(itemIndex, { navEmoji: e.target.value })
                      }
                    />
                    <Input
                      label="Nav Title"
                      value={item.navTitle}
                      onChange={(e) =>
                        updateCard(itemIndex, { navTitle: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Background Image URL"
                      value={item.bgImageUrl}
                      onChange={(e) =>
                        updateCard(itemIndex, { bgImageUrl: e.target.value })
                      }
                    />
                    <Input
                      label="Overlay Color (rgba)"
                      value={item.overlayColor}
                      onChange={(e) =>
                        updateCard(itemIndex, { overlayColor: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Icon Radius"
                      value={item.iconRadius}
                      onChange={(e) =>
                        updateCard(itemIndex, { iconRadius: e.target.value })
                      }
                    />
                    <Input
                      label="Icon Border (rgba)"
                      value={item.iconBorder}
                      onChange={(e) =>
                        updateCard(itemIndex, { iconBorder: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Icon Shadow"
                      value={item.iconShadow}
                      onChange={(e) =>
                        updateCard(itemIndex, { iconShadow: e.target.value })
                      }
                    />
                    <Input
                      label="Main Emoji"
                      value={item.mainEmoji}
                      onChange={(e) =>
                        updateCard(itemIndex, { mainEmoji: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TranslationField
                      label="Title"
                      value={item.titleTranslations[activeLocale]}
                      onChange={(value) =>
                        updateCardTranslations(
                          itemIndex,
                          "titleTranslations",
                          activeLocale,
                          value
                        )
                      }
                    />
                    <TranslationField
                      label="Button Text"
                      value={item.buttonTextTranslations[activeLocale]}
                      onChange={(value) =>
                        updateCardTranslations(
                          itemIndex,
                          "buttonTextTranslations",
                          activeLocale,
                          value
                        )
                      }
                    />
                  </div>

                  <TranslationField
                    label="Description"
                    value={item.descriptionTranslations[activeLocale]}
                    onChange={(value) =>
                      updateCardTranslations(
                        itemIndex,
                        "descriptionTranslations",
                        activeLocale,
                        value
                      )
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tags (comma separated)"
                      value={item.tags.join(", ")}
                      onChange={(e) =>
                        updateCard(itemIndex, {
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                    <Input
                      label="Grid Emojis (comma separated, exactly 3)"
                      value={item.gridEmojis.join(", ")}
                      onChange={(e) =>
                        updateCard(itemIndex, {
                          gridEmojis: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Trust Badges (comma separated)"
                      value={item.trustBadges.join(", ")}
                      onChange={(e) =>
                        updateCard(itemIndex, {
                          trustBadges: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                    <Input
                      label="Price"
                      value={item.price}
                      onChange={(e) =>
                        updateCard(itemIndex, { price: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Detail Link URL"
                      value={item.linkUrl}
                      onChange={(e) =>
                        updateCard(itemIndex, { linkUrl: e.target.value })
                      }
                    />
                    <Input
                      label="Visit Link URL"
                      value={item.visitLinkUrl}
                      onChange={(e) =>
                        updateCard(itemIndex, { visitLinkUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center">
                    <Toggle
                      label="Active"
                      checked={item.active}
                      onChange={(e) =>
                        updateCard(itemIndex, { active: e.target.checked })
                      }
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addCard} type="button" variant="secondary">
                + Add Business Card
              </Button>
            </div>
          )}

          {activeTab === "filters" && (
            <div className="space-y-4">
              <p className="font-body text-body-sm text-neutral-400">
                Filter labels. The first filter is used as the default &quot;All&quot;
                filter.
              </p>
              {form.filters.map((filter, filterIndex) => (
                <div key={filterIndex} className="flex items-center gap-2">
                  <Input
                    label={`Filter ${filterIndex + 1}`}
                    value={filter}
                    onChange={(e) => updateFilter(filterIndex, e.target.value)}
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeFilter(filterIndex)}
                    type="button"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={addFilter} type="button" variant="secondary">
                + Add Filter
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-surface-darkBorder">
            <Button onClick={handleSave} loading={saving} type="button">
              {editingId ? "Save Changes" : "Create Acquisition Section"}
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
