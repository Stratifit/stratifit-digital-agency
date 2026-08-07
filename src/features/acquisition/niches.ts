import type { AcquisitionBusiness } from "@/features/acquisition/queries";
import type { PublicAcquisitionNiche } from "@/features/acquisition/niche-queries";

export type { PublicAcquisitionNiche };

export function parsePriceToNumber(price: string): number | null {
  const digits = price.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const value = parseFloat(digits);
  return Number.isFinite(value) ? value : null;
}

export function formatCompactPrice(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `$${Math.round(value)}`;
}

export function getNicheBusinesses(
  businesses: AcquisitionBusiness[],
  slug: string
): AcquisitionBusiness[] {
  return businesses.filter((b) => b.category === slug);
}

export function getNicheSummary(businesses: AcquisitionBusiness[], slug: string) {
  const list = getNicheBusinesses(businesses, slug);
  const prices = list
    .map((b) => parsePriceToNumber(b.price))
    .filter((p): p is number => p !== null);
  const avg =
    prices.length > 0
      ? formatCompactPrice(prices.reduce((a, b) => a + b, 0) / prices.length)
      : null;
  return { count: list.length, avg };
}

/** Resolves a niche label for the current locale with an English fallback. */
export function nicheLabel(niche: PublicAcquisitionNiche, locale: string): string {
  const t = niche.label_translations ?? {};
  return t[locale]?.trim() || t.en || niche.slug;
}
