// utils/generateAndSetToken.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function generateAndSetToken(employee: any) {

    const firstName = employee.name.split(" ")[0]; 
  

  const payload = {
    id: employee._id,
    customer: firstName,
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
    httpOnly: true, // JS cannot read
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protectio
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { token, response };
}
