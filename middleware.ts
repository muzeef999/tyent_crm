// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/login", "/otp"]; // paths that don't require auth

// Define role-based access rules
const ROLE_ACCESS: Record<string, string[]> = {
  Admin: ["*"], // all routes
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public routes (like login, OTP verify)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. Get JWT token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 3. Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      designation: string;
    };

    const role = decoded.designation;

    // 4. Get allowed routes for this role
    const allowedRoutes = ROLE_ACCESS[role];

    if (!allowedRoutes) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 5. If role has access to all routes
    if (allowedRoutes.includes("*")) {
      return NextResponse.next();
    }

    // 6. Check if current path is in allowed routes
    const isAllowed = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
