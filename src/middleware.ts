// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ----------------------
// Public pages
// ----------------------
const PUBLIC_PATHS = ["/login", "/otp"];

// ----------------------
// Role-based allowed routes
// ----------------------
const ROLE_ACCESS: Record<string, string[]> = {
  Admin: ["*"],
  "Super Admin": ["*"],
  "Marketing Manager": ["/leads", "/employee"],
  "Technical Manager": ["/service", "/employee"],
  "Telecall Manager": ["/customer"],
  "HR Executive": ["/employee"],
  "Customer Support": ["/customer"],
  Accountant: ["/account"],
  "Stock Clerk": ["/employee", "/stock"],
  "Stock Manager": ["/employee", "/stock"],
  Technician: ["/workspace"],
};

// ----------------------
// Default route per designation
// ----------------------
const DEFAULT_ROUTES: Record<string, string> = {
  Admin: "/dashboard",
  "Super Admin": "/dashboard",
  "Marketing Manager": "/leads",
  "Technical Manager": "/service",
  "Telecall Manager": "/customer",
  "HR Executive": "/employee",
  "Customer Support": "/customer",
  Accountant: "/account",
  "Stock Clerk": "/employee",
  "Stock Manager": "/employee",
  Technician: "/workspace",
};

// ----------------------
// Helper: Verify JWT
// ----------------------
async function verifyJWT(token: string, secret: string) {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}

// ----------------------
// Middleware function
// ----------------------
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // ----------------------
  // Public routes (login/otp)
  // ----------------------
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    if (token) {
      try {
        const decoded = (await verifyJWT(token, process.env.JWT_SECRET!)) as {
          designation: string;
        };
        const role = decoded.designation?.trim();
        const defaultRoute = DEFAULT_ROUTES[role] ?? "/";
        return NextResponse.redirect(new URL(defaultRoute, req.url));
      } catch (err) {
        console.error("Invalid token on public route:", err);
        return NextResponse.next();
      }
    } else {
      return NextResponse.next(); // No token, show login
    }
  }

  // ----------------------
  // Protected routes
  // ----------------------
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = (await verifyJWT(token, process.env.JWT_SECRET!)) as {
      designation: string;
    };
    const role = decoded.designation?.trim();
    const allowedRoutes = ROLE_ACCESS[role];

    if (!allowedRoutes) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (allowedRoutes.includes("*")) {
      return NextResponse.next();
    }

    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ----------------------
// Apply middleware to all routes except static and API
// ----------------------
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
