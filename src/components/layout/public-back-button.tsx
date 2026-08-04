"use client";

import { usePathname, useRouter } from "next/navigation";
import { t } from "@/lib/i18n/ui-strings";

/**
 * Floating back arrow shown on every public page except the homepage.
 * Returns the visitor to the section/page they clicked from (router.back()),
 * falling back to the homepage when there is no browser history.
 */
export function PublicBackButton({ locale }: { locale?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // The homepage is the root — there is no page "behind" it to go back to.
  if (pathname === "/") {
    return null;
  }

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      aria-label={t(locale ?? "en", "goBack")}
      onClick={goBack}
      className="fixed left-1 top-16 z-50 rounded-full bg-white/5 p-2 backdrop-blur-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:top-20"
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
