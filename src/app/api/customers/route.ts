import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import Service from "@/models/Service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { customerValidation } from "@/validations/Validation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { serialNumber } = body;

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

    const updatedProduct = await Product.findOneAndUpdate(
      { serialNumber },
      {
        status: "Out of Stock",
        assignedTo: newCustomer._id,
        stock: 0,
      }
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

    // Parse parameters
    const q = searchParams.get("q")?.trim() || ""; // string
    const pageStr = searchParams.get("page"); // string | null
    const limitStr = searchParams.get("limit"); // string | null

    const page = pageStr ? Math.max(1, parseInt(pageStr)) : 1;
    const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr))) : 10;
    const skip = (page - 1) * limit;

    // Base match stage (for other filters like price)
    const matchStage: any = {};

    // Price filters (if needed)
    const minPrice = parseFloat(searchParams.get("minPrice") || "");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "");
    if (!isNaN(minPrice)) matchStage.price = { $gte: minPrice };
    if (!isNaN(maxPrice)) matchStage.price = { $lte: maxPrice };

    // Aggregation pipeline
    const pipeline: any[] = [
      { $match: Object.keys(matchStage).length ? matchStage : {} },
      // Join with Employee collection
      {
        $lookup: {
          from: "employees", // Collection name (case-sensitive)
          localField: "installedBy",
          foreignField: "_id",
          as: "installedByEmployee",
        },
      },
      {
        $unwind: {
          path: "$installedByEmployee",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    // Add text search if query exists
    if (q) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { contactNumber: { $regex: q, $options: "i" } },
            { DOB: { $regex: q, $options: "i" } },
            { address: { $regex: q, $options: "i" } },
            // Search in employee name
            { "installedByEmployee.name": { $regex: q, $options: "i" } },
          ],
        },
      });
    }

    // Count total matching documents
    const countPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await Customer.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination and projection
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
          installedModel: 1,

          invoiceNumber: 1,
          price: 1,
          amcRenewed: 1,
          installedBy: {
            _id: "$installedByEmployee._id",
            name: "$installedByEmployee.name",
          },
        },
      }
    );

    const customers = await Customer.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      data: customers,
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
