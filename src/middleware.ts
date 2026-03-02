/**
 * Next.js Edge Middleware — server-side auth guard.
 *
 * Protects /dashboard/* routes before the page even renders.
 * Checks for the JWT token in:
 *   1. The Authorization header (Bearer <token>)
 *   2. The qh_token cookie (for future httpOnly cookie migration)
 *
 * If no token is present, redirects to the home page.
 * Token validity is NOT verified here (edge runtime has no Node.js crypto);
 * the real verification happens in the Express /api/auth/me call made by AuthContext.
 *
 * This prevents unauthenticated page flashes before DashboardGuard kicks in.
 */

import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard dashboard routes
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  // Check for token in cookie (set by the client via document.cookie or httpOnly future)
  const tokenCookie = request.cookies.get("qh_token")?.value;

  // Check for Authorization header (used by API requests from the browser)
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const hasToken = Boolean(tokenCookie ?? bearerToken);

  if (!hasToken) {
    // Redirect to home with a query param so the page can auto-open the sign-in modal
    const redirectUrl = new URL("/?signin=required", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
