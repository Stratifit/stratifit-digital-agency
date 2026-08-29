"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createNavItem,
  updateNavItem,
  deleteNavItem,
  type NavItemFormValues,
} from "@/features/navigation/admin-mutations";
import type { AdminNavigationItem } from "@/features/navigation/admin-queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

const LOCALES = ["en", "de", "fr", "es"] as const;
const LOCALE_PLACEHOLDERS: Record<string, string> = {
  en: "Services",
  de: "Leistungen",
  fr: "Services",
  es: "Servicios",
};

function NavItemForm({
  initial,
  submitLabel,
  busy,
  onCancel,
  onSubmit,
}: {
  initial: NavItemFormValues;
  submitLabel: string;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (values: NavItemFormValues) => void;
}) {
  const [values, setValues] = React.useState<NavItemFormValues>(initial);
  const set = (patch: Partial<NavItemFormValues>) =>
    setValues((v) => ({ ...v, ...patch }));
  const setLabel = (locale: (typeof LOCALES)[number], value: string) =>
    set({
      label_translations: {
        en: locale === "en" ? value : values.label_translations.en,
        de: locale === "de" ? value : values.label_translations.de,
        fr: locale === "fr" ? value : values.label_translations.fr,
        es: locale === "es" ? value : values.label_translations.es,
      },
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="rounded-card border border-primary/30 bg-background p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-sm font-medium text-text-primary">
            Label — English
          </label>
          <input
            value={values.label_translations.en}
            onChange={(e) => setLabel("en", e.target.value)}
            placeholder="Services"
            required
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        {LOCALES.filter((l) => l !== "en").map((locale) => (
          <div key={locale} className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Label — {locale.toUpperCase()}
            </label>
            <input
              value={values.label_translations[locale]}
              onChange={(e) => setLabel(locale, e.target.value)}
              placeholder={LOCALE_PLACEHOLDERS[locale]}
              className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Link</label>
          <input
            value={values.href}
            onChange={(e) => set({ href: e.target.value })}
            placeholder="/services or https://…"
            required
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={values.is_external}
            onChange={(e) => set({ is_external: e.target.checked })}
            className="size-4 accent-primary"
          />
          External link
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={values.open_in_new_tab}
            onChange={(e) => set({ open_in_new_tab: e.target.checked })}
            className="size-4 accent-primary"
          />
          Open in new tab
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={values.is_visible}
            onChange={(e) => set({ is_visible: e.target.checked })}
            className="size-4 accent-primary"
          />
          Visible
        </label>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-button border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-button bg-primary px-3 py-1.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
          >
            {busy ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

const EMPTY: NavItemFormValues = {
  location: "header",
  label_translations: { en: "", de: "", fr: "", es: "" },
  href: "",
  is_external: false,
  open_in_new_tab: false,
  display_order: 0,
  is_visible: true,
};

export function NavigationManager({
  items,
}: {
  items: AdminNavigationItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<AdminNavigationItem | null>(null);
  const [creating, setCreating] = React.useState<"header" | "footer" | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  // Toggled visibility keyed by nav item id. Lets the switches react
  // immediately instead of waiting on (and depending on) a router refresh
  // round-trip; the server's value (from `items`) is used when not overridden.
  const [visibilityOverrides, setVisibilityOverrides] = React.useState<
    Record<string, boolean>
  >({});

  const headerItems = items.filter((i) => i.location === "header");
  const footerItems = items.filter((i) => i.location === "footer");

  function effectiveVisible(item: AdminNavigationItem): boolean {
    return visibilityOverrides[item.id] ?? item.is_visible;
  }

  async function toggleVisibility(item: AdminNavigationItem, checked: boolean) {
    // Optimistically flip the switch straight away.
    setVisibilityOverrides((prev) => ({ ...prev, [item.id]: checked }));
    try {
      const result = await updateNavItem(item.id, {
        ...valuesFrom(item),
        is_visible: checked,
      });
      if (!result.success) {
        // Persist failed — roll the switch back and surface the error.
        setVisibilityOverrides((prev) => ({
          ...prev,
          [item.id]: item.is_visible,
        }));
        setError(result.error ?? "Failed to update visibility.");
        return;
      }
      setError(null);
      router.refresh();
    } catch {
      // A thrown server action (for example a redirect) must not leave the
      // optimistic state stuck — roll back and tell the user.
      setVisibilityOverrides((prev) => ({ ...prev, [item.id]: item.is_visible }));
      setError("Could not update this link. Please try again.");
    }
  }

  async function handleSubmit(values: NavItemFormValues) {
    setBusy(true);
    setError(null);
    const result = editing
      ? await updateNavItem(editing.id, values)
      : await createNavItem(values);
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? "Failed to save.");
      return;
    }
    setEditing(null);
    setCreating(null);
    router.refresh();
  }

  function valuesFrom(item: AdminNavigationItem): NavItemFormValues {
    const t = item.label_translations ?? {};
    return {
      location: item.location,
      label_translations: {
        en: t.en ?? "",
        de: t.de ?? "",
        fr: t.fr ?? "",
        es: t.es ?? "",
      },
      href: item.href,
      is_external: item.is_external,
      open_in_new_tab: item.open_in_new_tab,
      display_order: item.display_order,
      is_visible: item.is_visible,
    };
  }

  function renderGroup(
    location: "header" | "footer",
    label: string,
    list: AdminNavigationItem[]
  ) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold text-text-primary">{label}</h2>
          <button
            type="button"
            onClick={() => {
              setCreating(location);
              setEditing(null);
            }}
            className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            + Add link
          </button>
        </div>

        {creating === location ? (
          <NavItemForm
            initial={{ ...EMPTY, location }}
            submitLabel="Add link"
            busy={busy}
            onCancel={() => setCreating(null)}
            onSubmit={handleSubmit}
          />
        ) : null}

        {list.length === 0 ? (
          <p className="rounded-card border border-card-border bg-card-dark px-4 py-6 text-center text-sm text-text-muted">
            No {label.toLowerCase()} links yet.
          </p>
        ) : (
          <div className="space-y-2">
            {list.map((item) =>
              editing?.id === item.id ? (
                <NavItemForm
                  key={item.id}
                  initial={valuesFrom(item)}
                  submitLabel="Save changes"
                  busy={busy}
                  onCancel={() => setEditing(null)}
                  onSubmit={handleSubmit}
                />
              ) : (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border border-card-border bg-card-dark px-4 py-3 shadow-sm"
                >
                  <span className="font-medium text-text-primary">
                    {resolveTranslation(item.label_translations, "en") || "—"}
                  </span>
                  <span className="font-mono text-xs text-text-muted">{item.href}</span>
                  {!effectiveVisible(item) ? (
                    <Badge variant="neutral">Hidden</Badge>
                  ) : null}
                  <div className="ml-auto flex items-center gap-3">
                    <Switch
                      checked={effectiveVisible(item)}
                      onCheckedChange={(checked) =>
                        toggleVisibility(item, checked)
                      }
                      aria-label={`${item.href} visibility`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(item);
                        setCreating(null);
                      }}
                      className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Edit
                    </button>
                    <ConfirmDelete
                      action={deleteNavItem.bind(null, item.id)}
                      title="Delete link"
                      description={`Remove this link from the ${location} navigation?`}
                      label="Delete"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}
      {renderGroup("header", "Header navigation", headerItems)}
      {renderGroup("footer", "Footer navigation", footerItems)}
    </div>
  );
}
