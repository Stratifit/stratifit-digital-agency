"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createSenderAddress,
  deleteSenderAddress,
  setDefaultSenderAddress,
  toggleSenderAddress,
} from "@/features/communication/sender-address-actions";
import type { SenderAddressRecord } from "@/features/communication/sender-addresses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Mail, Trash2 } from "lucide-react";

export function SenderAddressesManager({
  addresses,
}: {
  addresses: SenderAddressRecord[];
}) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  async function runAction(
    action: () => Promise<{ success: boolean; error?: string }>,
    id?: string
  ) {
    setBusyId(id ?? null);
    setError(null);
    setMessage(null);
    const result = await action();
    setBusyId(null);
    if (!result.success) {
      setError(result.error ?? "Action failed.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim()) {
      setError("Enter an email address.");
      return;
    }
    setBusy(true);
    const result = await createSenderAddress({ email, label });
    setBusy(false);
    if (!result.success) {
      setError(result.error ?? "Could not add the address.");
      return;
    }
    setEmail("");
    setLabel("");
    setMessage(`Added ${email.trim().toLowerCase()} as a sender address.`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="rounded-card border border-card-border bg-card-dark p-4 shadow-sm"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[260px] flex-1 space-y-1.5">
            <Label htmlFor="sender-email">Email address</Label>
            <Input
              id="sender-email"
              type="email"
              placeholder="hello@stratifit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="min-w-[180px] flex-1 space-y-1.5">
            <Label htmlFor="sender-label">Label (optional)</Label>
            <Input
              id="sender-label"
              placeholder="General / Sales / Support…"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <Button type="submit" loading={busy}>
            Add address
          </Button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-text-muted">
          Every address at stratifit.com works automatically once the domain is
          verified in SES. These addresses appear in the “Reply as” picker on
          the Send Email page and in the inbox reply composer.
        </p>
      </form>

      {error ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="rounded-card bg-success-soft px-3 py-2 text-sm text-success">
          {message}
        </p>
      ) : null}

      {/* Address list */}
      <div className="overflow-hidden rounded-card border border-card-border bg-card-dark shadow-sm">
        {addresses.length === 0 ? (
          <div className="p-10 text-center">
            <Mail className="mx-auto size-8 text-text-subtle" aria-hidden="true" />
            <p className="mt-3 text-sm text-text-secondary">No sender addresses yet.</p>
            <p className="mt-1 text-sm text-text-muted">
              Add one above — it will appear in the “Reply as” pickers.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {address.email}
                    </p>
                    {address.is_default ? (
                      <Badge variant="success">Default</Badge>
                    ) : null}
                    {!address.is_enabled ? (
                      <Badge variant="neutral">Disabled</Badge>
                    ) : null}
                  </div>
                  {address.label ? (
                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      {address.label}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!address.is_default && address.is_enabled ? (
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        runAction(
                          () => setDefaultSenderAddress({ id: address.id }),
                          address.id
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-button border border-card-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      Set default
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() =>
                      runAction(
                        () =>
                          toggleSenderAddress({
                            id: address.id,
                            enabled: !address.is_enabled,
                          }),
                        address.id
                      )
                    }
                    className="rounded-button border border-card-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                  >
                    {address.is_enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={async () => {
                      if (
                        !window.confirm(
                          `Remove ${address.email} from the sender list? Sends using this address keep working until changed.`
                        )
                      ) {
                        return;
                      }
                      await runAction(
                        () => deleteSenderAddress({ id: address.id }),
                        address.id
                      );
                    }}
                    className="inline-flex items-center gap-1.5 rounded-button border border-error/30 bg-error/5 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
