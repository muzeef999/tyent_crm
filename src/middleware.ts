// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Add unauthorized to public paths
const PUBLIC_PATHS = ["/login", "/otp", "/unauthorized"];

const allowedOrigins = ['*']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const ROLE_ACCESS: Record<string, string[]> = {
  "Admin": ["*"],
  "Super Admin": ["*"],
  "Marketing Manager": ["/leads", "/"],
  "Technical Manager": ["/service", "/employee", "/customer"],
  "Telecall Manager": ["/customer"],
  "HR Executive": ["/employee"],
  "Customer Support": ["/customer"],
  "Accountant": ["/account"],
  "Stock Clerk": ["/employee", "/stock"],
  "Stock Manager": ["/employee", "/stock"],
  "Technician": ["/employee/workspace"],
};

const DEFAULT_ROUTES: Record<string, string | string[]> = {
  "Admin": "/customer",
  "Super Admin": "/customer",
  "Marketing Manager": "/leads",
  "Technical Manager": "/service",
  "Telecall Manager": "/customer",
  "HR Executive": "/employee",
  "Customer Support": "/customer",
  "Accountant": "/account",
  "Stock Clerk": "/employee",
  "Stock Manager": "/stock",
  "Technician": ["/employee/workspace", "/employee"],
};

async function verifyJWT(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw error;
  }
}

export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)
 
  // Handle preflighted requests
  const isPreflight = req.method === 'OPTIONS'
 
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  const response = NextResponse.next()
 
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
 
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("Pathname:", pathname);

  // Check if it's a public path (including unauthorized)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    console.log("Public path access granted");
    return NextResponse.next();
  }

  if (!token) {
    console.log("No token, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = (await verifyJWT(token, process.env.JWT_SECRET!)) as {
      designation: string;
    };
    
    console.log("User role:", decoded.designation);
    
    const role = decoded.designation?.trim();
    const allowedRoutes = ROLE_ACCESS[role];

    if (!allowedRoutes) {
      console.log("No allowed routes found for role:", role);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (allowedRoutes.includes("*")) {
      console.log("User has access to all routes");
      return NextResponse.next();
    }

    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));
    console.log("Is path allowed:", isAllowed, "for path:", pathname);

    if (!isAllowed) {
      console.log("Access denied for path:", pathname);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    console.log("Access granted");
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};