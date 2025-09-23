// utils/generateAndSetToken.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function generateAndSetToken(employee: any) {
  // Payload we want inside token
  const payload = {
    id: employee._id,
    customer: employee.name,
    designation: employee.designation, 
  };

  // Sign the JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d", // token valid for 7 days
  });

  // Set the cookie
  const response = NextResponse.json(
    { success: true, message: "Login successful" },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    sameSite: "strict",
    path: "/",
  });

  return { token, response };
}
