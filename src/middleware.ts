import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ✅ Paths that don't require auth (e.g. login, otp)
const PUBLIC_PATHS: string[] = ["/login", "/otp", "/unauthorized"];

// ✅ Allowed origins for CORS
const allowedOrigins: string[] = [
  "https://tyent.co.in",
  "http://localhost:3000",
];

// ✅ CORS options
const corsOptions: Record<string, string> = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// ✅ Role-based route access
const ROLE_ACCESS: Record<string, string[]> = {
  Admin: ["*"],
  "Super Admin": ["*"],
  "Marketing Manager": ["/leads", "/"],
  "Technical Manager": ["/service", "/employee", "/customer"],
  "Telecall Manager": ["/customer"],
  "HR Executive": ["/employee"],
  "Customer Support": ["/customer"],
  Accountant: ["/account"],
  "Stock Clerk": ["/employee", "/stock"],
  "Stock Manager": ["/employee", "/stock"],
  Technician: ["/employee/workspace"],
};

// ✅ Default routes for roles
const DEFAULT_ROUTES: Record<string, string | string[]> = {
  Admin: "/customer",
  "Super Admin": "/customer",
  "Marketing Manager": "/leads",
  "Technical Manager": "/service",
  "Telecall Manager": "/customer",
  "HR Executive": "/employee",
  "Customer Support": "/customer",
  Accountant: "/account",
  "Stock Clerk": "/employee",
  "Stock Manager": "/stock",
  Technician: ["/employee/workspace", "/employee"],
};

// ✅ Helper: Verify JWT
async function verifyJWT(token: string, secret: string): Promise<any> {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  // 🧭 Handle CORS preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    const preflightHeaders: Record<string, string> = { ...corsOptions };
    if (isAllowedOrigin) {
      preflightHeaders["Access-Control-Allow-Origin"] = origin;
    }
    return new NextResponse(null, {
      status: 204,
      headers: preflightHeaders,
    });
  }

  // ✅ Add CORS headers for all responses
  const response = NextResponse.next();
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // ✅ Allow API routes without redirect
  if (pathname.startsWith("/api/")) {
    // If you want to protect API, uncomment:
    /*
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            ...corsOptions,
          },
        }
      );
    }
    */
    return response;
  }

  // 🛡️ Public paths (no auth needed)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    if (token) {
      try {
        const decoded = await verifyJWT(token, process.env.JWT_SECRET!);
        const role = decoded.designation?.trim();
        const defaultRouteRaw = DEFAULT_ROUTES[role] ?? "/";
        const defaultRoute = Array.isArray(defaultRouteRaw)
          ? defaultRouteRaw[0]
          : defaultRouteRaw;
        return NextResponse.redirect(new URL(defaultRoute, req.url));
      } catch (err) {
        console.error("Invalid token on public route:", err);
        return response;
      }
    } else {
      return response;
    }
  }

  // 🔐 Protected page routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = await verifyJWT(token, process.env.JWT_SECRET!);
    const role: string | undefined = decoded.designation?.trim();
    const allowedRoutes = ROLE_ACCESS[role ?? ""];

    if (!allowedRoutes) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (allowedRoutes.includes("*")) {
      return response;
    }

    const isAllowed = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return response;
  } catch (err) {
    console.error("JWT verify failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*", // 👈 ensures CORS on API
  ],
};
