/**
 * Trusted-by logo strip items mirrored from migration 00058's seed. Used to
 * pre-fill the CMS editor and to render the strip while the migration is
 * pending. The database remains the source of truth once applied.
 *
 * `icon` is one of: lumen, novus, pulse, vertex, orbit, nexus — rendered by
 * the TrustedByIcon map in the hero section.
 */
export const DEFAULT_TRUSTED_BY: { name: string; icon: string }[] = [
  { name: "LUMEN", icon: "lumen" },
  { name: "NOVUS", icon: "novus" },
  { name: "PULSE", icon: "pulse" },
  { name: "VERTEX", icon: "vertex" },
  { name: "ORBIT", icon: "orbit" },
  { name: "NEXUS", icon: "nexus" },
];

/** Allowed icon identifiers for trusted-by logo items. */
export const TRUSTED_BY_ICON_KEYS = [
  "lumen",
  "novus",
  "pulse",
  "vertex",
  "orbit",
  "nexus",
] as const;

export type TrustedByIconKey = (typeof TRUSTED_BY_ICON_KEYS)[number];
