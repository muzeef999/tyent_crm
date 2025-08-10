import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Service from "@/models/Service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    await connectDB();
    const newCustomer = await Customer.create(body);

    const today = new Date();
    const serviceList = [];

    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(today);

      futureDate.setMonth(today.getMonth() + i * 4); // every 4 months
      serviceList.push({
        customerId: newCustomer._id,
        visitNo: i,
        serviceDate: futureDate,
        serviceType: ["GENERAL_SERVICE"],
      });
    }

    const createdServices = await Service.insertMany(serviceList);

    newCustomer.upcomingServices = createdServices.map((s) => s._id);
    await newCustomer.save();

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
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

    // Get search query from query param, fallback to empty string (no filter)
    const q = searchParams.get("q")?.trim() || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");


      // 🔹 Pagination params
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const skip = (page - 1) * limit;


    // Build the filter object for MongoDB
    const filters: any[] = [];

    if (q) {
      // Search text in multiple fields with case-insensitive regex
      filters.push({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { contactNumber: { $regex: q, $options: "i" } },
          { installedModel: { $regex: q, $options: "i" } },
          { invoiceNumber: { $regex: q, $options: "i" } },
          { installedBy: { $regex: q, $options: "i" } },
          // You can add more fields if needed
        ],
      });
    }

    // Price filters example
    if (minPrice) filters.push({ price: { $gte: Number(minPrice) } });
    if (maxPrice) filters.push({ price: { $lte: Number(maxPrice) } });

    // If filters array has conditions, combine with $and, else empty filter = get all
    const query = filters.length > 0 ? { $and: filters } : {};

    const total = await Customer.countDocuments(query)

    const customers = await Customer.find(query)
      .select(
        "name contactNumber installedModel invoiceNumber price amcRenewed installedBy"
      )
      .sort({ createdAt: -1 }).skip(skip).limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Customer fetched successfully",
        data: customers,
        pagination : {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
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