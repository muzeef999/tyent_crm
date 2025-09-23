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


export const GET = async (req: Request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q")?.trim() || "";
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const type = searchParams.get("type"); // serviceType or monthly/weekly/yearly
    const status = searchParams.get("status"); // filter status

    const page = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
    const limit = limitStr
      ? Math.min(50, Math.max(1, parseInt(limitStr, 10)))
      : 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    // Free text search
    if (q) {
      filter.$or = [
        { status: { $regex: q, $options: "i" } },
        { serviceType: { $regex: q, $options: "i" } },
        { notes: { $regex: q, $options: "i" } },
      ];
    }

    // Status filter (regex → supports starts/ends/contains)
    if (status) {
      filter.status = { $regex: status, $options: "i" };
    }

    // ServiceType filter (regex → supports starts/ends/contains)
    if (type && !["monthly", "weekly", "yearly"].includes(type)) {
      filter.serviceType = { $regex: type, $options: "i" };
    }

    // Date range
    if (startParam && endParam) {
      filter.serviceDate = {
        $gte: new Date(startParam),
        $lte: new Date(endParam),
      };
    }

    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .populate("customerId", "name installedModel")
      .populate("employeeId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ serviceDate: -1 })
      .lean();

    // Analytics
    const totalTickets = total;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const ticketsToday = await Service.countDocuments({
      ...filter,
      serviceDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // Status counts
    const statusCounts = await Service.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Service type counts
    const serviceTypeCounts = await Service.aggregate([
      { $match: filter },
      { $unwind: "$serviceType" },
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);

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
          statusCounts,
          serviceType: serviceTypeCounts,
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

