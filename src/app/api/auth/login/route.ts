import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { saveOtpToRedis } from "@/utils/saveOtpToRedis";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const phone = (req.nextUrl.searchParams.get("contactNumber") || "").trim();
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const employee = await Employee.findOne({ contactNumber: phone }).lean();



    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 400 }
      );
    }


    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to Redis
    await saveOtpToRedis(`phone:${phone}`, otp);

    console.log(`Generated OTP for ${phone}: ${otp}`);

    // Send OTP via Bulkly
    // await axios.post("https://live.bulkly.io/api/sendbulkly", {
    //   phoneId: "333862093154829",
    //   otp,
    //   recipientPhone: phone,
    //   templateId: "1531142600990906",
    // });


    return NextResponse.json(
      { success: true, message: "OTP sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    const Error = getErrorMessage(error);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
};
