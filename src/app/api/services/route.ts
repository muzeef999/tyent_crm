import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Service from "@/models/Service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

//create customer and service schedule
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json(); // ✅ parse JSON body
    const { customerId, serviceDate, serviceType } = body;

    if (!customerId || !serviceDate || !serviceType) {
      return NextResponse.json(
        {
          success: false,
          message: "customerId, serviceDate, and serviceType are required",
        },
        { status: 400 }
      );
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return NextResponse.json(
        { success: false, Message: "customer not found" },
        { status: 404 }
      );
    }

    const newService = await Service.create({
      customerId,
      serviceDate: new Date(serviceDate),
      serviceType,
      status: "PENDING", // default
    });
 

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully",
        data: newService,
      },
      { status: 201 }
    );
     

  } catch (err) {
    const error = getErrorMessage(err);
   return  NextResponse.json({ success: false, Error: error }, { status: 500 });
  }
};

//get service details

export const GET = async (req: Request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const type = searchParams.get("type"); // monthly, weekly, yearly, or serviceType filter

    const page = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
    const limit = limitStr
      ? Math.min(50, Math.max(1, parseInt(limitStr, 10)))
      : 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

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

    // If type is one of your specific service types, filter by that too
    if (type && !["monthly", "weekly", "yearly"].includes(type)) {
      filter.serviceType = type;
    }

    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .populate("customerId", "name installedModel")
      .populate("employeeId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ serviceDate: 1 })
      .lean();

    // Analytics calculations
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

    const inWarranty = services.filter((s) => s.warrantyStatus === "IN_WARRANTY").length;
    const outWarranty = services.filter((s) => s.warrantyStatus === "OUT_WARRANTY").length;

    const sparesChanged = services.filter((s) => s.sparesChanged?.length > 0).length;
    const generalServicesDue = services.filter((s) => s.serviceType === "GENERAL_SERVICE").length;

    // Group by service type
    const serviceTypeAgg: Record<string, number> = {};
    services.forEach((s) => {
      const t = s.serviceType || "UNKNOWN";
      serviceTypeAgg[t] = (serviceTypeAgg[t] || 0) + 1;
    });
    const serviceType = Object.entries(serviceTypeAgg).map(([type, count]) => ({ type, count }));

    // Average ticket resolution time (only for CLOSED tickets)
    const closedServices = services.filter((s) => s.status === "CLOSED" && s.resolvedAt && s.createdAt);
    const avgResolutionTime =
      closedServices.length > 0
        ? closedServices.reduce((acc, s) => acc + (new Date(s.resolvedAt).getTime() - new Date(s.createdAt).getTime()), 0) /
          closedServices.length /
          1000 / 60 // minutes
        : 0;

    return NextResponse.json(
      {
        success: true,
        message: "Filtered services fetched successfully",
        data: services,
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
          avgResolutionTimeInMinutes: avgResolutionTime.toFixed(2),
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
