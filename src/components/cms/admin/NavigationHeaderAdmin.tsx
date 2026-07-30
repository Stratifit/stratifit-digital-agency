// ============================================================================
// Stratifit — Navigation Header Admin (Structured Form)
// Client component with full CRUD for the navigation header section.
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { Select } from "@/components/admin/ui/Select";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  navigationHeaderSchema,
  type NavigationHeaderInput,
} from "@/lib/cms/validation-navigation-header";
import { SERVICE_ICON_LABELS, type ServiceIconId } from "@/components/ui/icons";
import type { CmsLanguage } from "@/lib/types/cms";
import type { CmsNavigationHeader } from "@/lib/types/navigationHeader";

const LOCALES: CmsLanguage[] = ["en", "fr", "de", "es"];

const TABS = [
  { id: "general", label: "General" },
  { id: "links", label: "Nav Links" },
  { id: "services", label: "Services" },
  { id: "footer", label: "Footer" },
  { id: "languages", label: "Languages" },
  { id: "chat", label: "Chat" },
  { id: "translations", label: "Translations" },
] as const;

function makeEmptyTranslations(): Record<CmsLanguage, Record<string, string>> {
  return { en: {}, fr: {}, de: {}, es: {} };
}

const EMPTY_FORM: NavigationHeaderInput = {
  displayOrder: 0,
  sticky: false,
  url: "",
  content: {
    logo: "Stratifit",
    links: [
      { id: "services", label: "Services", href: "/services" },
      { id: "portfolio", label: "Portfolio", href: "/portfolio" },
      { id: "insights", label: "Insights", href: "/insights" },
      { id: "about", label: "About", href: "/about" },
      { id: "faq", label: "FAQ", href: "/faq" },
      { id: "contact", label: "Contact", href: "/contact" },
    ],
    cta: { id: "cta", label: "Start a Project", href: "/contact" },
    languages: [
      { id: "en", flag: "🇺🇸", code: "EN", name: "English" },
      { id: "es", flag: "🇪🇸", code: "ES", name: "Español" },
      { id: "fr", flag: "🇫🇷", code: "FR", name: "Français" },
      { id: "de", flag: "🇩🇪", code: "DE", name: "Deutsch" },
    ],
    services: [
      { id: "brand", title: "Brand Design", description: "Unique identity systems.", href: "/services/brand-design", iconId: "brand" },
      { id: "web", title: "Web Development", description: "Fast, responsive web apps.", href: "/services/web-development", iconId: "web" },
      { id: "marketing", title: "Marketing", description: "Data-driven growth.", href: "/services/marketing", iconId: "marketing" },
    ],
    footerLinks: [
      { id: "privacy", label: "Privacy", href: "/privacy" },
      { id: "terms", label: "Terms", href: "/terms" },
      { id: "cookies", label: "Cookies", href: "/cookies" },
    ],
    chat: {
      title: "Stratifit AI",
      subtitle: "Online",
      welcomeMessage: "Welcome to Stratifit — your digital agency for growth.",
      inputPlaceholder: "Your name...",
      userMessage: "Hi Stratifit! I'm ready to grow my business.",
      quickActions: [
        { id: "demo", label: "Book a Demo" },
        { id: "quote", label: "Get a Quote" },
        { id: "contact", label: "Contact Us" },
      ],
    },
    chatLanguages: [
      { flag: "🇬🇧", code: "EN", name: "English" },
      { flag: "🇪🇸", code: "ES", name: "Spanish" },
      { flag: "🇫🇷", code: "FR", name: "French" },
      { flag: "🇩🇪", code: "DE", name: "German" },
    ],
    desktopChatPill: "Chat with us",
    builtBy: "Built by STRATIFIT team",
    copyright: "© 2026 Stratifit Agency",
  },
  translations: makeEmptyTranslations(),
};

