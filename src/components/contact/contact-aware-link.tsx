import type { ReactNode } from "react";
import { buttonClasses, type ButtonClassesOptions } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { ContactTrigger } from "./contact-trigger";

export interface ContactAwareLinkProps extends ButtonClassesOptions {
  href?: string | null;
  children: ReactNode;
}

/**
 * Renders a styled CTA that opens the contact popup when the destination is
 * the contact page (or missing), and a normal link otherwise.
 */
export function ContactAwareLink({
  href,
  variant,
  size,
  className,
  children,
}: ContactAwareLinkProps) {
  if (!href || href === "/contact") {
    return (
      <ContactTrigger className={buttonClasses({ variant, size, className })}>
        {children}
      </ContactTrigger>
    );
  }

  return (
    <LinkButton href={href} variant={variant} size={size} className={className}>
      {children}
    </LinkButton>
  );
}
