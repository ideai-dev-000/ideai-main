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

  // Allow Better Auth API routes to pass through
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Get session using Better Auth
  // Wrap in try-catch to handle invalid/expired tokens gracefully
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    // Invalid/expired session token - continue as unauthenticated
    // This prevents errors when cookies contain stale tokens
    console.debug("Session check failed (likely expired token):", error);
  }

  if (!session?.user) {
    // Allow API routes to proceed without authentication for anonymous chat creation
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Allow homepage for anonymous users
    if (pathname === "/") {
      return NextResponse.next();
    }

    // Redirect protected pages to login
    if (["/chats", "/projects"].some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Allow login and register pages
    if (["/login", "/register"].includes(pathname)) {
      return NextResponse.next();
    }

    // For any other protected routes, allow anonymous (Better Auth handles this)
    return NextResponse.next();
  }

  // If authenticated and trying to access login/register, redirect home
  if (session?.user && ["/login", "/register"].includes(pathname)) {
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
