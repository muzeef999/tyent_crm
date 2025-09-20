import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Customer from "@/models/Customer";
import Employee from "@/models/Employee";



//edit service details or assign employee
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });

    const body = await req.json();
    await connectDB();

    // Optional: validate employeeId
    if (body.employeeId && !mongoose.Types.ObjectId.isValid(body.employeeId))
      return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });

    if (body.employeeId) body.assignedDate = new Date();

    // Update the service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: { ...body, employeeId: body.employeeId } },
      { new: true, runValidators: true }
    );

    if (!updatedService)
      return NextResponse.json({ error: "Service not found" }, { status: 404 });

    if (body.employeeId) {
      await Employee.findByIdAndUpdate(
        body.employeeId,
        { $addToSet: { assignedServices: updatedService._id } } // prevent duplicates
      );
    }

    // ✅ Move to serviceHistory if completed
    if (body.status === "COMPLETED") {
      const customer = await Customer.findById(updatedService.customerId);
      if (customer) {
        customer.upcomingServices = customer.upcomingServices.filter(
          (svc:any) => svc.toString() !== updatedService._id.toString()
        );
        customer.serviceHistory.push(updatedService._id);
        await customer.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    }, { status: 200 });

  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
};






//get service details by id
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const service = await Service.findById(id).populate("customerId").populate("employeeId").lean();

    return NextResponse.json(
      { success: true, message: service },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ sucess: true, error: Error }, { status: 500 });
  }
};
