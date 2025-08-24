import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { generateAndSetToken } from "@/utils/generateAndSetToken";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getOtpFromRedis } from "@/utils/saveOtpToRedis";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { contactNumber, otp } = await req.json();

    const trimmedOtp = otp?.toString().trim();

    if (!contactNumber) {
      return NextResponse.json(
        { success: false, error: "Contact number is required" },
        { status: 400 }
      );
    }

    if (!trimmedOtp) {
      return NextResponse.json(
        { success: false, error: "OTP is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const employee = await Employee.findOne({ contactNumber });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    // ✅ Use the phone number as the key
    const otpKey = `phone:${contactNumber}`;
    const storedOtp = await getOtpFromRedis(otpKey) as string | null;

    console.log("Stored OTP:", storedOtp);
    console.log("Received OTP:", trimmedOtp);

    // Convert both OTPs to string for consistent comparison
    const storedOtpString = storedOtp?.toString().trim();
    const receivedOtpString = trimmedOtp.toString().trim();

    console.log("Stored OTP (string):", storedOtpString);
    console.log("Received OTP (string):", receivedOtpString);

    if (!storedOtp) {
      return NextResponse.json(
        { success: false, error: "OTP not found" },
        { status: 404 }
      );
    }

if (storedOtpString !== receivedOtpString) {
  return NextResponse.json(
    { success: false, error: "Invalid OTP" },
    { status: 400 }
  );
}

    // Generate token and set cookie
    const { token, response } = await generateAndSetToken(employee);

    return response; // Cookie is already set; you can also include token in JSON if needed
  } catch (error) {
    const Error = getErrorMessage(error);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
};
