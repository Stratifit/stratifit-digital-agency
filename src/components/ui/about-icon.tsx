import type { LucideIcon } from "lucide-react";
import { Bolt, Users, Globe, ChartBar, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const ICONS: Record<string, LucideIcon> = {
  bolt: Bolt,
  users: Users,
  globe: Globe,
  chart: ChartBar,
  sparkles: Sparkles,
};

/**
 * Approved icon set for the About page (stats band + values grid).
 * The CMS may only select from these options — no arbitrary icons.
 */
export const ABOUT_ICON_OPTIONS = [
  { value: "bolt", label: "Bolt" },
  { value: "users", label: "Users" },
  { value: "globe", label: "Globe" },
  { value: "chart", label: "Chart" },
  { value: "sparkles", label: "Sparkles" },
];

export function AboutIcon({
  name,
  className,
}: {
  name: string | null;
  className?: string;
}) {
  const Icon = ICONS[name ?? ""] ?? Sparkles;

  return <Icon className={cn("size-6", className)} aria-hidden="true" />;
}
