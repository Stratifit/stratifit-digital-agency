"use client";

import * as React from "react";

interface AnnouncementViewProps {
  slides: string[];
  linkUrl?: string;
}

export function AnnouncementBarView({ slides, linkUrl }: AnnouncementViewProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed || slides.length === 0) return null;

  return (
    <div data-announcement-bar className="border-b border-border bg-primary">
      {/* Slimmer horizontal padding than the shared Container (px-4 instead
          of px-6) so the announcement strip feels less bulky. All messages
          render together — one per line on mobile, side by side and centered
          on desktop. The dismiss control is absolutely positioned so the
          messages stay centered in the bar. */}
      <div className="relative mx-auto flex min-h-10 w-full max-w-[var(--container-lg)] flex-col items-center justify-center gap-y-0.5 px-11 py-1.5 sm:h-10 sm:flex-row sm:gap-x-8 sm:py-0 lg:px-8">
        {slides.map((message, index) => {
          const inner = (
            <>
              <span className="truncate whitespace-nowrap text-sm font-medium text-text-inverse">
                {message}
              </span>
              <span
                className="top-banner__cta-icon flex shrink-0 items-center"
                aria-hidden="true"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.41675 6.41663H15.5834V15.5833"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.41675 15.5833L15.5834 6.41663"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </>
          );
          const itemClass =
            "flex max-w-full min-w-0 items-center gap-1 text-text-inverse transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)]";
          return linkUrl ? (
            <a
              key={`${index}-${message}`}
              href={linkUrl}
              aria-label={message}
              className={`${itemClass} hover:text-text-inverse/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse`}
            >
              {inner}
            </a>
          ) : (
            <span key={`${index}-${message}`} className={itemClass}>
              {inner}
            </span>
          );
        })}
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xs p-1 text-text-inverse transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-inverse/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse"
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
      </div>
    </div>
  );
}
