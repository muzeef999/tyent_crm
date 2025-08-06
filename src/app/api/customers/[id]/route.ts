import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    await connectDB();

    const customer = await Customer.findById(id).populate("upcomingServices").lean();
    return NextResponse.json({ sucess: true, message:customer }, { status: 200 });
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ sucess: false, error: Error }, { status: 500 });
  }
};
