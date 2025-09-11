import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();

    const result = await Employee.aggregate([
      { $group: { _id: "$designation", count: { $sum: 1 } } },
    ]);
    return NextResponse.json(
      { sucess: true, messaage: result },
      { status: 200 }
    );
  } catch (error) {
    const Error = getErrorMessage(error);
    return NextResponse.json(
      { sucess: false, error: "Failed to fetch analytics", Error },
      { status: 500 }
    );
  }
};
