import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const result = await Employee.find({
      designation: "Technician"
    }).lean();

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch Technician" },
      { status: 500 }
    );
  }
};