export function NavigationHeaderAdmin() {
  const [rows, setRows] = useState<CmsNavigationHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("general");
  const [activeLocale, setActiveLocale] = useState<CmsLanguage>("fr");
  const [form, setForm] = useState<NavigationHeaderInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/navigation-header");
      if (res.ok) {
        const data = (await res.json()) as CmsNavigationHeader[];
        setRows(data);
      }
    } catch (err) {
      console.error("Failed to fetch navigation header rows:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  function setEdit(row: CmsNavigationHeader) {
    setEditingId(row.id);
    setForm({
      displayOrder: row.displayOrder,
      sticky: row.sticky,
      url: row.url,
      content: row.content,
      translations: (row.translations as NavigationHeaderInput["translations"]) ?? makeEmptyTranslations(),
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

  function updateContent<K extends keyof NavigationHeaderInput["content"]>(
    field: K,
    value: NavigationHeaderInput["content"][K]
  ) {
    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, [field]: value },
    }));
  }

  function updateArray<
    K extends
      | "links"
      | "services"
      | "footerLinks"
      | "languages"
      | "chatLanguages",
  >(field: K, index: number, key: string, value: string) {
    setForm((prev) => {
      const arr = [...(prev.content[field] as unknown as Record<string, string>[])].map((item) => ({ ...item }));
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, content: { ...prev.content, [field]: arr as unknown as typeof prev.content[typeof field] } };
    });
  }

  function addArrayItem<K extends "links" | "services" | "footerLinks" | "languages" | "chatLanguages">(
    field: K,
    defaultItem: (typeof form.content)[K][number]
  ) {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: [...(prev.content[field] as unknown as unknown[]), defaultItem] as unknown as typeof prev.content[K],
      },
    }));
  }

  function removeArrayItem<K extends "links" | "services" | "footerLinks" | "languages" | "chatLanguages">(
    field: K,
    index: number
  ) {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: (prev.content[field] as unknown as unknown[]).filter((_, i) => i !== index) as unknown as typeof prev.content[K],
      },
    }));
  }

  function updateChat(field: keyof NavigationHeaderInput["content"]["chat"], value: string) {
    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, chat: { ...prev.content.chat, [field]: value } },
    }));
  }

  function updateQuickAction(index: number, key: "id" | "label", value: string) {
    setForm((prev) => {
      const arr = [...prev.content.chat.quickActions].map((item) => ({ ...item }));
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, content: { ...prev.content, chat: { ...prev.content.chat, quickActions: arr } } };
    });
  }

  function addQuickAction() {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        chat: { ...prev.content.chat, quickActions: [...prev.content.chat.quickActions, { id: "", label: "" }] },
      },
    }));
  }

  function removeQuickAction(index: number) {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        chat: { ...prev.content.chat, quickActions: prev.content.chat.quickActions.filter((_, i) => i !== index) },
      },
    }));
  }

  function updateTranslation(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLocale]: { ...prev.translations[activeLocale], [key]: value },
      },
    }));
  }

  function removeTranslationKey(key: string) {
    setForm((prev) => {
      const dict = { ...prev.translations[activeLocale] };
      delete dict[key];
      return { ...prev, translations: { ...prev.translations, [activeLocale]: dict } };
    });
  }

  function validate(): NavigationHeaderInput | null {
    const parsed = navigationHeaderSchema.safeParse(form);
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
        ? await fetch(`/api/cms/navigation-header/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/cms/navigation-header", {
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

      setSuccess(editingId ? "Navigation header updated." : "Navigation header created.");
      resetForm();
      fetchRows();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this navigation header row?")) return;
    try {
      const res = await fetch(`/api/cms/navigation-header/${id}`, { method: "DELETE" });
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
        fetch(`/api/cms/navigation-header/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...a, displayOrder: b.displayOrder }),
        }),
        fetch(`/api/cms/navigation-header/${b.id}`, {
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

  const translationKeys = buildTranslationKeys(form.content);
  const currentTranslations = form.translations[activeLocale] ?? {};

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
          <h2 className="font-display text-heading-lg text-white">Navigation Headers ({rows.length})</h2>
          <Button onClick={resetForm} variant="secondary" type="button">
            + New Header
          </Button>
        </div>

        {loading ? (
          <p className="font-body text-body-md text-neutral-400">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl p-8 text-center">
            <p className="font-body text-body-md text-neutral-400">No navigation header rows yet. Create one below.</p>
          </div>
        ) : (
          <div className="bg-surface-darkCard border border-surface-darkBorder rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-darkBorder">
                  <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3 w-16">Order</th>
                  <th className="text-left font-body text-caption text-neutral-500 uppercase tracking-wider px-4 py-3">Logo</th>
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
                    <td className="px-4 py-3 font-body text-body-sm text-white truncate max-w-md">{row.content.logo}</td>
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
          {editingId ? "Edit Navigation Header" : "Create Navigation Header"}
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
          {activeTab === "general" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Logo Text" value={form.content.logo} onChange={(e) => updateContent("logo", e.target.value)} />
              <Input label="CTA Label" value={form.content.cta.label} onChange={(e) => updateContent("cta", { ...form.content.cta, label: e.target.value })} />
              <Input label="CTA Href" value={form.content.cta.href} onChange={(e) => updateContent("cta", { ...form.content.cta, href: e.target.value })} />
              <Input label="Desktop Chat Pill" value={form.content.desktopChatPill} onChange={(e) => updateContent("desktopChatPill", e.target.value)} />
              <Input label="Built By" value={form.content.builtBy} onChange={(e) => updateContent("builtBy", e.target.value)} />
              <Input label="Copyright" value={form.content.copyright} onChange={(e) => updateContent("copyright", e.target.value)} />
              <Input label="URL (optional)" value={form.url} onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))} />
              <Input label="Display Order" type="number" min={0} value={String(form.displayOrder)} onChange={(e) => setForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))} />
              <div className="flex items-end pb-2.5">
                <Toggle label="Sticky" checked={form.sticky} onChange={(e) => setForm((prev) => ({ ...prev, sticky: e.target.checked }))} />
              </div>
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-4">
              {form.content.links.map((link, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border border-surface-darkBorder rounded-xl p-4">
                  <Input label="ID" value={link.id} onChange={(e) => updateArray("links", idx, "id", e.target.value)} />
                  <Input label="Label" value={link.label} onChange={(e) => updateArray("links", idx, "label", e.target.value)} />
                  <Input label="Href" value={link.href} onChange={(e) => updateArray("links", idx, "href", e.target.value)} />
                  <div className="md:col-span-3 flex justify-end">
                    <Button variant="danger" onClick={() => removeArrayItem("links", idx)} type="button">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={() => addArrayItem("links", { id: "", label: "", href: "" })} type="button" variant="secondary">
                + Add Link
              </Button>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-4">
              {form.content.services.map((service, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end border border-surface-darkBorder rounded-xl p-4">
                  <Input label="ID" value={service.id} onChange={(e) => updateArray("services", idx, "id", e.target.value)} />
                  <Input label="Title" value={service.title} onChange={(e) => updateArray("services", idx, "title", e.target.value)} />
                  <Select
                    label="Icon"
                    value={service.iconId}
                    onChange={(e) => updateArray("services", idx, "iconId", e.target.value as ServiceIconId)}
                    options={Object.entries(SERVICE_ICON_LABELS).map(([value, label]) => ({ value, label }))}
                  />
                  <Input label="Href" value={service.href} onChange={(e) => updateArray("services", idx, "href", e.target.value)} />
                  <div className="md:col-span-2">
                    <label className="block font-body text-body-sm text-neutral-300 mb-1">Description</label>
                    <input
                      value={service.description}
                      onChange={(e) => updateArray("services", idx, "description", e.target.value)}
                      className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button variant="danger" onClick={() => removeArrayItem("services", idx)} type="button">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={() => addArrayItem("services", { id: "", title: "", description: "", href: "", iconId: "brand" })} type="button" variant="secondary">
                + Add Service
              </Button>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="space-y-4">
              {form.content.footerLinks.map((link, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border border-surface-darkBorder rounded-xl p-4">
                  <Input label="ID" value={link.id} onChange={(e) => updateArray("footerLinks", idx, "id", e.target.value)} />
                  <Input label="Label" value={link.label} onChange={(e) => updateArray("footerLinks", idx, "label", e.target.value)} />
                  <Input label="Href" value={link.href} onChange={(e) => updateArray("footerLinks", idx, "href", e.target.value)} />
                  <div className="md:col-span-3 flex justify-end">
                    <Button variant="danger" onClick={() => removeArrayItem("footerLinks", idx)} type="button">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={() => addArrayItem("footerLinks", { id: "", label: "", href: "" })} type="button" variant="secondary">
                + Add Footer Link
              </Button>
            </div>
          )}

          {activeTab === "languages" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-display text-heading-md text-white">Site Languages</h3>
                {form.content.languages.map((lang, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border border-surface-darkBorder rounded-xl p-4">
                    <Input label="ID" value={lang.id} onChange={(e) => updateArray("languages", idx, "id", e.target.value)} />
                    <Input label="Flag" value={lang.flag} onChange={(e) => updateArray("languages", idx, "flag", e.target.value)} />
                    <Input label="Code" value={lang.code} onChange={(e) => updateArray("languages", idx, "code", e.target.value)} />
                    <Input label="Name" value={lang.name} onChange={(e) => updateArray("languages", idx, "name", e.target.value)} />
                    <div className="md:col-span-4 flex justify-end">
                      <Button variant="danger" onClick={() => removeArrayItem("languages", idx)} type="button">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={() => addArrayItem("languages", { id: "en", flag: "", code: "", name: "" })} type="button" variant="secondary">
                  + Add Site Language
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-heading-md text-white">Chat Languages</h3>
                {form.content.chatLanguages.map((lang, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border border-surface-darkBorder rounded-xl p-4">
                    <Input label="Flag" value={lang.flag} onChange={(e) => updateArray("chatLanguages", idx, "flag", e.target.value)} />
                    <Input label="Code" value={lang.code} onChange={(e) => updateArray("chatLanguages", idx, "code", e.target.value)} />
                    <Input label="Name" value={lang.name} onChange={(e) => updateArray("chatLanguages", idx, "name", e.target.value)} />
                    <div className="md:col-span-4 flex justify-end">
                      <Button variant="danger" onClick={() => removeArrayItem("chatLanguages", idx)} type="button">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={() => addArrayItem("chatLanguages", { flag: "", code: "", name: "" })} type="button" variant="secondary">
                  + Add Chat Language
                </Button>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Chat Title" value={form.content.chat.title} onChange={(e) => updateChat("title", e.target.value)} />
                <Input label="Chat Subtitle" value={form.content.chat.subtitle} onChange={(e) => updateChat("subtitle", e.target.value)} />
                <Input label="Input Placeholder" value={form.content.chat.inputPlaceholder} onChange={(e) => updateChat("inputPlaceholder", e.target.value)} />
              </div>
              <div>
                <label className="block font-body text-body-sm text-neutral-300 mb-1">Welcome Message</label>
                <textarea
                  value={form.content.chat.welcomeMessage}
                  onChange={(e) => updateChat("welcomeMessage", e.target.value)}
                  rows={3}
                  className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-body-sm text-neutral-300 mb-1">User Message</label>
                <textarea
                  value={form.content.chat.userMessage}
                  onChange={(e) => updateChat("userMessage", e.target.value)}
                  rows={3}
                  className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-heading-md text-white">Quick Actions</h3>
                {form.content.chat.quickActions.map((action, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border border-surface-darkBorder rounded-xl p-4">
                    <Input label="ID" value={action.id} onChange={(e) => updateQuickAction(idx, "id", e.target.value)} />
                    <Input label="Label" value={action.label} onChange={(e) => updateQuickAction(idx, "label", e.target.value)} />
                    <div className="flex justify-end">
                      <Button variant="danger" onClick={() => removeQuickAction(idx)} type="button">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={addQuickAction} type="button" variant="secondary">
                  + Add Quick Action
                </Button>
              </div>
            </div>
          )}

          {activeTab === "translations" && (
            <div className="space-y-5">
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

              <div className="space-y-3">
                {translationKeys.map((key) => (
                  <div key={key}>
                    <label className="block font-body text-caption text-neutral-500 mb-1 uppercase tracking-wider">{key}</label>
                    <input
                      value={currentTranslations[key] ?? ""}
                      onChange={(e) => updateTranslation(key, e.target.value)}
                      className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
                    />
                  </div>
                ))}

                {Object.keys(currentTranslations)
                  .filter((key) => !translationKeys.includes(key))
                  .map((key) => (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end">
                      <input
                        value={key}
                        readOnly
                        className="bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-neutral-400"
                      />
                      <input
                        value={currentTranslations[key] ?? ""}
                        onChange={(e) => updateTranslation(key, e.target.value)}
                        className="w-full bg-surface-dark border border-surface-darkBorder rounded-xl px-4 py-2.5 font-body text-body-md text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/30 transition-colors"
                      />
                      <Button variant="danger" onClick={() => removeTranslationKey(key)} type="button">
                        Remove
                      </Button>
                    </div>
                  ))}
              </div>

              <AddCustomTranslation onAdd={(key, value) => updateTranslation(key, value)} />
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-surface-darkBorder">
            <Button onClick={handleSave} loading={saving} type="button">
              {editingId ? "Save Changes" : "Create Header"}
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

function AddCustomTranslation({ onAdd }: { onAdd: (key: string, value: string) => void }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  function handleAdd() {
    if (!key.trim()) return;
    onAdd(key.trim(), value);
    setKey("");
    setValue("");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end border-t border-surface-darkBorder pt-4">
      <Input label="Custom Key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="links.custom.label" />
      <Input label="Custom Value" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={handleAdd} type="button" variant="secondary">
        + Add Custom
      </Button>
    </div>
  );
}

function buildTranslationKeys(content: NavigationHeaderInput["content"]): string[] {
  const keys = [
    "logo",
    "desktopChatPill",
    "builtBy",
    "copyright",
    "cta.label",
    "chat.title",
    "chat.subtitle",
    "chat.welcomeMessage",
    "chat.inputPlaceholder",
    "chat.userMessage",
  ];

  for (const link of content.links) {
    if (link.id) keys.push(`links.${link.id}.label`);
  }
  for (const service of content.services) {
    if (service.id) {
      keys.push(`services.${service.id}.title`, `services.${service.id}.description`);
    }
  }
  for (const link of content.footerLinks) {
    if (link.id) keys.push(`footerLinks.${link.id}.label`);
  }
  for (const action of content.chat.quickActions) {
    if (action.id) keys.push(`chat.quickActions.${action.id}.label`);
  }
  for (const lang of content.languages) {
    if (lang.id) keys.push(`languages.${lang.id}.name`);
  }

  return [...new Set(keys)];
}
