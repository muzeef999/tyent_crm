import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    // Validate service ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // ✅ Optional: validate employeeId if provided
    if (body.employeeId && !mongoose.Types.ObjectId.isValid(body.employeeId)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }

    await connectDB();

    if(body.employeeId){
    body.assignedDate = new Date(); 

    }

    // ✅ Ensure employeeId is included in the update
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: { ...body, employeeId: body.employeeId } },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service updated successfully",
        data: updatedService,
      },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
};



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
