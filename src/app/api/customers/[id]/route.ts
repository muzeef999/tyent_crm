import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";
import "@/models/Employee"; // 👈 Important: registers Employee model
import "@/models/Service";  // 👈 also needed if populating serviceHistory/upcomingServices
import "@/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    await connectDB();

    const {searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";

    const customer = await Customer.findById(id)
      .populate("serviceHistory")
      .populate("upcomingServices")
      .populate("serialNumber", "name")
      .populate("installedBy", "name")
      .populate("marketingManager", "name")
      .lean();
    return NextResponse.json(
      { sucess: true, message: customer },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ sucess: false, error: Error }, { status: 500 });
  }
};

