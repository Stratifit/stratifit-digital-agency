import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that must stay reachable without a session.
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Optimistic auth gate for the admin area: Next.js 16 swallows `redirect()`
  // thrown from the (dashboard) layout, so without this check the admin page
  // shells render for unauthenticated visitors (data itself stays protected by
  // RLS + per-action requireAdmin()). Presence of a Supabase session cookie is
  // a cheap, non-blocking signal; the layout still does the authoritative
  // session check after the gate lets a request through.
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    const hasSessionCookie = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith("sb-"));
    if (!hasSessionCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
  }

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

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all request paths except static assets and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
