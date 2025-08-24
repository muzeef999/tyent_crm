// @/app/utils/generateAndSetToken.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function generateAndSetToken(user: { _id: string }) {
  // 1️⃣ Generate JWT token (expires in 24h)
  const token = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  // 2️⃣ Create a NextResponse to set the cookie
  const response = NextResponse.json({ success: true, message: "Logged in" });

  // 3️⃣ Set the cookie using Next.js cookie API
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // 4️⃣ Return both token and response
  return { token, response };
}
