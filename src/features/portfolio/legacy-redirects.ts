export const LEGACY_PORTFOLIO_REDIRECTS: Record<string, string> = {
  "aura-cosmetics-identity": "/work/clenqo",
};

export function getLegacyPortfolioRedirect(slug: string): string | null {
  return LEGACY_PORTFOLIO_REDIRECTS[slug] ?? null;
}
