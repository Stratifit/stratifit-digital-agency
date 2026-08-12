"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createFooterGroup,
  deleteFooterGroup,
  createFooterLink,
  deleteFooterLink,
} from "@/features/footer/admin-mutations";
import type { AdminFooterGroup } from "@/features/footer/admin-queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Badge } from "@/components/ui/badge";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

const LOCALES = ["en", "de", "fr", "es"] as const;
type Translations = { en: string; de: string; fr: string; es: string };
const EMPTY_TR: Translations = { en: "", de: "", fr: "", es: "" };

function LocaleInputs({
  value,
  onChange,
  placeholder,
}: {
  value: Translations;
  onChange: (locale: keyof Translations, value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {LOCALES.map((locale) => (
        <div key={locale} className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            {locale.toUpperCase()}
          </label>
          <input
            value={value[locale] ?? ""}
            onChange={(e) => onChange(locale, e.target.value)}
            placeholder={placeholder}
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
      ))}
    </div>
  );
}

export function FooterManager({ groups }: { groups: AdminFooterGroup[] }) {
  const router = useRouter();
  const [groupTitle, setGroupTitle] = React.useState<Translations>(EMPTY_TR);
  const [linkForms, setLinkForms] = React.useState<
    Record<string, { label: Translations; href: string }>
  >({});
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function handleAddGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupTitle.en.trim()) return;
    setBusy(true);
    setError(null);
    const result = await createFooterGroup({
      title_translations: groupTitle,
      display_order: groups.length,
      is_visible: true,
    });
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? "Failed to create group.");
      return;
    }
    setGroupTitle(EMPTY_TR);
    router.refresh();
  }

  async function handleAddLink(groupId: string) {
    const form = linkForms[groupId];
    if (!form || !form.label.en.trim() || !form.href.trim()) return;
    setBusy(true);
    setError(null);
    const result = await createFooterLink({
      group_id: groupId,
      label_translations: form.label,
      href: form.href,
      is_external: form.href.startsWith("http"),
      display_order: groups.find((g) => g.id === groupId)?.links.length ?? 0,
      is_visible: true,
    });
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? "Failed to create link.");
      return;
    }
    setLinkForms((prev) => ({ ...prev, [groupId]: { label: EMPTY_TR, href: "" } }));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      {/* Add group */}
      <form
        onSubmit={handleAddGroup}
        className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm"
      >
        <h2 className="font-display text-sm font-bold text-text-primary">Add a footer group</h2>
        <div className="mt-4">
          <LocaleInputs
            value={groupTitle}
            onChange={(locale, v) => setGroupTitle((prev) => ({ ...prev, [locale]: v }))}
            placeholder="Services"
          />
        </div>
        <button
          type="submit"
          disabled={busy || !groupTitle.en.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add group"}
        </button>
      </form>

      {/* Groups */}
      {groups.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-sm">
          <p className="text-sm text-text-secondary">No footer groups yet.</p>
          <p className="mt-1 text-sm text-text-muted">Add one above to start building the footer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-sm font-bold text-text-primary">
                  {resolveTranslation(group.title_translations, "en") || "Untitled group"}
                </h3>
                {!group.is_visible ? <Badge variant="neutral">Hidden</Badge> : null}
                <div className="ml-auto flex items-center gap-2">
                  <ConfirmDelete
                    action={deleteFooterGroup.bind(null, group.id)}
                    title="Delete group"
                    description="This deletes the group and all its links."
                  />
                </div>
              </div>

              {/* Add link */}
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {LOCALES.map((locale) => (
                    <div key={locale} className="space-y-1.5">
                      <label className="block text-sm font-medium text-text-primary">
                        New link label ({locale.toUpperCase()})
                      </label>
                      <input
                        value={linkForms[group.id]?.label[locale] ?? ""}
                        onChange={(e) =>
                          setLinkForms((prev) => ({
                            ...prev,
                            [group.id]: {
                              label: {
                                ...(prev[group.id]?.label ?? EMPTY_TR),
                                [locale]: e.target.value,
                              },
                              href: prev[group.id]?.href ?? "",
                            },
                          }))
                        }
                        placeholder={locale === "en" ? "About" : "—"}
                        className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <label className="block text-sm font-medium text-text-primary">Link</label>
                    <input
                      value={linkForms[group.id]?.href ?? ""}
                      onChange={(e) =>
                        setLinkForms((prev) => ({
                          ...prev,
                          [group.id]: {
                            label: prev[group.id]?.label ?? EMPTY_TR,
                            href: e.target.value,
                          },
                        }))
                      }
                      placeholder="/about or https://…"
                      className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleAddLink(group.id)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-button border border-primary/30 bg-primary/10 px-3.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Links */}
              {group.links.length === 0 ? (
                <p className="mt-4 text-sm text-text-muted">No links in this group yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {group.links.map((link) => (
                    <li
                      key={link.id}
                      className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border border-border bg-background px-3.5 py-2.5"
                    >
                      <span className="text-sm font-medium text-text-primary">
                        {resolveTranslation(link.label_translations, "en") || "—"}
                      </span>
                      <span className="font-mono text-xs text-text-muted">{link.href}</span>
                      {!link.is_visible ? <Badge variant="neutral">Hidden</Badge> : null}
                      <span className="ml-auto">
                        <ConfirmDelete
                          action={deleteFooterLink.bind(null, link.id)}
                          title="Delete link"
                          description="Remove this link from the footer?"
                          label="Delete"
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
