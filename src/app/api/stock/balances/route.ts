import { NextResponse } from "next/server";
import Balance from "@/models/Balance";
import { connectDB } from "@/lib/mongodb";
import { getErrorMessage } from "@/utils/getErrorMessage";

export async function GET() {
  try {
  await connectDB();
  const balances = await Balance.find().populate("productId locationId");
  return NextResponse.json({success:true, message:balances},{status:200});
  }catch(err){
    const Error = getErrorMessage(err);
    return NextResponse.json({success:true, error: Error},{status: 500});
  }
}

export async function POST(req: Request) {
  try {
  await connectDB();
  const body = await req.json();
  const balance = await Balance.create(body);
  return NextResponse.json({success:true, message:balance}, { status: 201 });
  } catch(err){
    const Error = getErrorMessage(err);
    return NextResponse.json({success:false, error: Error},{status: 500});
  }
}
