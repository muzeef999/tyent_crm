import { NextResponse } from "next/server";
import Serial from "@/models/Serial";
import { connectDB } from "@/lib/mongodb";
import { getErrorMessage } from "@/utils/getErrorMessage";

export async function GET() {
  try {
    await connectDB();
    const serials = await Serial.find();
    return NextResponse.json(
      { success: true, message: serials },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json(
      { success: true, message: Error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const serial = await Serial.create(body);
    return NextResponse.json(
      { success: true, message: serial },
      { status: 201 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
}
