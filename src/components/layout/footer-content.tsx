"use client";

import * as React from "react";
import Link from "next/link";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import type { PublicFooterGroup } from "@/features/footer/queries";
import { ArrowUp } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SocialIcons } from "@/components/ui/social-icons";
import { Reveal } from "@/components/ui/reveal";

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
    // Prefer the element that actually scrolls the page (e.g. a custom scroll
    // container if the footer is rendered inside one), otherwise the document's
    // scroller. Scrolling to 0 lands on the announcement bar + sticky header.
    const scroller =
      backToTopRef?.current ??
      document.scrollingElement ??
      document.documentElement;
    scroller.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Reveal variant="calm" className={className}>
      <div className="space-y-4">
        <Link
          href="/"
          aria-label={`${siteName} home`}
          className="inline-flex w-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <BrandLogo alt={siteName} />
        </Link>
        {siteDescription ? (
          <p className="text-sm font-medium leading-snug text-text-subtle sm:max-w-[80%] sm:text-[15px] sm:leading-relaxed">
            {siteDescription}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="flex min-w-0 flex-col gap-2.5">
            <h4 className="mb-0.5 text-xs font-bold uppercase tracking-wider text-white break-words sm:text-sm">
              {resolveTranslation(group.title_translations, locale)}
            </h4>
            {group.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.is_external ? "_blank" : undefined}
                rel={link.is_external ? "noopener noreferrer" : undefined}
                onClick={onLinkClick}
                className="text-xs text-text-subtle transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary break-words sm:text-sm"
              >
                {resolveTranslation(link.label_translations, locale)}
              </a>
            ))}
          </div>
        ))}
      </div>

      <SocialIcons socialLinks={socialLinks} locale={locale} />

      <div className="space-y-4">
        <div className="h-px w-full bg-primary/30" />
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium text-text-subtle sm:text-xs">
            © {currentYear} {siteName}. {t(locale, "allRightsReserved")}
          </p>
          <button
            type="button"
            onClick={handleBackToTop}
            className="group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-xs"
          >
            <ArrowUp
              aria-hidden="true"
              className="size-3.5 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:-translate-y-0.5"
              strokeWidth={2.5}
            />
            {t(locale, "backToTop")}
          </button>
        </div>
      </div>
    </Reveal>
  );
}
