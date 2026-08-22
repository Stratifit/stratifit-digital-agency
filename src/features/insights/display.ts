import type { PublicInsightCategory } from "./queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

/**
 * Dev fallback imagery keyed by the seeded insight slugs.
 * Used only when an insight has no featured media attached yet.
 * Matches the reference design so cards always show a real image.
 */
export const FALLBACK_IMAGES: Record<string, string> = {
  "the-future-of-digital-scalability":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop",
  "mastering-minimalist-ux-for-luxury-brands":
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop",
  "how-ai-is-revolutionizing-custom-automation":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop",
  "building-funnels-that-convert-at-3x-industry-average":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop",
  "why-brand-positioning-matters-more-than-ever-in-2026":
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop",
  "serverless-architecture-scaling-without-the-headaches":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop",
  "typography-systems-that-elevate-brand-perception":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop",
  "retention-over-acquisition-the-new-growth-playbook":
    "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop",
  "the-art-of-digital-transformation-a-ceos-guide":
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop",
  "headless-cms-vs-traditional-making-the-right-choice":
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
  "motion-design-principles-for-digital-products":
    "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop",
  "seo-in-the-age-of-ai-what-actually-works-now":
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop",
  "digital-maturity-audit":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop",
  "market-entry-playbook":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop",
  "strategy-before-tactics":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop",
  "design-systems-that-scale":
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop",
  "ux-research-on-a-budget":
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop",
  "accessibility-as-advantage":
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop",
  "core-web-vitals":
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
  "headless-vs-traditional":
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
  "website-security-basics":
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
  "ai-for-customer-service":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop",
  "human-in-the-loop":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop",
  "ai-content-workflows":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop",
  "brand-voice-guide":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop",
  "rebrand-without-losing-customers":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop",
  "brand-consistency-and-conversion":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop",
  "seo-in-the-age-of-ai":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop",
  "paid-media-funnel":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop",
  "content-marketing-roi":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop",
  "security-by-design":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop",
  "data-driven-decisions":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop",
  "cloud-vs-on-premise":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop",
};

/** Category-level fallback for any slug not in the explicit map above. */
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  strategy: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop",
  "design-ux": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop",
  "web-development": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop",
  "ai-automation": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop",
  branding: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop",
  "growth-marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop",
  technology: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop",
  design: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop",
  tech: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop",
  growth: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop",
};

/** Resolve the image to show for an insight card or hero. */
export function getInsightImage(
  featuredMediaUrl: string | null,
  slug: string,
  categorySlugs: string[]
): string | null {
  return (
    featuredMediaUrl ??
    FALLBACK_IMAGES[slug] ??
    (categorySlugs[0] ? CATEGORY_FALLBACK_IMAGES[categorySlugs[0]] : null)
  );
}

/** Format a published date for display, e.g. "Jun 28, 2026". */
export function formatInsightDate(
  iso: string | null,
  locale: string
): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/** Resolve the localized label for a category slug. */
export function getCategoryLabel(
  slug: string,
  categories: PublicInsightCategory[],
  locale: string
): string {
  const category = categories.find((c) => c.slug === slug);
  return category
    ? resolveTranslation(category.name_translations, locale) || slug
    : slug;
}
