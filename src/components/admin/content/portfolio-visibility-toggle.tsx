"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { setPortfolioVisibility } from "@/features/content/mutations";

/**
 * ON/OFF switch for a portfolio project. ON = published (visible on the
 * public site), OFF = draft (hidden). Calls the server action and refreshes
 * the list so the badge and switch stay in sync.
 */
export function PortfolioVisibilityToggle({
  slug,
  visible,
}: {
  slug: string;
  visible: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function toggle() {
    setPending(true);
    try {
      await setPortfolioVisibility(slug, !visible);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={visible}
      aria-label={`${visible ? "Hide" : "Show"} ${slug}`}
      onClick={toggle}
      disabled={pending}
      className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        visible
          ? "justify-end border-success-border bg-success"
          : "justify-start border-card-border bg-surface-soft"
      }`}
    >
      <span
        className={`flex size-5 items-center justify-center rounded-full text-[8px] font-bold transition-colors ${
          visible ? "bg-white text-success" : "bg-text-subtle text-background"
        }`}
      >
        {pending ? "…" : visible ? "ON" : "OFF"}
      </span>
    </button>
  );
}