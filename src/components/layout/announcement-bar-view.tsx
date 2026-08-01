"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";

const CLOSED_KEY = "stratifit-announcement-closed";

interface AnnouncementViewProps {
  message: string;
  linkUrl?: string;
  linkLabel?: string;
}

export function AnnouncementBarView({ message, linkUrl, linkLabel }: AnnouncementViewProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const storedClosed = React.useSyncExternalStore(
    () => () => {},
    () => (typeof window !== "undefined" && window.localStorage.getItem(CLOSED_KEY) === "1") || false,
    () => false
  );

  function handleClose() {
    setDismissed(true);
    window.localStorage.setItem(CLOSED_KEY, "1");
  }

  if (dismissed || storedClosed) return null;

  return (
    <div className="border-b border-border bg-surface">
      <Container className="flex h-10 items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-sm text-text-secondary">{message}</span>
          {linkUrl ? (
            <a
              href={linkUrl}
              aria-label={linkLabel ?? "Learn more"}
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="hidden sm:inline">{linkLabel}</span>
              <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={handleClose}
          className="shrink-0 rounded-radius-xs p-1 text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </Container>
    </div>
  );
}
