import { NextResponse } from "next/server";
import Location from "@/models/Location";
import { connectDB } from "@/lib/mongodb";
import { getErrorMessage } from "@/utils/getErrorMessage";

export async function GET() {
  try {
    await connectDB();

      const locations = await Location.find()
      .populate({
        path: "employeeId",
        select: "name email contactNumber designation status", // Select the fields you want
      })
      .lean();
      
    return NextResponse.json(
      { success: true, message: locations },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const location = await Location.create(body);
    return NextResponse.json(
      { success: true, message: location },
      { status: 201 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
}
