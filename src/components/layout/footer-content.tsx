"use client";

import * as React from "react";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import type { PublicFooterGroup } from "@/features/footer/queries";
import { SocialIcons } from "@/components/ui/social-icons";

export function FooterContent({
  groups,
  locale,
  siteName,
  siteDescription,
  socialLinks,
  currentYear,
  className,
  onLinkClick,
  backToTopRef,
}: {
  groups: PublicFooterGroup[];
  locale: string;
  siteName: string;
  siteDescription: string | null;
  socialLinks: Record<string, string> | null;
  currentYear: number;
  className?: string;
  onLinkClick?: () => void;
  backToTopRef?: React.RefObject<HTMLElement | null>;
}) {
  function handleBackToTop() {
    if (backToTopRef?.current) {
      backToTopRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary">
            <span className="text-[10px] font-extrabold text-text-inverse">
              {siteName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="font-display text-base font-extrabold uppercase tracking-tight text-white">
            {siteName}
          </span>
        </div>
        {siteDescription ? (
          <p className="text-sm font-medium leading-snug text-text-subtle sm:max-w-[80%] sm:leading-relaxed">
            {siteDescription}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2.5">
            <h4 className="mb-0.5 text-xs font-bold uppercase tracking-wider text-white">
              {resolveTranslation(group.title_translations, locale)}
            </h4>
            {group.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.is_external ? "_blank" : undefined}
                rel={link.is_external ? "noopener noreferrer" : undefined}
                onClick={onLinkClick}
                className="text-xs text-text-subtle transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {resolveTranslation(link.label_translations, locale)}
              </a>
            ))}
          </div>
        ))}
      </div>

      <SocialIcons socialLinks={socialLinks} />

      <div className="space-y-4">
        <div className="h-px w-full bg-primary/30" />
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium text-text-subtle">
            © {currentYear} {siteName}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={handleBackToTop}
            className="text-[10px] font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}
