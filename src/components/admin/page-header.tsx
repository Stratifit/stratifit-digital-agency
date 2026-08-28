import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  backHref,
  backLabel = "Back to content",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span aria-hidden="true">←</span>
            {backLabel}
          </Link>
        ) : null}
        {eyebrow ? (
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">
            <span aria-hidden="true" className="h-px w-4 bg-primary/50" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
