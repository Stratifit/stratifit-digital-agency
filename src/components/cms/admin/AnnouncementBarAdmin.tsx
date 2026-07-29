// ============================================================================
// Stratifit — Announcement Bar Admin
// Client component with full CRUD for announcement slides.
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Toggle } from "@/components/admin/ui/Toggle";

interface SlideFormData {
  displayOrder: number;
  sticky: boolean;
  url: string;
  messageTranslations: {
    en: string;
    fr: string;
    de: string;
    es: string;
  };
}

interface Slide extends SlideFormData {
  id: string;
}

interface FormErrors {
  [key: string]: string;
}

const EMPTY_FORM: SlideFormData = {
  displayOrder: 0,
  sticky: false,
  url: "",
  messageTranslations: { en: "", fr: "", de: "", es: "" },
};

export function AnnouncementBarAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<SlideFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/announcement-slides");
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error("Failed to fetch slides:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.messageTranslations.en.trim()) errs.en = "Required";
    if (!form.messageTranslations.fr.trim()) errs.fr = "Required";
    if (!form.messageTranslations.de.trim()) errs.de = "Required";
    if (!form.messageTranslations.es.trim()) errs.es = "Required";
    if (form.displayOrder < 0) errs.displayOrder = "Must be 0 or greater";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);

    try {
      const body = {
        displayOrder: form.displayOrder,
        sticky: form.sticky,
        url: form.url,
        messageTranslations: form.messageTranslations,
      };

      let res: Response;
      if (editingId) {
        res = await fetch(`/api/cms/announcement-slides/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/cms/announcement-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        if (errData.error) {
          setErrors(
            typeof errData.error === "string"
              ? { general: errData.error }
              : errData.error
          );
        }
        return;
      }

      resetForm();
      fetchSlides();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this announcement slide?")) return;

    try {
      const res = await fetch(`/api/cms/announcement-slides/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchSlides();
        if (editingId === id) resetForm();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  function editSlide(slide: Slide) {
    setEditingId(slide.id);
    setForm({
      displayOrder: slide.displayOrder,
      sticky: slide.sticky,
      url: slide.url,
      messageTranslations: { ...slide.messageTranslations },
    });
    setErrors({});
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  const LANGUAGES = [
    { key: "en", label: "English" },
    { key: "fr", label: "Français" },
    { key: "de", label: "Deutsch" },
    { key: "es", label: "Español" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Error banner */}
      {errors.general && (
        <div className="bg-red-900/20 border border-red-800/30 text-red-400 font-body text-body-sm rounded-xl px-4 py-3">
          {errors.general}
        </div>
      )}

      {/* Slide list */}
      <div>
        <h2 className="font-display text-heading-lg text-white mb-4">
          Slides ({slides.length})
        </h2>
        {loading ? (
          <p className="font-body text-body-md text-neutral-400">Loading...</p>
        ) : slides.length === 0 ? (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-8 text-center">
            <p className="font-body text-body-md text-neutral-400">
              No announcement slides yet. Create one below.
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
                    Message (EN)
                  </th>
                  <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-20">
                    Sticky
                  </th>
                  <th className="text-right font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide) => (
                  <tr
                    key={slide.id}
                    className="border-b border-surface-darkBorder last:border-b-0 hover:bg-surface-darkHover/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-body text-body-sm text-neutral-400">
                      {slide.displayOrder}
                    </td>
                    <td className="px-4 py-3 font-body text-body-sm text-white truncate max-w-md">
                      {slide.messageTranslations.en}
                    </td>
                    <td className="px-4 py-3">
                      {slide.sticky ? (
                        <span className="text-brand-gold text-body-sm">Yes</span>
                      ) : (
                        <span className="text-neutral-500 text-body-sm">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => editSlide(slide)}
                        className="font-body text-body-sm text-brand-gold hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="font-body text-body-sm text-red-400 hover:underline"
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

      {/* Create / Edit form */}
      <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-6">
        <h2 className="font-display text-heading-lg text-white mb-6">
          {editingId ? "Edit Slide" : "Create Slide"}
        </h2>

        <div className="space-y-5">
          {/* Display order + sticky row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Display Order"
              type="number"
              min={0}
              value={String(form.displayOrder)}
              onChange={(e) =>
                setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })
              }
              error={errors.displayOrder}
            />
            <div className="flex items-end pb-2.5">
              <Toggle
                label="Sticky (fixed at top)"
                checked={form.sticky}
                onChange={(e) =>
                  setForm({ ...form, sticky: e.target.checked })
                }
              />
            </div>
          </div>

          {/* URL */}
          <Input
            label="URL (optional)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="/announcement/launch"
          />

          {/* Message translations */}
          <div className="space-y-1.5">
            <label className="block font-body text-body-sm text-neutral-300">
              Messages (all 4 languages required)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <div key={lang.key}>
                  <label className="block font-body text-caption text-neutral-500 mb-1 uppercase">
                    {lang.label}
                  </label>
                  <input
                    value={form.messageTranslations[lang.key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        messageTranslations: {
                          ...form.messageTranslations,
                          [lang.key]: e.target.value,
                        },
                      })
                    }
                    placeholder={`Message in ${lang.label}`}
                    className={`w-full bg-surface-dark border ${
                      errors[lang.key]
                        ? "border-red-500/50"
                        : "border-surface-darkBorder"
                    } rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors`}
                  />
                  {errors[lang.key] && (
                    <p className="font-body text-caption text-red-400 mt-1">
                      {errors[lang.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} loading={saving}>
              {editingId ? "Save Changes" : "Create Slide"}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
