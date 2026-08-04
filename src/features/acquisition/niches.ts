import type { AcquisitionBusiness } from "@/features/acquisition/queries";

export interface AcquisitionNicheMeta {
  slug: string;
  label: string;
  emoji: string;
  accent: string;
  description: string;
  why_title: string;
  why_description: string;
  stats: { value: string; label: string; hint: string }[];
}

/**
 * Presentation metadata for acquisition niches. Business listings themselves
 * are editable marketing content stored in `acquisition_section.businesses`;
 * this catalog supplies the approved niche framing (label, emoji, copy).
 */
export const ACQUISITION_NICHES: AcquisitionNicheMeta[] = [
  {
    slug: "ecommerce",
    label: "Ecommerce",
    emoji: "🛒",
    accent: "#F59E0B",
    description:
      "Acquire profitable, turnkey online stores with established traffic, revenue, and brand equity.",
    why_title: "Why Ecommerce?",
    why_description:
      "Ecommerce businesses represent one of the most accessible acquisition opportunities in today's market. With proven product-market fit, established revenue streams, and significant growth potential, these assets offer a faster path to ownership than building from scratch.",
    stats: [
      { value: "$85K", label: "Avg. Revenue", hint: "across our ecommerce portfolio" },
      { value: "4.2×", label: "Multiplier", hint: "typical asking price multiple" },
      { value: "12+", label: "Traffic Sources", hint: "diversified acquisition channels" },
    ],
  },
  {
    slug: "saas",
    label: "SaaS",
    emoji: "☁️",
    accent: "#6C5CE7",
    description:
      "Own established software businesses with recurring revenue, low churn, and scalable infrastructure.",
    why_title: "Why SaaS?",
    why_description:
      "SaaS businesses represent one of the most attractive acquisition opportunities in today's market. With proven business models, established revenue streams, and significant growth potential, these assets offer a faster path to ownership than building from scratch.",
    stats: [
      { value: "$13.2K", label: "Avg. MRR", hint: "across our SaaS portfolio" },
      { value: "92%", label: "Gross Margin", hint: "low infrastructure costs" },
      { value: "3.2%", label: "Avg. Churn Rate", hint: "strong retention" },
    ],
  },
  {
    slug: "agency",
    label: "Agency",
    emoji: "🏢",
    accent: "#10B981",
    description:
      "Buy a fully operational digital agency with existing clients, team, systems, and recurring revenue.",
    why_title: "Why Agency?",
    why_description:
      "Agencies combine recurring client revenue with a skilled team and established systems. Acquiring one gives you an operating business with pipelines, retainers, and a track record — without the years of client-building.",
    stats: [
      { value: "$22K", label: "Avg. Monthly Revenue", hint: "across our agency portfolio" },
      { value: "8+", label: "Retainer Clients", hint: "average active accounts" },
      { value: "95%", label: "Client Retention", hint: "strong relationships" },
    ],
  },
  {
    slug: "ai-tools",
    label: "AI Tools",
    emoji: "🤖",
    accent: "#3B82F6",
    description:
      "Acquire production AI applications generating real revenue with established user bases.",
    why_title: "Why AI Tools?",
    why_description:
      "AI tool businesses sit at the intersection of high growth and proven demand. These are production applications with paying users, working infrastructure, and a fast-moving market — prime assets for operators who can scale.",
    stats: [
      { value: "$18.5K", label: "Avg. MRR", hint: "across our AI portfolio" },
      { value: "40K+", label: "Active Users", hint: "average user base" },
      { value: "5×", label: "Growth Multiple", hint: "market momentum" },
    ],
  },
  {
    slug: "personal-brand",
    label: "Personal Brand",
    emoji: "🌟",
    accent: "#F59E0B",
    description:
      "Acquire established personal brands with engaged audiences and diversified revenue streams.",
    why_title: "Why Personal Brand?",
    why_description:
      "Personal brands are attention assets. With a loyal audience and multiple revenue streams — sponsorships, products, community — they compound in value and transfer cleanly to a new owner who keeps the voice.",
    stats: [
      { value: "$14K", label: "Avg. Monthly Revenue", hint: "diversified income streams" },
      { value: "120K+", label: "Avg. Followers", hint: "across platforms" },
      { value: "60%", label: "Audience Retention", hint: "engaged community" },
    ],
  },
  {
    slug: "local-business",
    label: "Local Business",
    emoji: "📍",
    accent: "#F97316",
    description:
      "Own profitable local businesses with established locations, loyal customers, and strong community presence.",
    why_title: "Why Local Business?",
    why_description:
      "Local businesses deliver predictable cash flow with a physical moat. Established locations, loyal customers, and a strong community presence make these resilient, owner-operable assets.",
    stats: [
      { value: "4.8★", label: "Avg. Rating", hint: "across our local portfolio" },
      { value: "10+", label: "Years Operating", hint: "average track record" },
      { value: "82%", label: "Returning Customers", hint: "repeat business" },
    ],
  },
  {
    slug: "digital-products",
    label: "Digital Products",
    emoji: "📦",
    accent: "#8B5CF6",
    description:
      "Own passive-income digital product businesses with zero inventory, high margins, and global reach.",
    why_title: "Why Digital Products?",
    why_description:
      "Digital products are the purest form of passive income: zero inventory, near-100% margins, and a global market. Acquiring one gives you an asset that sells while you sleep.",
    stats: [
      { value: "96%", label: "Avg. Margin", hint: "near-zero cost of goods" },
      { value: "$12K", label: "Avg. Monthly Revenue", hint: "across our portfolio" },
      { value: "40+", label: "Countries", hint: "global customer reach" },
    ],
  },
];

export const NICHE_ROUTES = ACQUISITION_NICHES.map((n) => n.slug);

const NICHE_BY_SLUG = new Map(ACQUISITION_NICHES.map((n) => [n.slug, n]));

export function getNicheMeta(slug: string): AcquisitionNicheMeta | null {
  return NICHE_BY_SLUG.get(slug) ?? null;
}

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
