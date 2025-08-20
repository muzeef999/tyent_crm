import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {

    const { id } = await params;

    await connectDB();

    const product = await Product.findOne({ serialNumber: id });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: product }, // Changed 'message' to 'data' for better convention
      { status: 200 }
    );
  } catch (err) {
    const error = getErrorMessage(err);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
