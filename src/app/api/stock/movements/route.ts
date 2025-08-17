import { NextResponse } from "next/server";
import Movement from "@/models/Movement";
import { connectDB } from "@/lib/mongodb";
import { getErrorMessage } from "@/utils/getErrorMessage";

export async function GET() {
  try {
    await connectDB();
    const movements = await Movement.find().populate("productId serialIds");
    return NextResponse.json(
      { success: true, message: movements },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: true, error: Error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const movement = await Movement.create(body);
    return NextResponse.json(
      { success: true, message: movement },
      { status: 201 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
}
