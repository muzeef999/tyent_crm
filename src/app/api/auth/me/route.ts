import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";


export const GET = async (req:NextRequest,) => {

    const token = req.cookies.get("token")?.value;


      if (!token) return  NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

      try {
        const decoded = verify(token, process.env.JWT_SECRET!);
        return NextResponse.json({ success: true, user: decoded }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
      }

}



export const POST = async (req: NextRequest) => {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Remove the token by setting cookie with maxAge 0
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0, // immediately expires the cookie
    sameSite: "strict",
  });

  return response;
};
