import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/allprompts"];

export function middleware(request) {
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
    return NextResponse.redirect(new URL("/", request.url));
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
