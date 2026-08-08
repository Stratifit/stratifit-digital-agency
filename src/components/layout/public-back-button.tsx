"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { t } from "@/lib/i18n/ui-strings";

/**
 * Floating back arrow shown on every public page except the homepage.
 * Returns the visitor to their last click via native history — an in-app
 * route they navigated from, or an external referrer (Google / shared
 * link). Falls back to the homepage only when there is no history at all
 * (fresh tab / typed URL).
 *
 * The button clears the sticky header plus the announcement bar. While the
 * announcement bar is visible it stays put; when the bar scrolls out of view
 * (or is dismissed) the button glides up by exactly the bar's height, so it
 * always hugs the sticky header with the same gap.
 */
export function PublicBackButton({ locale }: { locale?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // The homepage is the root — there is no page "behind" it to go back to,
  // so the button (and its listeners) are not needed there.
  const isHome = pathname === "/";

  // Track the previous in-app route so the back arrow returns visitors to
  // the exact page they came from. More reliable than window.history.length,
  // which is misleading on mobile (it counts every tab in the session).
  const [prevPath, setPrevPath] = useState<string | null>(null);
  const pathRef = useRef(pathname);

  useEffect(() => {
    if (pathRef.current !== pathname) {
      setPrevPath(pathRef.current);
      pathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (isHome) return;

    let raf = 0;
    let lastBarHeight: number | null = null;
    let lastTransform = "";

    const update = () => {
      const button = buttonRef.current;
      if (!button) return;

      const bar = document.querySelector<HTMLElement>("[data-announcement-bar]");

      // Height of the announcement bar: h-10 (40px) + 1px border-b.
      let height = lastBarHeight ?? 41;
      let visible = 0;

      if (bar) {
        const rect = bar.getBoundingClientRect();
        height = rect.height;
        lastBarHeight = height;
        // How much of the bar is still in the viewport (0 once scrolled away).
        visible = Math.min(height, Math.max(0, rect.bottom));
      }

      // The class-based top already accounts for the fully visible bar;
      // lift the button by the portion of the bar that has scrolled away.
      const transform = `translateY(${visible - height}px)`;
      if (transform !== lastTransform) {
        lastTransform = transform;
        button.style.transform = transform;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Re-position when the bar is dismissed (unmounted) or later appears.
    const observer = new MutationObserver(onScroll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // The homepage is the root — there is no page "behind" it to go back to.
  if (isHome) {
    return null;
  }

  function goBack() {
    // Always return to the visitor's last click: use native browser history
    // whenever there is an entry to go back to — either an in-app route the
    // visitor navigated from, or an external referrer (e.g. Google / shared
    // link). Only fall back to the homepage when the page was opened with no
    // previous history at all (fresh tab / typed URL).
    const hasBackHistory =
      prevPath !== null ||
      (typeof document !== "undefined" && document.referrer !== "");
    if (hasBackHistory) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={t(locale ?? "en", "goBack")}
      onClick={goBack}
      className="fixed left-1 top-28 z-50 rounded-full bg-white/5 p-2 backdrop-blur-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:top-32"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="size-5 text-text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-primary"
      >
        <path
          fillRule="evenodd"
          d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
