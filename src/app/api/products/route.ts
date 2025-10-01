import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { getErrorMessage } from "@/utils/getErrorMessage";

export async function GET() {
  try {
    await connectDB();

    const groupedProducts = await Product.aggregate([
      {
        $match: { status: "In Stock" } // ✅ filter only stock items
      },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1
        }
      },
      {
        $sort: { name: 1}
      }
    ]);

    return NextResponse.json(
      { success: true, message: groupedProducts },
      { status: 200 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
}



export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(
      { sucess: true, message: product },
      { status: 201 }
    );
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ sucess: false, error: Error }, { status: 500 });
  }
}
