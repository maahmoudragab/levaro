import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Secret gate key to access admin login (can be configured in .env.local via ADMIN_SECRET_KEY)
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "levaro2026";
const GATE_COOKIE_NAME = "levaro_admin_gate";

/**
 * Applies strict SEO shields (Anti-Indexing) and Stealth 404 Cloaking on `/admin`.
 * 
 * Rules:
 * 1. All `/admin/*` routes return `X-Robots-Tag: noindex, nofollow, noarchive` (Option 3).
 * 2. Authenticated admins can navigate freely.
 * 3. Unauthenticated visitors visiting `/admin` without secret key get HTTP 404 Not Found (Option 2).
 * 4. To unlock `/admin/login`, the admin simply visits `/admin/login?key=levaro2026`.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const { pathname, searchParams } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return supabaseResponse;
  }

  // 1. Apply Anti-Indexing & Security Headers to all /admin responses (Option 3)
  const applySecurityHeaders = (response: NextResponse) => {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  };

  // 2. Check if user already has an authenticated Supabase session
  const { data: claims } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(claims);

  const isLoginPage =
    pathname === "/admin/login" ||
    pathname === "/admin/login/forgot-password";

  // If already authenticated:
  if (isAuthenticated) {
    if (isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return applySecurityHeaders(NextResponse.redirect(url));
    }
    return applySecurityHeaders(supabaseResponse);
  }

  // 3. Stealth Cloaking Check for unauthenticated visitors (Option 2):
  // Check if visitor has the secret access key in query params (?key=... or ?pass=...)
  const queryKey =
    searchParams.get("key") ||
    searchParams.get("pass") ||
    searchParams.get("access");
  const hasValidSecretKey = queryKey === ADMIN_SECRET_KEY;
  const hasGateCookie =
    request.cookies.get(GATE_COOKIE_NAME)?.value === "granted";

  if (hasValidSecretKey) {
    // Grant gate access cookie and redirect to clean login URL without leaking secret key in history
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.pathname = "/admin/login";
    cleanUrl.searchParams.delete("key");
    cleanUrl.searchParams.delete("pass");
    cleanUrl.searchParams.delete("access");

    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(GATE_COOKIE_NAME, "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/admin",
    });
    return applySecurityHeaders(response);
  }

  // If visitor already unlocked the gate cookie and is on login page, allow login view
  if (hasGateCookie && isLoginPage) {
    return applySecurityHeaders(supabaseResponse);
  }

  // 4. STEALTH 404 MODE: Any stranger without active session or key gets 404 Not Found!
  const notFoundUrl = new URL("/_not-found", request.url);
  const cloakedResponse = NextResponse.rewrite(notFoundUrl, { status: 404 });
  return applySecurityHeaders(cloakedResponse);
}
