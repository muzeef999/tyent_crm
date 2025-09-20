import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const employee = await Employee.findById(id)
      .populate({
        path: "assignedServices",
        populate: {
          path: "customerId",
          select: "name contactNumber alternativeNumber address serialNumber",
        },
      })
      .lean();

    return NextResponse.json(
      { success: true, message: employee },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
};
