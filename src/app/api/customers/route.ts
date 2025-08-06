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

export const GET = async () => {
  try {
    await connectDB();
   const customers = await Customer.find({})
  .select('name contactNumber installedModel invoiceNumber price amcRenewed installedBy')
  .sort({ createdAt: -1 })
  .lean();
    return NextResponse.json(
      {
        success: true,
        message: "Customer getting successfully",
        data: customers,
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
