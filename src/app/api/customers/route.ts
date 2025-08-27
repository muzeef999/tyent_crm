import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import Service from "@/models/Service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { customerValidation } from "@/validations/Validation";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validationResult = customerValidation.safeParse(body);

    // Correct validation check (Zod recommended way)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code, // Include error code
          })),
        },
        { status: 400 }
      );
    }

    await connectDB();

    const newCustomer = await Customer.create(validationResult.data);

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

    // FIX: Find the product by its ID (which is what we're sending as serialNumber)
    const productId = body.serialNumber; // This is actually the product's ObjectId

    const updatedProduct = await Product.findByIdAndUpdate(
      productId, // Find by ID, not by serialNumber field
      {
        status: "Out of Stock",
        assignedTo: newCustomer._id,
        stock: 0,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

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

    // --- parse pagination ---
    const q = searchParams.get("q")?.trim() || "";
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");
    const page = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
    const limit = limitStr
      ? Math.min(100, Math.max(1, parseInt(limitStr, 10)))
      : 10;
    const skip = (page - 1) * limit;

    // --- filters ---
    const matchStage: any = {};

    const id = searchParams.get("id");
    if (id && Types.ObjectId.isValid(id)) {
      matchStage._id = new Types.ObjectId(id);
    }

    const state = searchParams.get("state");
    if (state) matchStage.state = state;

    const city = searchParams.get("city");
    if (city) matchStage.city = city;

    const amc = searchParams.get("amc");
    if (amc) matchStage.amcRenewed = amc;

    const waterType = searchParams.get("waterType");
    if (waterType) matchStage.waterType = waterType;

    const waterMethod = searchParams.get("waterMethod");
    if (waterMethod) matchStage.waterMethod = waterMethod;

    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");


if (startDateStr || endDateStr) {
  matchStage.createdAt = {};
  
  if (startDateStr) {
    // Start of the day
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);
    matchStage.createdAt.$gte = start;
  }

  if (endDateStr) {
    // End of the day
    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);
    matchStage.createdAt.$lte = end;
  }
}


    // warranty bucket
    const warranty = searchParams.get("warranty");
    if (warranty) {
      if (warranty === "<1 yr") matchStage.warrantyYears = { $lt: 1 };
      else if (warranty === "1-2 yrs")
        matchStage.warrantyYears = { $gte: 1, $lt: 2 };
      else if (warranty === "2-3 yrs")
        matchStage.warrantyYears = { $gte: 2, $lt: 3 };
      else if (warranty === ">3 yrs") matchStage.warrantyYears = { $gte: 3 };
    }

    // price filters
    const minPrice = parseFloat(searchParams.get("minPrice") || "");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "");
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      matchStage.price = {};
      if (!isNaN(minPrice)) matchStage.price.$gte = minPrice;
      if (!isNaN(maxPrice)) matchStage.price.$lte = maxPrice;
    }

    const model = searchParams.get("model");

    // --- pipeline ---
    const pipeline: any[] = [
      { $match: matchStage },

      // join product info
      {
        $lookup: {
          from: "products",
          localField: "serialNumber",
          foreignField: "serialNumber",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
    ];

    // filter by model after lookup
    if (model) {
      pipeline.push({ $match: { "productInfo.name": model } });
    }

    // text search
    if (q) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { contactNumber: { $regex: q, $options: "i" } },
            { DOB: { $regex: q, $options: "i" } },
            { address: { $regex: q, $options: "i" } },
          ],
        },
      });
    }

    // count total before pagination
    const countPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await Customer.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    // apply pagination
    pipeline.push(
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          email: 1,
          contactNumber: 1,
          alternativeNumber: 1,
          DOB: 1,
          address: 1,
        },
      }
    );

    // Total customers and revenue for the filtered data
    const summaryPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalRevenue: { $sum: "$price" }, // replace "price" with your revenue field
        },
      },
    ];

    const summaryResult = await Customer.aggregate(summaryPipeline);

    const totalCustomers = summaryResult[0]?.totalCustomers || 0;
    const totalRevenue = summaryResult[0]?.totalRevenue || 0;

    const customers = await Customer.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: customers,
      summary: {  totalCustomers, totalRevenue},
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Search Error:", err);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
};
