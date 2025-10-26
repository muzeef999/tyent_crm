// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const PUBLIC_PATHS = ["/login", "/otp", "/unauthorized"];

// const allowedOrigins = ['*','https://tyent.co.in', 'http://localhost:3000];

// const corsOptions = {
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// }



// const ROLE_ACCESS: Record<string, string[]> = {
//   "Admin": ["*"],
//   "Super Admin": ["*"],
//   "Marketing Manager": ["/leads", "/"],
//   "Technical Manager": ["/service", "/employee", "/customer"],
//   "Telecall Manager": ["/customer"],
//   "HR Executive": ["/employee"],
//   "Customer Support": ["/customer"],
//   "Accountant": ["/account"],
//   "Stock Clerk": ["/employee", "/stock"],
//   "Stock Manager": ["/employee", "/stock"],
//   "Technician": ["/employee/workspace"],
// };

// const DEFAULT_ROUTES: Record<string, string | string[]> = {
//   "Admin": "/customer",
//   "Super Admin": "/customer",
//   "Marketing Manager": "/leads",
//   "Technical Manager": "/service",
//   "Telecall Manager": "/customer",
//   "HR Executive": "/employee",
//   "Customer Support": "/customer",
//   "Accountant": "/account",
//   "Stock Clerk": "/employee",
//   "Stock Manager": "/stock",
//   "Technician": ["/employee/workspace", "/employee"],
// };

// async function verifyJWT(token: string, secret: string) {
//   const secretKey = new TextEncoder().encode(secret);
//   const { payload } = await jwtVerify(token, secretKey);
//   return payload;
// }

// export async function middleware(req: NextRequest) {


//     const origin = req.headers.get('origin') ?? ''
//   const isAllowedOrigin = allowedOrigins.includes(origin)
 
//   // Handle preflighted requests
//   const isPreflight = req.method === 'OPTIONS'
 
//   if (isPreflight) {
//     const preflightHeaders = {
//       ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
//       ...corsOptions,
//     }
//     return NextResponse.json({}, { headers: preflightHeaders })
//   }

//     const response = NextResponse.next()
 
//   if (isAllowedOrigin) {
//     response.headers.set('Access-Control-Allow-Origin', origin)
//   }
 
//   Object.entries(corsOptions).forEach(([key, value]) => {
//     response.headers.set(key, value)
//   })
 




//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("token")?.value;

//   if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
//     if (token) {
//       try {
//         const decoded = (await verifyJWT(token, process.env.JWT_SECRET!)) as {
//           designation: string;
//         };
//         const role = decoded.designation?.trim();
//         const defaultRouteRaw = DEFAULT_ROUTES[role] ?? "/";
//         const defaultRoute = Array.isArray(defaultRouteRaw) ? defaultRouteRaw[0] : defaultRouteRaw;
//         return NextResponse.redirect(new URL(defaultRoute, req.url));
//       } catch (err) {
//         console.error("Invalid token on public route:", err);
//         return NextResponse.next();
//       }
//     } else {
//       return NextResponse.next(); // No token, show login
//     }
//   }

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded = (await verifyJWT(token, process.env.JWT_SECRET!)) as {
//       designation: string;
//     };
//     const role = decoded.designation?.trim();
//     const allowedRoutes = ROLE_ACCESS[role];

//     if (!allowedRoutes) {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     if (allowedRoutes.includes("*")) {
//       return NextResponse.next();
//     }

//     const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

//     if (!isAllowed) {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT verify failed:", err);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }


// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/otp", "/unauthorized"];

const allowedOrigins = [
  "https://tyent.co.in",
  "http://localhost:3000",
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// 👤 Role-based access config
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
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin =
    allowedOrigins.includes(origin);

  // 🧭 Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    const preflightHeaders: Record<string, string> = {
      ...corsOptions,
    };
    if (isAllowedOrigin) {
      preflightHeaders["Access-Control-Allow-Origin"] = origin;
    }
    return new NextResponse(null, {
      status: 204,
      headers: preflightHeaders,
    });
  }

  // ✅ Add CORS headers for normal requests
  const response = NextResponse.next();
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 🛡️ Auth logic
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    if (token) {
      try {
        const decoded = (await verifyJWT(
          token,
          process.env.JWT_SECRET!
        )) as { designation: string };
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
      return response; // no token, allow login page
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = (await verifyJWT(
      token,
      process.env.JWT_SECRET!
    )) as { designation: string };
    const role = decoded.designation?.trim();
    const allowedRoutes = ROLE_ACCESS[role];

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

// ✅ Add API routes to matcher too if you want to handle CORS globally
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
