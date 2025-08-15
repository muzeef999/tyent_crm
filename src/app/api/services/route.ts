import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Service from "@/models/Service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    await connectDB();

    // Step 1: Create the customer first
    const newCustomer = await Customer.create(body);

    // Step 2: Create service schedules every 4 months (total 3 visits)
    const createdAt = newCustomer.createdAt;
    const serviceDates = [4, 8, 12].map((monthGap, index) => {
      const serviceDate = new Date(createdAt);
      serviceDate.setMonth(serviceDate.getMonth() + monthGap);
      return {
        customerId: newCustomer._id,
        visitNo: index + 1,
        serviceDate,
        serviceType: [], // empty initially (can be added later)
      };
    });

    // Step 3: Save these service documents
    const upcomingServiceDocs = await Service.insertMany(serviceDates);

    // Step 4: Update customer with upcoming services
    newCustomer.upcomingServices = upcomingServiceDocs.map(
      (service) => service._id
    );
    await newCustomer.save();

    return NextResponse.json(
      {
        success: true,
        message: "Customer and service schedule created successfully",
        data: newCustomer,
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
    const q = searchParams.get("q")?.trim() || "";
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const page = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
    const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr, 10))) : 10;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    if (q) {
      filter = {
        $or: [
          { mode: { $regex: q, $options: "i" } },
          { serviceType: { $regex: q, $options: "i" } },
        ],
      };
    }

    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .populate("customerId", "name installedModel")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

     const  thisMonthCount = 10
     const unsatistfiedCustomerCount = 20
     const notAssignedServicesCount = 30
     const pendingServicesCount =40

    return NextResponse.json(
      {
        success: true,
        message: "Filtered upcoming services fetched successfully",
        data: services,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          thisMonthCount,
          unsatistfiedCustomerCount,
          notAssignedServicesCount,
         pendingServicesCount,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = getErrorMessage(err);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
};
