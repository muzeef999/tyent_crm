import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { employeeValidation } from "@/validations/employeeValidation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validatedData = employeeValidation.parse(body);

    await connectDB();

    // Create a new customer
    const newEmployee = await Employee.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
        data: newEmployee,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = getErrorMessage(err);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
};


export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Get search query, fallback to empty string (no filter)
    const q = searchParams.get("q")?.trim() || "";

    // Parse pagination params safely with defaults and limits
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const page = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
    const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr, 10))) : 10;
    const skip = (page - 1) * limit;

    // Build search filter for MongoDB
    let filter = {};
    if (q) {
      filter = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { contactNumber: { $regex: q, $options: "i" } },
          { designation: { $regex: q, $options: "i" } },
          { status: { $regex: q, $options: "i" } },
          { adharNumber: { $regex: q, $options: "i" } },
          { panNumber: { $regex: q, $options: "i" } },
        ],
      };
    }

    // Fetch total count for pagination
    const total = await Employee.countDocuments(filter);

    // Fetch employees with filter + pagination + sorting by newest
    const employees = await Employee.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Return paginated results
    return NextResponse.json(
      {
        success: true,
        message: "Employees fetched successfully",
        data: employees,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = getErrorMessage(err);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
};
