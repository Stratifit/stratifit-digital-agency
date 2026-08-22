import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buttonClasses, type ButtonClassesOptions } from "./button";
import { cn } from "@/lib/cn";

export interface LinkButtonProps
  extends ButtonClassesOptions,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> {
  href: string;
  /** Open in a new tab (external links). Defaults to true for non-internal hrefs. */
  external?: boolean;
  children: ReactNode;
}

function isInternalHref(href: string): boolean {
  return (
    href.startsWith("#") ||
    (href.startsWith("/") && !href.startsWith("//"))
  );
}

/**
 * A link styled like a <Button>. Use this instead of nesting <a> inside <Button>
 * (which is invalid HTML). Internal hrefs use next/link for client-side navigation;
 * external hrefs render a plain anchor with target/rel.
 */
export function LinkButton({
  href,
  variant,
  size,
  className,
  external,
  children,
  ...props
}: LinkButtonProps) {
  const isExternal = external ?? !isInternalHref(href);
  const classes = buttonClasses({ variant, size, className });

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

/** Shared className for links that should look like buttons (e.g. inside <Card>). */
export function linkButtonClasses(options: ButtonClassesOptions = {}): string {
  return cn(buttonClasses(options));
}
