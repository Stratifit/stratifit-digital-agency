"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  pricingSectionSchema,
  type PricingSectionInput,
  type PricingTranslationsInput,
  type PricingPackageInput,
  type PricingFeatureInput,
} from "@/lib/cms/validation-pricing";
import type { CmsPricingSection, CmsPricingPackage } from "@/lib/types/pricing";
import type { CmsLanguage } from "@/lib/types/cms";

const LOCALES: CmsLanguage[] = ["en", "fr", "de", "es"];

function emptyTranslations(): PricingTranslationsInput {
  return { en: "", fr: "", de: "", es: "" };
}

function emptyFeature(): PricingFeatureInput {
  return { en: "", fr: "", de: "", es: "" };
}

function emptyPackage(index: number): PricingPackageInput {
  return {
    nameTranslations: emptyTranslations(),
    descriptionTranslations: emptyTranslations(),
    price: "",
    priceLabelTranslations: emptyTranslations(),
    isPopular: false,
    buttonLabelTranslations: emptyTranslations(),
    buttonAction: "",
    features: [emptyFeature()],
    displayOrder: index,
    active: true,
  };
}

const EMPTY_FORM: PricingSectionInput = {
  displayOrder: 0,
  subtitleTranslations: emptyTranslations(),
  titleTranslations: emptyTranslations(),
  descriptionTranslations: emptyTranslations(),
  packages: [emptyPackage(0)],
};

