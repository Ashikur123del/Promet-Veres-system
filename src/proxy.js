import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/allprompts"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/auth");

  const isPromptDetail = /^\/allprompts\/[^/]+$/.test(pathname);
  const isDashboard = pathname.startsWith("/dashboard");
  const isPayment = pathname.startsWith("/payment");

  const isProtected = isPromptDetail || isDashboard || isPayment;

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/register") && sessionCookie) {
    // Validate session cookie with auth server before redirecting. If the cookie is stale
    // or the auth server does not return a live session, allow the login/register page.
    try {
      const authBase = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const url = `${authBase.replace(/\/$/, "")}/api/auth/get-session`;

      // Development-only debug information to help diagnose stale cookies or misconfiguration.
      if (process.env.NODE_ENV !== "production") {
        try {
          const cookieHeader = request.headers.get('cookie') || '';
          const cookieNames = cookieHeader
            .split(';')
            .map(c => c.split('=')[0]?.trim())
            .filter(Boolean);
          console.debug('proxy: validating session cookie', { pathname, sessionCookiePresent: Boolean(sessionCookie), cookieNames, authGetSessionUrl: url });
        } catch (dbgErr) {
          console.debug('proxy: debug cookie parse failed', dbgErr?.message || dbgErr);
        }
      }

      const resp = await fetch(url, {
        headers: { cookie: request.headers.get('cookie') || '' },
      });

      if (process.env.NODE_ENV !== "production") {
        console.debug('proxy: auth get-session response', { ok: resp && resp.ok, status: resp && resp.status });
      }

      if (resp && resp.ok) {
        return NextResponse.redirect(new URL("/", request.url));
      } else {
        // session not valid; continue to login/register
        return NextResponse.next();
      }
    } catch (e) {
      // If validation fails due to network or other error, be conservative and allow login page
      console.warn('proxy: session validation failed, allowing login/register', e?.message || e);
      return NextResponse.next();
    }
  }

  if (isPublicRoute || sessionCookie || !isProtected) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/allprompts/:path*",
    "/payment/:path*",
    "/login",
    "/register",
  ],
};
