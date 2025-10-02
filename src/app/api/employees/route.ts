import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { employeeValidation } from "@/validations/Validation";
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

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const designationStr = searchParams.get("designation")?.trim();
    const startDateStr = searchParams.get("start");
    const endDateStr = searchParams.get("end");

    // 🔹 Filter object
    const filter: any = {};

    // Keyword search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { contactNumber: { $regex: q, $options: "i" } },
        { designation: { $regex: q, $options: "i" } },
        { status: { $regex: q, $options: "i" } },
        { adharNumber: { $regex: q, $options: "i" } },
        { panNumber: { $regex: q, $options: "i" } },
      ];
    }

    // Designation filter
    if (designationStr) {
      filter.designation = { $regex: designationStr, $options: "i" };
    }

    // Date range filter
    if (startDateStr || endDateStr) {
      filter.createdAt = {};

      if (startDateStr) {
        const start = new Date(startDateStr);
        start.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = start;
      }

      if (endDateStr) {
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Pagination logic
    const hasPagination = limitStr !== null;
    const page = hasPagination ? (pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1) : 1;
    const limit = hasPagination ? Math.min(50, Math.max(1, parseInt(limitStr, 10))) : 0;
    const skip = hasPagination ? (page - 1) * limit : 0;

    // Count and query
    const total = await Employee.countDocuments(filter);
    let query = Employee.find(filter).sort({ createdAt: -1 });

    if (hasPagination) {
      query = query.skip(skip).limit(limit);
    }

    const employees = await query.lean();

    // ✅ Response
    return NextResponse.json(
      {
        success: true,
        message: "Employees fetched successfully",
        data: employees,
        pagination: hasPagination
          ? {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            }
          : null,
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

