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

    // query params
    const q = searchParams.get("q")?.trim() || "";
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const type = searchParams.get("type");

    // pagination
    const page = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
    const limit = limitStr
      ? Math.min(50, Math.max(1, parseInt(limitStr, 10)))
      : 10;
    const skip = (page - 1) * limit;

    // 🔎 Build filter object
    const  filter: any = {};

    if (q) {
      filter.$or = [
        { mode: { $regex: q, $options: "i" } },
        { serviceType: { $regex: q, $options: "i" } },
      ];
    }

    if (startParam && endParam) {
      filter.serviceDate = {
        $gte: new Date(startParam),
        $lte: new Date(endParam),
      };
    }

    if (type) {
      filter.serviceType = type;
    }

    // total before pagination
    const total = await Service.countDocuments(filter);

    // main query
    const services = await Service.find(filter)
      .populate("customerId", "name installedModel")
      .populate("employeeId", "name email") // add employee info if needed
      .skip(skip)
      .limit(limit)
      .sort({ serviceDate: 1 })
      .lean();

    // === Analytics (based only on filtered services) ===
    const totalTickets = services.length;
    const ticketsToday = services.filter((s) => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      return s.serviceDate >= startOfDay && s.serviceDate <= endOfDay;
    }).length;

    const inProgress = services.filter((s) => s.status === "IN_PROGRESS").length;
    const closed = services.filter((s) => s.status === "CLOSED").length;
    const cancelled = services.filter((s) => s.status === "CANCELLED").length;
    const pending = services.filter((s) => s.status === "PENDING").length;

    const serviceNotAssigned = services.filter((s) => !s.employeeId).length;

    const inWarranty = services.filter(
      (s) => s.warrantyStatus === "IN_WARRANTY"
    ).length;

    const outWarranty = services.filter(
      (s) => s.warrantyStatus === "OUT_WARRANTY"
    ).length;

    const sparesChanged = services.filter(
      (s) => s.sparesChanged && s.sparesChanged.length > 0
    ).length;

    const generalServicesDue = services.filter(
      (s) => s.serviceType === "GENERAL_SERVICE"
    ).length;

    // group by type
    const serviceTypeAgg: Record<string, number> = {};
    services.forEach((s) => {
      const t = s.serviceType || "UNKNOWN";
      serviceTypeAgg[t] = (serviceTypeAgg[t] || 0) + 1;
    });
    const serviceType = Object.entries(serviceTypeAgg).map(([type, count]) => ({
      type,
      count,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Filtered services fetched successfully",
        data: services, // user + service details
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        analytics: {
          totalTickets,
          ticketsToday,
          inProgress,
          closed,
          cancelled,
          pending,
          serviceNotAssigned,
          inWarranty,
          outWarranty,
          sparesChanged,
          generalServicesDue,
          serviceType,
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