export function PricingSectionAdmin() {
  const [rows, setRows] = useState<CmsPricingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<CmsLanguage>("en");
  const [form, setForm] = useState<PricingSectionInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/pricing");
      if (res.ok) {
        const data = (await res.json()) as CmsPricingSection[];
        setRows(data);
      }
    } catch (err) {
      console.error("Failed to fetch pricing sections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  function setEdit(row: CmsPricingSection) {
    setEditingId(row.id);
    setForm({
      displayOrder: row.displayOrder,
      subtitleTranslations: row.subtitleTranslations,
      titleTranslations: row.titleTranslations,
      descriptionTranslations: row.descriptionTranslations,
      packages: row.packages.map((pkg) => ({
        id: pkg.id,
        nameTranslations: pkg.nameTranslations,
        descriptionTranslations: pkg.descriptionTranslations,
        price: pkg.price,
        priceLabelTranslations: pkg.priceLabelTranslations,
        isPopular: pkg.isPopular,
        buttonLabelTranslations: pkg.buttonLabelTranslations,
        buttonAction: pkg.buttonAction,
        features: pkg.features.length > 0 ? pkg.features : [emptyFeature()],
        displayOrder: pkg.displayOrder,
        active: pkg.active,
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

  function validate(): PricingSectionInput | null {
    const parsed = pricingSectionSchema.safeParse(form);
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
        ? await fetch(`/api/cms/pricing/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/cms/pricing", {
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

      setSuccess(editingId ? "Pricing section updated." : "Pricing section created.");
      resetForm();
      fetchRows();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this pricing section?")) return;
    try {
      const res = await fetch(`/api/cms/pricing/${id}`, { method: "DELETE" });
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
        fetch(`/api/cms/pricing/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...a, displayOrder: b.displayOrder }),
        }),
        fetch(`/api/cms/pricing/${b.id}`, {
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
    field: keyof PricingSectionInput,
    value: PricingTranslationsInput
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updatePackage(index: number, updates: Partial<PricingPackageInput>) {
    setForm((prev) => {
      const packages = [...prev.packages];
      packages[index] = { ...packages[index], ...updates };
      return { ...prev, packages };
    });
  }

  function updatePackageTranslations(
    index: number,
    field: "nameTranslations" | "descriptionTranslations" | "priceLabelTranslations" | "buttonLabelTranslations",
    locale: CmsLanguage,
    value: string
  ) {
    setForm((prev) => {
      const packages = [...prev.packages];
      packages[index] = {
        ...packages[index],
        [field]: { ...packages[index][field], [locale]: value },
      };
      return { ...prev, packages };
    });
  }

  function updateFeature(
    packageIndex: number,
    featureIndex: number,
    locale: CmsLanguage,
    value: string
  ) {
    setForm((prev) => {
      const packages = [...prev.packages];
      const features = [...packages[packageIndex].features];
      features[featureIndex] = { ...features[featureIndex], [locale]: value };
      packages[packageIndex] = { ...packages[packageIndex], features };
      return { ...prev, packages };
    });
  }

  function addPackage() {
    setForm((prev) => ({
      ...prev,
      packages: [...prev.packages, emptyPackage(prev.packages.length)],
    }));
  }

  function removePackage(index: number) {
    setForm((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  }

  function addFeature(packageIndex: number) {
    setForm((prev) => {
      const packages = [...prev.packages];
      packages[packageIndex] = {
        ...packages[packageIndex],
        features: [...packages[packageIndex].features, emptyFeature()],
      };
      return { ...prev, packages };
    });
  }

  function removeFeature(packageIndex: number, featureIndex: number) {
    setForm((prev) => {
      const packages = [...prev.packages];
      packages[packageIndex] = {
        ...packages[packageIndex],
        features: packages[packageIndex].features.filter((_, i) => i !== featureIndex),
      };
      return { ...prev, packages };
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
            Pricing Sections ({rows.length})
          </h2>
          <Button onClick={resetForm} variant="secondary" type="button">
            + New Pricing Section
          </Button>
        </div>

        {loading ? (
          <p className="font-body text-body-md text-neutral-400">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-8 text-center">
            <p className="font-body text-body-md text-neutral-400">
              No pricing sections yet. Create one below.
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
          {editingId ? "Edit Pricing Section" : "Create Pricing Section"}
        </h2>

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

          <div className="border-t border-surface-darkBorder pt-6 space-y-6">
            <h3 className="font-display text-heading-sm text-white">Pricing Packages</h3>
            {form.packages.map((pkg, pkgIndex) => (
              <div
                key={pkgIndex}
                className="border border-surface-darkBorder rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-body-lg text-white">
                    Package {pkgIndex + 1}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removePackage(pkgIndex)}
                      className="font-body text-body-sm text-red-400 hover:underline"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TranslationField
                    label="Name"
                    value={pkg.nameTranslations[activeLocale]}
                    onChange={(value) =>
                      updatePackageTranslations(
                        pkgIndex,
                        "nameTranslations",
                        activeLocale,
                        value
                      )
                    }
                  />
                  <Input
                    label="Price"
                    value={pkg.price}
                    onChange={(e) =>
                      updatePackage(pkgIndex, { price: e.target.value })
                    }
                  />
                </div>

                <TranslationField
                  label="Description"
                  value={pkg.descriptionTranslations[activeLocale]}
                  onChange={(value) =>
                    updatePackageTranslations(
                      pkgIndex,
                      "descriptionTranslations",
                      activeLocale,
                      value
                    )
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TranslationField
                    label="Price Label"
                    value={pkg.priceLabelTranslations[activeLocale]}
                    onChange={(value) =>
                      updatePackageTranslations(
                        pkgIndex,
                        "priceLabelTranslations",
                        activeLocale,
                        value
                      )
                    }
                  />
                  <TranslationField
                    label="Button Label"
                    value={pkg.buttonLabelTranslations[activeLocale]}
                    onChange={(value) =>
                      updatePackageTranslations(
                        pkgIndex,
                        "buttonLabelTranslations",
                        activeLocale,
                        value
                      )
                    }
                  />
                </div>

                <Input
                  label="Button Action / URL"
                  value={pkg.buttonAction}
                  onChange={(e) =>
                    updatePackage(pkgIndex, { buttonAction: e.target.value })
                  }
                />

                <div className="flex items-center gap-4">
                  <Toggle
                    label="Most Popular"
                    checked={pkg.isPopular}
                    onChange={(e) =>
                      updatePackage(pkgIndex, { isPopular: e.target.checked })
                    }
                  />
                  <Toggle
                    label="Active"
                    checked={pkg.active}
                    onChange={(e) =>
                      updatePackage(pkgIndex, { active: e.target.checked })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <h5 className="font-body text-body-sm text-neutral-300">Features</h5>
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <TranslationField
                        label={`Feature ${featureIndex + 1}`}
                        value={feature[activeLocale]}
                        onChange={(value) =>
                          updateFeature(pkgIndex, featureIndex, activeLocale, value)
                        }
                      />
                      <button
                        onClick={() => removeFeature(pkgIndex, featureIndex)}
                        className="self-end mb-1 font-body text-body-sm text-red-400 hover:underline"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addFeature(pkgIndex)}
                    type="button"
                    variant="secondary"
                  >
                    + Add Feature
                  </Button>
                </div>
              </div>
            ))}

            <Button onClick={addPackage} type="button" variant="secondary">
              + Add Package
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-surface-darkBorder">
            <Button onClick={handleSave} loading={saving} type="button">
              {editingId ? "Save Changes" : "Create Pricing Section"}
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
    <div className="space-y-1.5 flex-1">
      <label className="block font-body text-body-sm text-neutral-300">{label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
      />
    </div>
  );
}
