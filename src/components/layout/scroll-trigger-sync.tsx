"use client";

import * as React from "react";
import { ScrollTrigger } from "@/lib/animation/gsap";

/**
 * Recalibrates ScrollTrigger positions after client-side content updates that
 * do not remount components — e.g. router.refresh() on language switch, which
 * swaps translated content without recreating the Reveal components.
 *
 * A debounced MutationObserver fires one ScrollTrigger.refresh() after the new
 * content commits. refresh() only recalculates existing trigger positions —
 * it never creates duplicates, never replays completed once:true animations,
 * and leaves already-visible content untouched.
 */
export function ScrollTriggerSync() {
  React.useEffect(() => {
    let timer: number | undefined;

    const refresh = () => {
      if (ScrollTrigger.getAll().length > 0) {
        ScrollTrigger.refresh();
      }
    };

    const observer = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(refresh, 250);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
