"use client";

import * as React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-4 text-base leading-7 text-text-secondary">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-button bg-primary px-6 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
