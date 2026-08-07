import {
  ClipboardCheck,
  Cookie,
  CreditCard,
  Eye,
  FileText,
  Globe,
  Lock,
  RefreshCw,
  Scale,
  Settings,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

/**
 * Approved icon keys for detail-page section headings. The CMS may only
 * select from this closed set — never arbitrary icon names from the database.
 */
export const DETAIL_PAGE_ICON_KEYS = [
  "file-text",
  "eye",
  "shield-check",
  "lock",
  "globe",
  "credit-card",
  "triangle-alert",
  "scale",
  "cookie",
  "smartphone",
  "settings",
  "clipboard-check",
  "refresh",
] as const;

export type DetailPageIconKey = (typeof DETAIL_PAGE_ICON_KEYS)[number];

export const DETAIL_PAGE_ICONS: Record<DetailPageIconKey, LucideIcon> = {
  "file-text": FileText,
  eye: Eye,
  "shield-check": ShieldCheck,
  lock: Lock,
  globe: Globe,
  "credit-card": CreditCard,
  "triangle-alert": TriangleAlert,
  scale: Scale,
  cookie: Cookie,
  smartphone: Smartphone,
  settings: Settings,
  "clipboard-check": ClipboardCheck,
  refresh: RefreshCw,
};

export const DETAIL_PAGE_ICON_LABELS: Record<DetailPageIconKey, string> = {
  "file-text": "Document",
  eye: "Eye",
  "shield-check": "Shield check",
  lock: "Lock",
  globe: "Globe",
  "credit-card": "Credit card",
  "triangle-alert": "Warning",
  scale: "Scale / balance",
  cookie: "Cookie",
  smartphone: "Smartphone",
  settings: "Settings",
  "clipboard-check": "Checklist",
  refresh: "Refresh",
};

export function isDetailPageIconKey(value: unknown): value is DetailPageIconKey {
  return (
    typeof value === "string" &&
    (DETAIL_PAGE_ICON_KEYS as readonly string[]).includes(value)
  );
}
