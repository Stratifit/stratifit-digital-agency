"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateAcquisitionSection } from "@/features/acquisition/admin-mutations";
import type {
  AdminAcquisitionSection,
  AdminBusinessListing,
} from "@/features/acquisition/admin-queries";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";

const LOCALES = ["en", "de", "fr", "es"] as const;
type Translations = { en: string; de: string; fr: string; es: string };

const EMPTY_TR: Translations = { en: "", de: "", fr: "", es: "" };

function emptyListing(): AdminBusinessListing {
  return {
    slug: "",
    name: "",
    domain: "",
    emoji: "",
    category: "",
    tagline: "",
    tags: [],
    accent: "#F59E0B",
    price: "",
    url: "",
    action_label: "",
    trust: [],
    tiles: [],
  };
}

function ListingForm({
  initial,
  busy,
  onCancel,
  onSubmit,
}: {
  initial: AdminBusinessListing;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (listing: AdminBusinessListing) => void;
}) {
  const [listing, setListing] = React.useState<AdminBusinessListing>(initial);
  const set = (patch: Partial<AdminBusinessListing>) =>
    setListing((l) => ({ ...l, ...patch }));

  const [tagsText, setTagsText] = React.useState(initial.tags.join(", "));
  const [trustText, setTrustText] = React.useState(initial.trust.join(", "));
  const [tilesText, setTilesText] = React.useState(initial.tiles.join(", "));

  function parseList(value: string): string[] {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...listing,
          tags: parseList(tagsText),
          trust: parseList(trustText),
          tiles: parseList(tilesText),
        });
      }}
      className="space-y-3 rounded-card border border-primary/30 bg-background p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Name</label>
          <input
            value={listing.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Luxe Pet Co."
            required
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Slug</label>
          <input
            value={listing.slug}
            onChange={(e) => set({ slug: e.target.value })}
            placeholder="luxe-pet-co"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 font-mono text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Domain</label>
          <input
            value={listing.domain}
            onChange={(e) => set({ domain: e.target.value })}
            placeholder="luxepetco.com"
            required
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Emoji</label>
          <input
            value={listing.emoji}
            onChange={(e) => set({ emoji: e.target.value })}
            placeholder="🐾"
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Category</label>
          <input
            value={listing.category}
            onChange={(e) => set({ category: e.target.value })}
            placeholder="ecommerce"
            required
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Price</label>
          <input
            value={listing.price}
            onChange={(e) => set({ price: e.target.value })}
            placeholder="$45,000"
            required
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Accent color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={listing.accent || "#F59E0B"}
              onChange={(e) => set({ accent: e.target.value })}
              className="h-10 w-14 cursor-pointer rounded-input border border-field-border bg-field-bg"
              aria-label="Accent color"
            />
            <input
              value={listing.accent}
              onChange={(e) => set({ accent: e.target.value })}
              placeholder="#D4A574"
              className="h-10 flex-1 rounded-input border border-field-border bg-field-bg px-3.5 font-mono text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">URL</label>
          <input
            value={listing.url}
            onChange={(e) => set({ url: e.target.value })}
            placeholder="https://luxepetco.com"
            required
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Button label</label>
          <input
            value={listing.action_label}
            onChange={(e) => set({ action_label: e.target.value })}
            placeholder="Shop Now"
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-primary">Tagline</label>
        <textarea
          value={listing.tagline}
          onChange={(e) => set({ tagline: e.target.value })}
          rows={2}
          placeholder="Premium pet accessories brand with 14 SKUs…"
          className="w-full rounded-input border border-field-border bg-field-bg px-3.5 py-2 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Tags (comma-separated)
          </label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="Pet, Shopify, DTC"
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Trust badges (comma-separated)
          </label>
          <input
            value={trustText}
            onChange={(e) => setTrustText(e.target.value)}
            placeholder="Verified Financials, Secure Escrow"
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Tiles (comma-separated)
          </label>
          <input
            value={tilesText}
            onChange={(e) => setTilesText(e.target.value)}
            placeholder="🛍️, 📦, 🏷️"
            className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
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
          {busy ? "Saving…" : "Save listing"}
        </button>
      </div>
    </form>
  );
}

