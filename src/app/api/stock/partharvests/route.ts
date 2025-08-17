import { NextResponse } from "next/server";
import PartHarvest from "@/models/PartHarvest";
import { connectDB } from "@/lib/mongodb";
import { getErrorMessage } from "@/utils/getErrorMessage";

export async function GET() {
  try{
  await connectDB();
  const parts = await PartHarvest.find().populate("sourceProductId partProductId");
  return NextResponse.json({success:true, message:parts},{status:200});
  }catch(err){
      const Error = getErrorMessage(err);
      return NextResponse.json({success:true, error: Error},{status: 500});
    }
}

export async function POST(req: Request) {
  try{
  await connectDB();
  const body = await req.json();
  const part = await PartHarvest.create(body);
  return NextResponse.json({success:true, message:part}, { status: 201 });
  }catch(err){
      const Error = getErrorMessage(err);
      return NextResponse.json({success:false, error: Error},{status: 500});
    }
}
