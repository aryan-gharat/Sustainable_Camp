import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, AUTH_COOKIE_NAME } from "./lib/jwt";
import { hasRoleAccess, getRoleDefaultPath } from "./lib/rbac";
import { Role } from "./types/auth";

// Public routes accessible without authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/health",
];

// Static file patterns to bypass middleware completely
const PUBLIC_FILE_EXTENSIONS = [
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
  ".css",
  ".js",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static resources and internal Next.js assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/static") ||
    PUBLIC_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  ) {
    return NextResponse.next();
  }

  // 2. Read authentication token from HTTP-only cookie
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await verifyJWT(token) : null;
  const isAuthenticated = !!payload;

  // 3. Handle Auth pages (/login, /register) when already authenticated
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated && payload?.role) {
      const defaultDashboard = getRoleDefaultPath(payload.role as Role);
      return NextResponse.redirect(new URL(defaultDashboard, request.url));
    }
    return NextResponse.next();
  }

  // 4. Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 5. Require authentication for all protected routes
  if (!isAuthenticated || !payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to continue." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Role-Based Access Control (RBAC) validation
  const userRole = payload.role as Role;
  const isAllowed = hasRoleAccess(userRole, pathname);

  if (!isAllowed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Forbidden: You do not possess the required permissions for this resource.",
          requiredRole: pathname.split("/")[1]?.toUpperCase(),
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    // Redirect to their own role's home with an access alert
    const homeUrl = new URL(getRoleDefaultPath(userRole), request.url);
    homeUrl.searchParams.set("unauthorized_attempt", pathname);
    return NextResponse.redirect(homeUrl);
  }

  // 7. Inject authenticated user headers for downstream server components / routes
  const response = NextResponse.next();
  response.headers.set("x-user-id", payload.userId);
  response.headers.set("x-user-role", payload.role);
  response.headers.set("x-user-email", payload.email);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
