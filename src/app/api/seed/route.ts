
import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    await connectDB();

    // Read employees.json
        const filePath = path.join(process.cwd(), "src", "fakeData", "employees.json");

    const employees = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Clear existing data (optional)
    await Employee.deleteMany();

    // Insert new data
    await Employee.insertMany(employees);

    return new Response(
      JSON.stringify({ success: true, message: "Employees seeded successfully!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error seeding employees:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Error seeding employees" }),
      { status: 500 }
    );
  }
}
