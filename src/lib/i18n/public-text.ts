/**
 * Normalizes text at the public rendering boundary.
 * CMS and database values remain unchanged; only visitor-facing output is
 * normalized.
 */
export function sanitizePublicText(value: string): string {
  const protectedRange = "€1k–€3k";
  const placeholder = "__STRATIFIT_PROTECTED_BUDGET_RANGE__";

  return value
    .replaceAll(protectedRange, placeholder)
    .replaceAll(/\s*[—–]\s*/g, ", ")
    .replaceAll(/\s+-\s+/g, ", ")
    .replaceAll(placeholder, protectedRange);
}
