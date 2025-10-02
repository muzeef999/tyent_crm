import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get("start");
    const endDateStr = searchParams.get("end");

    // 🔹 Build match stage
    const matchStage: any = {};

    if (startDateStr || endDateStr) {
      matchStage.createdAt = {}; // assuming you filter by createdAt

      if (startDateStr) {
        const start = new Date(startDateStr);
        start.setHours(0, 0, 0, 0);
        matchStage.createdAt.$gte = start;
      }

      if (endDateStr) {
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        matchStage.createdAt.$lte = end;
      }
    }

    // 🔹 Run aggregation
    const pipeline: any[] = [];
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({
      $group: {
        _id: "$designation",
        count: { $sum: 1 },
      },
    });

    const result = await Employee.aggregate(pipeline);

    return NextResponse.json(
      { success: true, message: "Analytics fetched successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    const Error = getErrorMessage(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics", details: Error },
      { status: 500 }
    );
  }
};
