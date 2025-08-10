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

export const GET = async () => {
  try {
    await connectDB();

    
   const Services  = await Service.find().populate("customerId", "name installedModel");

    
    return NextResponse.json(
      {
        success: true,
        message: "Filtered upcoming services fetched successfully",
        data: Services,
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
