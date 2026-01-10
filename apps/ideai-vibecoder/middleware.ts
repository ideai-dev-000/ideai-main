/**
 * @fileoverview Middleware for IdeaI VibeCoder - Authentication protection
 *
 * @module Middleware
 * @description
 * CRITICAL: Protects all routes except auth API routes.
 * Requires authentication for all vibe suite functionality.
 * Anonymous users are blocked from accessing any content.
 */

import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // CRITICAL: Allow ONLY Better Auth API routes to pass through
  // All other routes require authentication
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Get session using Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Check if user is authenticated (not anonymous)
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-") &&
    !session.user.isAnonymous;

  // CRITICAL: Block ALL API routes except auth for unauthenticated users
  if (pathname.startsWith("/api/") && !isAuthenticated) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  // CRITICAL: All other routes are handled by AuthGuard component
  // Middleware allows through, but AuthGuard will show landing page
  // for unauthenticated users and protected content for authenticated users

  // If authenticated and trying to access login/register pages, redirect home
  if (isAuthenticated && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/chats/:path*",
    "/projects/:path*",
    "/api/:path*",
    "/login",
    "/register",

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
