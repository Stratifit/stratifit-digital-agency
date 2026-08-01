import { cookies } from "next/headers";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./resolve-translation";

export const LOCALE_COOKIE = "stratifit_locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;

  if (value && (SUPPORTED_LOCALES as readonly string[]).includes(value)) {
    return value as Locale;
  }

  return DEFAULT_LOCALE;
}
