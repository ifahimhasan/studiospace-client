import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Private routes. A logged-in user keeps their session cookie across reloads,
 * so reloading any of these never sends them to Login. Visitors without a
 * session go to /login?redirect=<where they wanted to go>.
 */
export function middleware(request) {
  if (getSessionCookie(request)) return NextResponse.next();
  const url = new URL("/login", request.url);
  url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/add-studio/:path*", "/my-listings/:path*", "/my-bookings/:path*", "/studios/edit/:path*"],
};
