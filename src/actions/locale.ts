"use server";

import { cookies } from "next/headers";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/resolve-translation";
import { LOCALE_COOKIE } from "@/lib/i18n/get-locale";

export async function setLocale(locale: string): Promise<{ success: boolean }> {
  const parsed = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, parsed, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return { success: true };
}
