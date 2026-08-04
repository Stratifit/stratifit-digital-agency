"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createTrustedLogo,
  deleteTrustedLogo,
  toggleTrustedLogo,
} from "@/features/trusted-logos/admin-mutations";
import type { AdminTrustedLogo } from "@/features/trusted-logos/admin-queries";
import type { AdminMediaRow } from "@/features/media/queries";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

export function TrustedLogosManager({
  logos,
  media,
}: {
  logos: AdminTrustedLogo[];
  media: AdminMediaRow[];
}) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [mediaId, setMediaId] = React.useState("");
  const [href, setHref] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await createTrustedLogo({
      name,
      media_id: mediaId,
      href,
      display_order: logos.length,
      is_visible: true,
      is_verified: true,
    });
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? "Failed to create logo.");
      return;
    }
    setName("");
    setMediaId("");
    setHref("");
    router.refresh();
  }

  async function handleToggle(id: string, visible: boolean) {
    const result = await toggleTrustedLogo(id, visible);
    if (!result.success) setError(result.error ?? "Failed to update logo.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form
        onSubmit={handleCreate}
        className="rounded-card border border-card-border bg-card-dark p-5 shadow-shadow-sm"
      >
        <h2 className="font-display text-sm font-bold text-text-primary">
          Add a trusted logo
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="logo-name" className="block text-sm font-medium text-text-primary">
              Name
            </label>
            <input
              id="logo-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Acme Corp"
              className="h-11 w-full rounded-input border border-field-border bg-field-bg px-4 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="logo-media" className="block text-sm font-medium text-text-primary">
              Logo image
            </label>
            <select
              id="logo-media"
              value={mediaId}
              onChange={(e) => setMediaId(e.target.value)}
              required
              className="h-11 w-full cursor-pointer appearance-none rounded-input border border-field-border bg-field-bg px-4 text-sm text-field-text outline-none transition-colors focus:border-primary"
            >
              <option value="" disabled>
                Select an image…
              </option>
              {media.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.original_filename}
                </option>
              ))}
            </select>
            {media.length === 0 ? (
              <p className="text-xs text-text-muted">
                No images in the media library yet — upload one first.
              </p>
            ) : null}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="logo-href" className="block text-sm font-medium text-text-primary">
              Link (optional)
            </label>
            <input
              id="logo-href"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://acme.com"
              className="h-11 w-full rounded-input border border-field-border bg-field-bg px-4 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>
        {error ? (
          <p role="alert" className="mt-3 rounded-card bg-error-soft px-3 py-2 text-sm text-error">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || media.length === 0}
          className="mt-4 inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add logo"}
        </button>
      </form>

      {/* List */}
      {logos.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-dark p-10 text-center shadow-shadow-sm">
          <p className="text-sm text-text-secondary">No trusted logos yet.</p>
          <p className="mt-1 text-sm text-text-muted">Add one above to show it under the hero.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-card-border bg-card-dark shadow-shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-soft/60 text-text-muted">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Name</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Order</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Verified</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">Visible</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.18em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logos.map((logo) => (
                <tr key={logo.id} className="transition-colors hover:bg-surface-hover">
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-text-primary">{logo.name}</span>
                    {logo.href ? (
                      <span className="mt-0.5 block max-w-[220px] truncate font-mono text-xs text-text-muted">
                        {logo.href}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">{logo.display_order}</td>
                  <td className="px-4 py-3.5">
                    {logo.is_verified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="neutral">Unverified</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <Switch
                      checked={logo.is_visible}
                      onCheckedChange={(checked) => handleToggle(logo.id, checked)}
                      aria-label={`${logo.name} visibility`}
                    />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <ConfirmDelete
                      action={deleteTrustedLogo.bind(null, logo.id)}
                      title="Delete logo"
                      description={`Remove ${logo.name} from the trusted-by row?`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