export function AcquisitionManager({
  section,
}: {
  section: AdminAcquisitionSection;
}) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [locale, setLocale] = React.useState<(typeof LOCALES)[number]>("en");
  const [adding, setAdding] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [businesses, setBusinesses] = React.useState<AdminBusinessListing[]>(
    section.businesses
  );
  const [title, setTitle] = React.useState<Translations>(
    (section.title_translations as Translations | null) ?? EMPTY_TR
  );
  const [description, setDescription] = React.useState<Translations>(
    (section.description_translations as Translations | null) ?? EMPTY_TR
  );
  const [ctaLabel, setCtaLabel] = React.useState<Translations>(
    (section.cta_label_translations as Translations | null) ?? EMPTY_TR
  );
  const [ctaUrl, setCtaUrl] = React.useState(section.cta_url ?? "");
  const [isVisible, setIsVisible] = React.useState(section.is_visible);

  const setTr = (
    setter: React.Dispatch<React.SetStateAction<Translations>>,
    key: keyof Translations
  ) => (value: string) =>
    setter((prev) => ({ ...prev, [key]: value }));

  async function handleSave() {
    setBusy(true);
    setServerError(null);
    setSaved(false);
    const result = await updateAcquisitionSection({
      title_translations: title,
      description_translations: description,
      cta_label_translations: ctaLabel,
      cta_url: ctaUrl,
      is_visible: isVisible,
      businesses,
    });
    setBusy(false);
    if (!result.success) {
      setServerError(result.error ?? "Failed to save.");
      return;
    }
    setSaved(true);
    setAdding(false);
    setEditingIndex(null);
    router.refresh();
  }

  function upsertListing(listing: AdminBusinessListing) {
    setBusinesses((prev) => {
      if (editingIndex !== null) {
        const next = [...prev];
        next[editingIndex] = listing;
        return next;
      }
      return [...prev, listing];
    });
    setAdding(false);
    setEditingIndex(null);
  }

  function removeListing(index: number) {
    setBusinesses((prev) => prev.filter((_l, i) => i !== index));
  }

  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-sm font-bold text-text-primary">
            Section heading
          </p>
          <div className="flex gap-1">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={cn(
                  "rounded-button px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  locale === l ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text-secondary"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">
                Title ({locale.toUpperCase()})
              </label>
              <input
                value={title[locale] ?? ""}
                onChange={(e) => setTr(setTitle, locale)(e.target.value)}
                placeholder="Buy a"
                className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">
                CTA label ({locale.toUpperCase()})
              </label>
              <input
                value={ctaLabel[locale] ?? ""}
                onChange={(e) => setTr(setCtaLabel, locale)(e.target.value)}
                placeholder="Explore Opportunities"
                className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Description ({locale.toUpperCase()})
            </label>
            <textarea
              value={description[locale] ?? ""}
              onChange={(e) => setTr(setDescription, locale)(e.target.value)}
              rows={2}
              placeholder="Looking to acquire a digital business?"
              className="w-full rounded-input border border-field-border bg-field-bg px-3.5 py-2 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">CTA URL</label>
              <input
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="/buy-business"
                className="h-10 w-full rounded-input border border-field-border bg-field-bg px-3.5 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary sm:w-64"
              />
            </div>
            <div className="flex items-center gap-2.5 pt-5">
              <Switch
                checked={isVisible}
                onCheckedChange={setIsVisible}
                aria-label="Acquisition section visible"
              />
              <span className="text-xs text-text-muted">
                {isVisible ? "Visible on homepage" : "Paused"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Business listings */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-sm font-bold text-text-primary">
              Business listings ({businesses.length})
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              Shown on the homepage and /buy-business.
            </p>
          </div>
          {!adding && editingIndex === null ? (
            <button
              type="button"
              onClick={() => {
                setAdding(true);
                setEditingIndex(null);
              }}
              className="rounded-button border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              + Add listing
            </button>
          ) : null}
        </div>

        {adding ? (
          <div className="mb-4">
            <ListingForm
              initial={emptyListing()}
              busy={busy}
              onCancel={() => setAdding(false)}
              onSubmit={(listing) => {
                upsertListing(listing);
              }}
            />
          </div>
        ) : null}

        {businesses.length === 0 ? (
          <p className="rounded-card border border-card-border bg-background px-4 py-8 text-center text-sm text-text-muted">
            No listings yet — add one to populate the marketplace.
          </p>
        ) : (
          <div className="space-y-2">
            {businesses.map((b, index) => (
              <div key={b.slug || index}>
                {editingIndex === index ? (
                  <ListingForm
                    initial={b}
                    busy={busy}
                    onCancel={() => setEditingIndex(null)}
                    onSubmit={(listing) => upsertListing(listing)}
                  />
                ) : (
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border border-card-border bg-background px-4 py-3",
                      !b.slug && "opacity-60"
                    )}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {b.emoji || "🏷️"}
                    </span>
                    <span className="font-medium text-text-primary">{b.name || "Untitled"}</span>
                    <span className="font-mono text-xs text-text-muted">{b.domain}</span>
                    <Badge variant="neutral">{b.category || "—"}</Badge>
                    <span className="font-display text-sm font-bold text-primary">
                      {b.price}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingIndex(index);
                          setAdding(false);
                        }}
                        className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeListing(index)}
                        className="rounded-xs px-2 py-1 text-sm text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p role="status" className="rounded-card bg-success-soft px-3 py-2 text-sm text-success">
          Saved successfully.
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save Acquisition Section"}
        </button>
      </div>
    </div>
  );
}
