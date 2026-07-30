// ============================================================================
// Stratifit — Next.js Proxy
// Handles locale-aware URL rewriting, Supabase session refresh, and admin
// route protection before the request reaches the App Router.
// ============================================================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  isValidLocale,
  LOCALE_COOKIE_NAME,
} from "@/lib/locale";
import type { CmsLanguage } from "@/lib/types/cms";

const LOCALE_PATH_REGEX = /^\/(fr|de|es)(?:\/|$)/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------------------------
  // Static assets, API routes, and Next internals bypass locale handling.
  // -------------------------------------------------------------------------
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /^\/[\w-]+\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json)$/.test(pathname)
  ) {
    return NextResponse.next({ request });
  }

  // -------------------------------------------------------------------------
  // Admin routes: existing Supabase auth + protection logic only.
  // -------------------------------------------------------------------------
  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  // -------------------------------------------------------------------------
  // Public pages: single-root URL with internal language switching.
  // -------------------------------------------------------------------------

  // 1. ?lang=xx query param: set cookie and redirect to clean URL.
  const queryLang = request.nextUrl.searchParams.get("lang");
  if (queryLang && isValidLocale(queryLang)) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("lang");
    const response = NextResponse.redirect(cleanUrl);
    return setLocaleCookie(response, queryLang);
  }

  // 2. Legacy path-prefixed locales: /fr, /de, /es -> redirect to clean URL.
  const pathMatch = pathname.match(LOCALE_PATH_REGEX);
  if (pathMatch) {
    const locale = pathMatch[1] as CmsLanguage;
    const cleanPath = pathname.replace(LOCALE_PATH_REGEX, "/") || "/";
    const cleanUrl = new URL(cleanPath, request.url);
    const response = NextResponse.redirect(cleanUrl);
    return setLocaleCookie(response, locale);
  }

  // 3. Normal request: resolve locale from cookie or default, and pass through.
  const existingLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const locale =
    existingLocale && isValidLocale(existingLocale)
      ? existingLocale
      : DEFAULT_LOCALE;
  const response = NextResponse.next({ request });
  return setLocaleCookie(response, locale);
}

/** Store the locale in a first-party cookie and return the updated response. */
function setLocaleCookie(
  response: NextResponse,
  locale: CmsLanguage,
  maxAge: number = 60 * 60 * 24 * 365
): NextResponse {
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge,
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}

/** Protect admin routes with Supabase session check. */
async function handleAdminAuth(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    user = null;
  }

  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
