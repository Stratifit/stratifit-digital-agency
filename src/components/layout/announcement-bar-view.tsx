"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";

const SLIDE_MS = 4000;

interface AnnouncementViewProps {
  slides: string[];
  linkUrl?: string;
  linkLabel?: string;
}

export function AnnouncementBarView({ slides, linkUrl, linkLabel }: AnnouncementViewProps) {
  const [index, setIndex] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (dismissed) return null;

  const message = slides[index] ?? slides[0];

  return (
    <div className="border-b border-border bg-surface">
      <Container className="flex h-10 items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span key={index} className="truncate text-sm text-text-secondary">
            {message}
          </span>
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
          onClick={() => setDismissed(true)}
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
