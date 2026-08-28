import { resolveTranslation } from "./resolve-translation";
import { sanitizePublicText } from "./public-text";

export function resolvePublicTranslation(
  translations: Record<string, unknown> | null | undefined,
  locale: string
): string {
  return sanitizePublicText(resolveTranslation(translations, locale));
}
