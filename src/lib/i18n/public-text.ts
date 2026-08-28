/**
 * Normalizes text at the public rendering boundary.
 * CMS and database values remain unchanged; only visitor-facing output is
 * normalized.
 */
export function sanitizePublicText(value: string): string {
  return value.replaceAll(/\s*—\s*/g, ", ");
}
