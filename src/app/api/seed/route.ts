import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getErrorMessage } from "@/utils/getErrorMessage";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    await connectDB();

    const filePath = path.join(
      process.cwd(),
      "src",
      "fakeData",
      "products.json"
    );

    const employees = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Clear existing data (optional)
    await Product.deleteMany();

    // Insert new data
    await Product.insertMany(employees);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Product seeded successfully!",
      }),
      { status: 200 }
    );
  } catch (err) {
    const error  =  getErrorMessage(err);
    return new Response(
      JSON.stringify({ success: false, error: error }),
      { status: 500 }
    );
  }
}
