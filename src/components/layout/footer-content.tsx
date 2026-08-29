"use client";

import * as React from "react";
import Link from "next/link";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import { t } from "@/lib/i18n/ui-strings";
import type { PublicFooterGroup } from "@/features/footer/queries";
import { ArrowUp } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SocialIcons } from "@/components/ui/social-icons";
import { Reveal } from "@/components/ui/reveal";
import { requestCookieSettingsEdit } from "@/components/cookie/cookie-consent-banner";

// Track the in-flight scroll so a second click cleanly restarts it.
let cancelScrollToTop: (() => void) | undefined;

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

    const start = scroller.scrollTop;
    if (start <= 0) return;

    // Reduced motion: jump straight to the top instead of animating.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scroller.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // Native behavior:"smooth" scrolls are compositor-driven and get cancelled
    // mid-flight under heavy GSAP ScrollTrigger activity, layout shifts, or
    // leftover touch momentum — which makes the button stop halfway or not move
    // at all. Drive the scroll ourselves: every frame re-asserts the position,
    // so nothing can interrupt it, and the final frame force-lands on 0.
    cancelScrollToTop?.();

    const duration = Math.min(900, 350 + start * 0.25);
    const startTime = performance.now();
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
      cancelScrollToTop = undefined;
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    };
    cancelScrollToTop = cancel;

    // Let the user interrupt and take over at any moment.
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      // easeInOutCubic — starts slow, accelerates, then eases into the top.
      const eased =
        progress < 0.5
          ? 4 * progress ** 3
          : 1 - (-2 * progress + 2) ** 3 / 2;
      // behavior: "auto" is synchronous, so this re-asserts the position every
      // frame and nothing can cancel the animation.
      scroller.scrollTo({ top: start * (1 - eased), behavior: "auto" });

      if (cancelled) return;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Guarantee the page lands exactly at the top (announcement bar
        // visible), even if the layout shifted while we were animating.
        scroller.scrollTo({ top: 0, behavior: "auto" });
        cancelScrollToTop = undefined;
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchstart", cancel);
      }
    };

    requestAnimationFrame(step);
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
            © {currentYear} {siteName}. {t(locale, "allRightsReserved")}{" "}
            <button
              type="button"
              onClick={requestCookieSettingsEdit}
              className="ml-1 inline font-bold uppercase tracking-wider text-primary underline underline-offset-2 transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {t(locale, "cookieSettings")}
            </button>
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
