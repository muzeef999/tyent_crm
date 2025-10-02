import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const result = await Employee.find({
      designation: "Marketing Manager",
    }).lean();

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch Marketing Managers" },
      { status: 500 }
    );
  }
};
