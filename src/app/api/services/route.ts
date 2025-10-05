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

    // --- Query Params ---
    const q = searchParams.get("q")?.trim() || "";
    const customerQuery = searchParams.get("customer")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const type = searchParams.get("type"); // serviceType or ticketsToday/monthly/weekly/yearly
    const status = searchParams.get("status");

    // --- Build Service Filter ---
    const filter: any = {};

    // Free text search (notes, status, serviceType)
    if (q) {
      filter.$or = [
        { notes: { $regex: q, $options: "i" } },
        { status: { $regex: q, $options: "i" } },
        { serviceType: { $regex: q, $options: "i" } },
      ];
    }

    // Status filter
    if (status) filter.status = { $regex: status, $options: "i" };

    // Service type filter
    if (type && type !== "monthly" && type !== "weekly" && type !== "yearly") {
      if (type === "ticketsToday") {
        const today = new Date();
        filter.serviceDate = {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lte: new Date(today.setHours(23, 59, 59, 999)),
        };
      } else {
        filter.serviceType = { $regex: type, $options: "i" };
      }
    }

    // Date range filter
    if (startParam && endParam) {
      filter.serviceDate = {
        $gte: new Date(startParam),
        $lte: new Date(endParam),
      };
    }

    // --- Fetch Services with Customer Search ---
    const services = await Service.find(filter)
      .populate({
        path: "customerId",
        select: "name email installedModel",
        match: customerQuery
          ? {
              $or: [
                { name: { $regex: customerQuery, $options: "i" } },
                { email: { $regex: customerQuery, $options: "i" } },
              ],
            }
          : undefined,
      })
      .populate("employeeId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ serviceDate: -1 })
      .lean();

    // Remove services where customer didn't match
    const filteredServices = services.filter((s) => s.customerId);

    const total = filteredServices.length;

    // --- Analytics ---
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const ticketsToday = await Service.countDocuments({
      ...filter,
      serviceDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const statusCounts = await Service.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const serviceTypeCounts = await Service.aggregate([
      { $match: filter },
      { $unwind: "$serviceType" },
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      success: true,
      message: "Filtered services fetched successfully",
      data: filteredServices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      analytics: {
        totalTickets: total,
        ticketsToday,
        statusCounts,
        serviceType: serviceTypeCounts,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
};
