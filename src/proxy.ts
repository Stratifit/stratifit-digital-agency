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
  SUPPORTED_LOCALES,
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
  // Public pages: path-prefixed locales.
  // -------------------------------------------------------------------------
  const localeResult = resolveLocaleFromPath(request);

  // Redirect legacy /?lang=xx URLs to the canonical path-prefixed form.
  if (localeResult.redirect) {
    return NextResponse.redirect(localeResult.redirectUrl);
  }

  // Rewrite /fr/<rest> -> /<rest> so the existing catch-all page works.
  const response = localeResult.rewrite
    ? NextResponse.rewrite(
        new URL(
          `${localeResult.targetPath}${request.nextUrl.search}`,
          request.url
        )
      )
    : NextResponse.next({ request });

  // Persist the locale in a cookie so Server Components can read it.
  return setLocaleCookie(response, localeResult.locale);
}

interface LocaleResolution {
  locale: CmsLanguage;
  rewrite: boolean;
  targetPath: string;
  redirect: boolean;
  redirectUrl: string;
}

/** Resolve locale from the URL path or legacy ?lang= query param. */
function resolveLocaleFromPath(request: NextRequest): LocaleResolution {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Legacy query-param locale: redirect to canonical path.
  const queryLang = searchParams.get("lang");
  if (queryLang && isValidLocale(queryLang)) {
    const newUrl = new URL(request.url);
    newUrl.searchParams.delete("lang");
    newUrl.pathname = queryLang === "en" ? "/" : `/${queryLang}`;
    return {
      locale: queryLang,
      rewrite: false,
      targetPath: "/",
      redirect: true,
      redirectUrl: newUrl.toString(),
    };
  }

  // Path-prefixed locale: /fr, /de, /es (and /en if ever used explicitly).
  const match = pathname.match(LOCALE_PATH_REGEX);
  if (match) {
    const locale = match[1] as CmsLanguage;
    const targetPath = pathname.replace(LOCALE_PATH_REGEX, "/") || "/";
    return {
      locale,
      rewrite: targetPath !== pathname,
      targetPath,
      redirect: false,
      redirectUrl: "",
    };
  }

  // No prefix: default to English on "/".
  return {
    locale: DEFAULT_LOCALE,
    rewrite: false,
    targetPath: pathname,
    redirect: false,
    redirectUrl: "",
  };
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
