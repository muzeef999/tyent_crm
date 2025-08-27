import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
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

    const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Clear existing data (optional)
    await Product.deleteMany();

    // Insert new data
    const data = await Product.insertMany(products);

    return new Response(
      JSON.stringify({
        success: true,

        message: "Product seeded successfully!",
        data,


      }),
      { status: 200 }
    );
  } catch (err) {
    const error = getErrorMessage(err);
    return new Response(JSON.stringify({ success: false, error: error }), {
      status: 500,
    });
  }
}
